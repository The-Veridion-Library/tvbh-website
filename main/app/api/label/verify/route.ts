import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { generateLabelPdf } from '@/lib/pdf';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const labelId = url.searchParams.get('labelId');

  if (!labelId) return NextResponse.json({ error: 'Missing labelId' }, { status: 400 });

  const client = await pool.connect();
  try {
    const found = await client.query(
      `SELECT 
        labels.id AS label_id,
        labels.book_id,
        labels.status,
        labels.printed_at,
        books.title AS book_title,
        books.author AS book_author
      FROM labels
      JOIN books ON books.id = labels.book_id
      WHERE labels.id = $1`,
      [labelId]
    );

    if (found.rowCount === 0) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    const label = found.rows[0];

    // State checks
    if (label.status === 'PRINTED') return NextResponse.json({ error: 'Label already printed' }, { status: 409 });
    if (label.status === 'REVOKED') return NextResponse.json({ error: 'Cannot print a revoked label' }, { status: 400 });
    if (label.status !== 'CREATED') return NextResponse.json({ error: 'Label not printable', status: label.status }, { status: 400 });

    const update = await client.query(
      `UPDATE labels
       SET status='PRINTED', printed_at=NOW()
       WHERE id=$1 AND status='CREATED'
       RETURNING id AS label_id, book_id, status, printed_at`,
      [labelId]
    );

    if (update.rowCount === 0) {
      return NextResponse.json({ error: 'Concurrent state change' }, { status: 409 });
    }

    const updated = update.rows[0];

    // Generate PDF
    const pdfBytes = await generateLabelPdf({
      labelId: updated.label_id,
      bookId: updated.book_id,
      title: label.book_title,
      author: label.book_author,
      printedAt: updated.printed_at,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    });

    return new NextResponse(pdfBytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=label-${labelId}.pdf`,
      },
    });
  } catch (err: unknown) {
    console.error('Print error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}