import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const paperId = url.searchParams.get('paperId');

  if (!paperId) return NextResponse.json({ error: 'Missing paperId' }, { status: 400 });

  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM labels WHERE id=$1`, [paperId]);
    if (res.rowCount === 0) {
      return NextResponse.json({ valid: false, reason: 'Not found' });
    }

    const label = res.rows[0];
    return NextResponse.json({
      valid: true,
      status: label.status,
      bookId: label.book_id,
      printedAt: label.printed_at,
    });
  } catch (err: unknown) {
    console.error('Verify error:', err);
    const message =
      err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}