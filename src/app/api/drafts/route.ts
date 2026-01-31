import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DRAFTS_DIR = path.join(process.cwd(), 'drafts')

export async function GET() {
  try {
    const files = await fs.readdir(DRAFTS_DIR)
    const drafts = await Promise.all(
      files
        .filter(f => f.endsWith('.md'))
        .map(async (filename) => {
          const filePath = path.join(DRAFTS_DIR, filename)
          const content = await fs.readFile(filePath, 'utf-8')
          const stats = await fs.stat(filePath)
          
          // Extract title from first line
          const firstLine = content.split('\n')[0]
          const title = firstLine.replace(/^#\s*/, '').trim() || filename
          
          // Get preview (first 200 chars after title)
          const preview = content
            .split('\n')
            .slice(1)
            .join('\n')
            .replace(/[#*_`\[\]]/g, '')
            .trim()
            .slice(0, 200) + '...'
          
          // Categorize by filename
          let category = 'Other'
          if (filename.includes('blog')) category = 'Blog'
          else if (filename.includes('social') || filename.includes('facebook') || filename.includes('linkedin') || filename.includes('reddit')) category = 'Social'
          else if (filename.includes('email') || filename.includes('lead')) category = 'Email'
          else if (filename.includes('strategy') || filename.includes('analysis') || filename.includes('research') || filename.includes('domain') || filename.includes('competitor')) category = 'Research'
          else if (filename.includes('improvement') || filename.includes('tracker') || filename.includes('bidshield') || filename.includes('conversion')) category = 'Product'
          else if (filename.includes('personal') || filename.includes('budget')) category = 'Personal'
          
          return {
            filename,
            title,
            preview,
            category,
            content,
            modifiedAt: stats.mtime.toISOString(),
            size: stats.size,
          }
        })
    )
    
    // Sort by modified date (newest first)
    drafts.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
    
    return NextResponse.json({ drafts })
  } catch (error) {
    console.error('Error reading drafts:', error)
    return NextResponse.json({ drafts: [], error: 'Failed to read drafts' }, { status: 500 })
  }
}
