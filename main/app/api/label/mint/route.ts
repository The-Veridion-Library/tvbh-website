import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const bookId = url.searchParams.get('bookId');

  if (!bookId) return NextResponse.json({ error: 'Missing bookId' }, { status: 400 });

  const client = await pool.connect();
  try {
    // Check for existing non-revoked label for this book
    const existingResult = await client.query(
      `SELECT id, book_id FROM labels WHERE book_id = $1 AND status != 'REVOKED' ORDER BY created_at DESC LIMIT 1`,
      [bookId]
    );

    let revokedLabel = null;

    // If an existing label exists, mark it as REVOKED and set revoked timestamp
    if (existingResult.rows.length > 0) {
      const existingLabel = existingResult.rows[0];
      const revokeResult = await client.query(
        `UPDATE labels
         SET status = 'REVOKED', revoked_at = now()
         WHERE id = $1
         RETURNING id, book_id, status, revoked_at`,
        [existingLabel.id]
      );
      revokedLabel = revokeResult.rows[0];
    }

    // Mint the new label
    const newLabelResult = await client.query(
      `INSERT INTO labels (book_id) VALUES ($1) RETURNING id, book_id, status`,
      [bookId]
    );

    const responseObj = {
      success: true,
      message: revokedLabel
        ? 'An existing label was found. Marked as REVOKED; new label minted.'
        : 'No existing label found; new label minted.',
      revokedLabel: revokedLabel
        ? {
            id: revokedLabel.id,
            bookId: revokedLabel.book_id,
            status: revokedLabel.status,
            revokedAt: revokedLabel.revoked_at,
          }
        : null,
      newLabel: {
        id: newLabelResult.rows[0].id,
        bookId: newLabelResult.rows[0].book_id,
        status: newLabelResult.rows[0].status || 'CREATED',
      },
      meta: {
        mintedAt: new Date().toISOString(),
      },
    };

    return new NextResponse(JSON.stringify(responseObj, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('Mint error:', err);
    const message =
      err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}