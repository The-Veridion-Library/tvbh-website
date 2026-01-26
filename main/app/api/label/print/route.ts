import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const paperId = url.searchParams.get('paperId');

  if (!paperId) return NextResponse.json({ error: 'Missing paperId' }, { status: 400 });

  const client = await pool.connect();
  try {
    const update = await client.query(
      `UPDATE labels SET status='PRINTED', printed_at=NOW() WHERE id=$1 RETURNING *`,
      [paperId]
    );

    if (update.rowCount === 0) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    // TODO: generate PDF
    const pdfUrl = `/pdfs/${paperId}.pdf`;

    return NextResponse.json({
      paperId,
      status: 'PRINTED',
      pdfUrl,
    });
  } catch (err: unknown) {
    console.error('Print error:', err);
    const message =
      err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}