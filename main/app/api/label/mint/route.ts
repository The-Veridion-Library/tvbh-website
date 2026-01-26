import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const bookId = url.searchParams.get('bookId');

  if (!bookId) return NextResponse.json({ error: 'Missing bookId' }, { status: 400 });

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO labels (book_id) VALUES ($1) RETURNING id, book_id`,
      [bookId]
    );

    return NextResponse.json({
      paperId: result.rows[0].id,
      bookId: result.rows[0].book_id,
      status: 'CREATED',
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