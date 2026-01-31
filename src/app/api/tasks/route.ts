import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from '@/lib/github'

const DATA_PATH = 'data/tasks.json'

export async function GET() {
  try {
    const file = await readFile(DATA_PATH)
    if (!file) return NextResponse.json({ tasks: [] }, { status: 404 })
    const tasks = JSON.parse(file.content)
    return NextResponse.json({ tasks })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read tasks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tasks } = await req.json()
    if (!Array.isArray(tasks)) return NextResponse.json({ error: 'tasks must be an array' }, { status: 400 })
    const ok = await writeFile(DATA_PATH, JSON.stringify(tasks, null, 2), 'Update tasks')
    if (!ok) return NextResponse.json({ error: 'Failed to write tasks' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save tasks' }, { status: 500 })
  }
}
