import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const labelId = url.searchParams.get('labelId');

  if (!labelId) return NextResponse.json({ error: 'Missing labelId' }, { status: 400 });

  const client = await pool.connect();
  try {
    // Fetch label with book info using a JOIN
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
    if (label.status === 'PRINTED') {
      return NextResponse.json({ error: 'Label has already been printed', status: label.status }, { status: 409 });
    }
    if (label.status === 'REVOKED') {
      return NextResponse.json({ error: 'Cannot print a revoked label', status: label.status }, { status: 400 });
    }
    if (label.status !== 'CREATED') {
      return NextResponse.json({ error: 'Label is not in a printable state', status: label.status }, { status: 400 });
    }

    // Update label status
    const update = await client.query(
      `UPDATE labels
       SET status='PRINTED', printed_at=NOW()
       WHERE id=$1 AND status='CREATED'
       RETURNING id AS label_id, book_id, status, printed_at`,
      [labelId]
    );

    if (update.rowCount === 0) {
      return NextResponse.json({ error: 'Unable to print label due to concurrent state change' }, { status: 409 });
    }

    const updated = update.rows[0];

    // --- PDF Generation ---
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Background (white)
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

    // Title
    page.drawText('Book Label', {
      x: 50,
      y: height - 80,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });

    // Book info table
    page.drawText(`Label ID: ${updated.label_id}`, { x: 50, y: height - 130, size: 14, font: regularFont });
    page.drawText(`Book ID: ${updated.book_id}`, { x: 50, y: height - 160, size: 14, font: regularFont });
    page.drawText(`Title: ${label.book_title}`, { x: 50, y: height - 190, size: 14, font: regularFont });
    page.drawText(`Author: ${label.book_author}`, { x: 50, y: height - 220, size: 14, font: regularFont });
    page.drawText(`Printed At: ${updated.printed_at.toISOString()}`, { x: 50, y: height - 250, size: 14, font: regularFont });

    // QR Code for label URL
    const qrDataUrl = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_APP_URL}/labels/${labelId}`);
    const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    const qrDims = qrImage.scale(1.5);
    page.drawImage(qrImage, { x: width / 2 - qrDims.width / 2, y: 50, width: qrDims.width, height: qrDims.height });

    const pdfBytes = await pdfDoc.save();

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