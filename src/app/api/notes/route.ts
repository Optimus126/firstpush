import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from '@/lib/github'

const DATA_PATH = 'data/notes.json'

export async function GET() {
  try {
    const file = await readFile(DATA_PATH)
    if (!file) return NextResponse.json({ notes: '' }, { status: 404 })
    const data = JSON.parse(file.content)
    return NextResponse.json({ notes: data.notes || '' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read notes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json()
    if (typeof notes !== 'string') return NextResponse.json({ error: 'notes must be a string' }, { status: 400 })
    const ok = await writeFile(DATA_PATH, JSON.stringify({ notes }, null, 2), 'Update shared notes')
    if (!ok) return NextResponse.json({ error: 'Failed to write notes' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 })
  }
}
