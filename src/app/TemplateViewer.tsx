'use client'

import { useState, useEffect } from 'react'

type TemplateData = Record<string, Record<string, string[][]>>
type ReviewStatus = 'not-reviewed' | 'needs-changes' | 'approved'

const STATUS_CONFIG: Record<ReviewStatus, { label: string; color: string; next: ReviewStatus }> = {
  'not-reviewed': { label: 'Not Reviewed', color: 'bg-slate-600 text-slate-300', next: 'needs-changes' },
  'needs-changes': { label: 'Needs Changes', color: 'bg-red-500/80 text-white', next: 'approved' },
  'approved': { label: 'Approved ✓', color: 'bg-green-500/80 text-white', next: 'not-reviewed' },
}

const SHEETS = ['Dashboard', 'Material_Takeoff', 'Labor_Calculator', 'Recap', 'Proposal', 'Price_List']

function isCurrencyCell(val: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) > 0
}

function isSectionHeader(row: string[]): boolean {
  const joined = row.join('')
  return joined.includes('---') && joined.replace(/[-\s]/g, '').length > 0
}

function formatCell(val: string, colIdx: number, headerRow: string[]): string {
  if (!val) return ''
  const header = (headerRow?.[colIdx] || '').toLowerCase()
  const isCostCol = header.includes('cost') || header.includes('price') || header.includes('total') || header.includes('rate')
  if (isCostCol && /^\d+(\.\d+)?$/.test(val)) {
    return '$' + parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return val
}

export default function TemplateViewer() {
  const [data, setData] = useState<TemplateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedSheet, setSelectedSheet] = useState<string>('Dashboard')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>({})

  useEffect(() => {
    fetch('/templates-data.json')
      .then(r => r.json())
      .then((d: TemplateData) => {
        setData(d)
        setSelectedTemplate(Object.keys(d)[0] || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))

    try {
      const savedNotes = localStorage.getItem('mc2-template-notes')
      if (savedNotes) setNotes(JSON.parse(savedNotes))
      const savedStatuses = localStorage.getItem('mc2-template-statuses')
      if (savedStatuses) setStatuses(JSON.parse(savedStatuses))
    } catch {}
  }, [])

  useEffect(() => {
    if (Object.keys(notes).length > 0) localStorage.setItem('mc2-template-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (Object.keys(statuses).length > 0) localStorage.setItem('mc2-template-statuses', JSON.stringify(statuses))
  }, [statuses])

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading templates...</div>
  if (!data) return <div className="flex items-center justify-center h-64 text-red-400">Failed to load template data</div>

  const templates = Object.keys(data)
  const sheetData = data[selectedTemplate]?.[selectedSheet] || []
  const headerRow = sheetData[0] || []
  const bodyRows = sheetData.slice(1)
  const status = statuses[selectedTemplate] || 'not-reviewed'
  const cfg = STATUS_CONFIG[status]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Template selector pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {templates.map(t => {
          const s = statuses[t] || 'not-reviewed'
          const dotColor = s === 'approved' ? 'bg-green-400' : s === 'needs-changes' ? 'bg-red-400' : 'bg-slate-500'
          return (
            <button key={t} onClick={() => { setSelectedTemplate(t); setSelectedSheet('Dashboard') }}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all flex items-center gap-1.5 ${
                selectedTemplate === t
                  ? 'bg-indigo-600 text-white ring-1 ring-indigo-400/50'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}>
              <span className={`w-2 h-2 rounded-full ${dotColor}`} />
              {t}
            </button>
          )
        })}
      </div>

      {/* Status badge + download note */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button onClick={() => {
          const next = cfg.next
          setStatuses(prev => ({ ...prev, [selectedTemplate]: next }))
        }} className={`px-3 py-1.5 text-xs rounded-full font-semibold cursor-pointer transition-all hover:opacity-80 ${cfg.color}`}>
          {cfg.label}
        </button>
        <span className="text-xs text-slate-500 italic">📥 Download ZIP from Telegram chat or ask Optimus to resend</span>
      </div>

      {/* Sheet tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-thin">
        {SHEETS.map(sheet => {
          const available = data[selectedTemplate]?.[sheet]
          return (
            <button key={sheet} onClick={() => setSelectedSheet(sheet)}
              disabled={!available}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedSheet === sheet
                  ? 'bg-indigo-600/80 text-white'
                  : available
                    ? 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                    : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
              }`}>
              {sheet.replace('_', ' ')}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/50 mb-4">
        <table className="w-full text-xs">
          {headerRow.length > 0 && (
            <thead>
              <tr className="bg-slate-800">
                {headerRow.map((h, i) => (
                  <th key={i} className="px-3 py-2.5 text-left text-slate-300 font-semibold whitespace-nowrap border-b border-slate-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {bodyRows.map((row, ri) => {
              const isSection = isSectionHeader(row)
              return (
                <tr key={ri} className={`${isSection ? 'bg-indigo-900/30' : ri % 2 === 0 ? 'bg-slate-900/50' : 'bg-slate-800/30'} hover:bg-slate-700/40 transition-colors`}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-3 py-1.5 whitespace-nowrap border-b border-slate-800/50 ${
                      isSection ? 'font-bold text-indigo-300' : 'text-slate-300'
                    }`}>
                      {formatCell(cell, ci, headerRow)}
                    </td>
                  ))}
                </tr>
              )
            })}
            {bodyRows.length === 0 && (
              <tr><td colSpan={headerRow.length || 1} className="text-center py-8 text-slate-500">No data in this sheet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
        <label className="text-xs text-slate-400 font-semibold mb-2 block">📝 Notes for {selectedTemplate}</label>
        <textarea
          value={notes[selectedTemplate] || ''}
          onChange={e => setNotes(prev => ({ ...prev, [selectedTemplate]: e.target.value }))}
          placeholder="Type your review notes here..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-y"
        />
      </div>
    </div>
  )
}
