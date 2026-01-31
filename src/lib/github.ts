const REPO = 'Maldonado7/the-ark'
const BRANCH = 'main'
const TOKEN = process.env.GITHUB_TOKEN || ''

interface GitHubFile {
  content: string
  sha: string
}

export async function readFile(path: string): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github.v3+json' }, cache: 'no-store' }
  )
  if (!res.ok) return null
  const data = await res.json()
  const content = Buffer.from(data.content, 'base64').toString('utf-8')
  return { content, sha: data.sha }
}

export async function writeFile(path: string, content: string, message: string): Promise<boolean> {
  // Get current sha if file exists
  const existing = await readFile(path)
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH,
  }
  if (existing) body.sha = existing.sha

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  return res.ok
}
