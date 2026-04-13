'use strict'

const ExcelJS = require('exceljs')
const db      = require('../models')

const Report =
  db.Report     ||
  db.report     ||
  db.Reports    ||
  db.reports    ||
  db.PlabReport ||
  db.Plablab    ||
  null

if (!Report) {
  const available = Object.keys(db).filter(k => !['sequelize', 'Sequelize'].includes(k))
  console.error('[ExportExcel] FATAL: Could not find Report model. Available: ' + available.join(', '))
}

const COLUMNS = [
  { header: 'Sl.No',       key: 'slNo',        width: 7  },
  { header: 'Report No',   key: 'reportNo',     width: 22 },
  { header: 'Request No',  key: 'reqNo',        width: 22 },
  { header: 'PL No',       key: 'plNo',         width: 12 },
  { header: 'Date',        key: 'date',         width: 14 },
  { header: 'Part No',     key: 'partNo',       width: 16 },
  { header: 'Description', key: 'description',  width: 28 },
  { header: 'Customer',    key: 'customer',     width: 18 },
  { header: 'Test Name',   key: 'testName',     width: 24 },
  { header: 'Test Type',   key: 'testType',     width: 18 },
  { header: 'Samples',     key: 'samples',      width: 10 },
  { header: 'Result',      key: 'result',       width: 12 },
  { header: 'Reported By', key: 'reportedBy',   width: 18 },
  { header: 'Approved By', key: 'approvedBy',   width: 18 },
  { header: 'Observation', key: 'observation',  width: 36 },
]

const DARK_BLUE  = '1A3A5C'
const HEADER_FG  = 'FFFFFF'
const ALT_ROW    = 'EAF2FB'
const PASS_GREEN = 'D5F5E3'
const FAIL_RED   = 'FADBD8'
const BORDER_CLR = 'B0C4D8'

function applyBorder(cell) {
  const s = { style: 'thin', color: { argb: BORDER_CLR } }
  cell.border = { top: s, left: s, bottom: s, right: s }
}

function pick(row, ...keys) {
  for (const k of keys) {
    const v = row[k]
    if (v !== undefined && v !== null && v !== '') return v
  }
  return ''
}

function parseDate(val) {
  if (!val) return null
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val
  const s = String(val).trim()
  if (!s || s.toLowerCase() === 'invalid date') return null
  const dmy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (dmy) {
    const d = new Date(`${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`)
    return isNaN(d.getTime()) ? null : d
  }
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function rowDate(r) {
  return parseDate(r.date) || parseDate(r.testDate) || parseDate(r.createdAt) || null
}

async function buildWorkbook(rows, sheetTitle) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Proving & Reliability Lab'
  wb.created = new Date()

  const ws = wb.addWorksheet(sheetTitle.substring(0, 31), {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
  })

  ws.mergeCells(1, 1, 1, COLUMNS.length)
  const titleCell = ws.getCell('A1')
  titleCell.value     = 'PROVING & RELIABILITY LAB — TEST REPORT'
  titleCell.font      = { bold: true, size: 14, color: { argb: HEADER_FG } }
  titleCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK_BLUE } }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(1).height = 28

  ws.mergeCells(2, 1, 2, COLUMNS.length)
  const subCell     = ws.getCell('A2')
  subCell.value     = sheetTitle
  subCell.font      = { bold: true, size: 11, color: { argb: DARK_BLUE } }
  subCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D6EAF8' } }
  subCell.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(2).height = 20

  ws.columns = COLUMNS
  const headerRow = ws.getRow(3)
  headerRow.height = 20
  COLUMNS.forEach((col, idx) => {
    ws.getColumn(idx + 1).width = col.width
    const cell = headerRow.getCell(idx + 1)
    cell.value     = col.header
    cell.font      = { bold: true, size: 10, color: { argb: HEADER_FG } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1A5276' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    applyBorder(cell)
  })

  rows.forEach((r, i) => {
    const rowNum = i + 4
    const exRow  = ws.getRow(rowNum)
    exRow.height = 18

    const result = pick(r, 'result', 'Result', 'testResult')
    const resLow = (result || '').toLowerCase()
    const isPass = resLow === 'passed' || resLow === 'completed'
    const isFail = resLow === 'failed'
    const bgColor = isFail ? FAIL_RED : isPass ? PASS_GREEN : (i % 2 === 0 ? 'FFFFFF' : ALT_ROW)

    const values = [
      i + 1,
      pick(r, 'reportNo',    'report_no',    'ReportNo'),
      pick(r, 'reqNo',       'req_no',       'requestNo',   'request_no', 'ReqNo'),
      pick(r, 'plNo',        'pl_no',        'PlNo',        'allocationPlNo'),
      pick(r, 'date',        'Date',         'testDate'),
      pick(r, 'partNo',      'part_no',      'PartNo'),
      pick(r, 'description', 'Description',  'desc',        'product'),
      pick(r, 'customer',    'Customer',     'cust'),
      pick(r, 'testName',    'test_name',    'TestName',    'test'),
      pick(r, 'testType',    'test_type',    'TestType',    'category'),
      pick(r, 'samples',     'Samples',      'noOfSamples', 'sampleCount'),
      result,
      pick(r, 'reportedBy',  'reported_by',  'ReportedBy'),
      pick(r, 'approvedBy',  'approved_by',  'ApprovedBy'),
      pick(r, 'observation', 'Observation',  'obs'),
    ]

    values.forEach((val, colIdx) => {
      const cell = exRow.getCell(colIdx + 1)
      cell.value     = val
      cell.font      = { size: 10 }
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      cell.alignment = {
        horizontal: colIdx === 0 ? 'center' : colIdx === 11 ? 'center' : 'left',
        vertical:   'middle',
        wrapText:   colIdx === 14,
      }
      if (colIdx === 11) {
        cell.font = {
          bold: true, size: 10,
          color: { argb: isFail ? 'C0392B' : isPass ? '1E8449' : '000000' }
        }
      }
      applyBorder(cell)
    })
  })

  const sumRowNum = rows.length + 4
  ws.getRow(sumRowNum).height = 18

  ws.mergeCells(sumRowNum, 1, sumRowNum, 3)
  const sumCell = ws.getCell(`A${sumRowNum}`)
  sumCell.value     = `Total Records: ${rows.length}`
  sumCell.font      = { bold: true, size: 10, color: { argb: DARK_BLUE } }
  sumCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D6EAF8' } }
  sumCell.alignment = { horizontal: 'center', vertical: 'middle' }
  applyBorder(sumCell)

  const passCount = rows.filter(r => {
    const v = (pick(r, 'result', 'Result') || '').toLowerCase()
    return v === 'passed' || v === 'completed'
  }).length
  const failCount = rows.filter(r =>
    (pick(r, 'result', 'Result') || '').toLowerCase() === 'failed'
  ).length

  ws.mergeCells(sumRowNum, 4, sumRowNum, 7)
  const passCell = ws.getCell(`D${sumRowNum}`)
  passCell.value     = `Passed/Completed: ${passCount}`
  passCell.font      = { bold: true, size: 10, color: { argb: '1E8449' } }
  passCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5F5E3' } }
  passCell.alignment = { horizontal: 'center', vertical: 'middle' }
  applyBorder(passCell)

  ws.mergeCells(sumRowNum, 8, sumRowNum, 11)
  const failCell = ws.getCell(`H${sumRowNum}`)
  failCell.value     = `Failed: ${failCount}`
  failCell.font      = { bold: true, size: 10, color: { argb: 'C0392B' } }
  failCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FADBD8' } }
  failCell.alignment = { horizontal: 'center', vertical: 'middle' }
  applyBorder(failCell)

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 3, topLeftCell: 'A4' }]

  return wb
}

exports.exportExcel = async (req, res) => {
  try {
    if (!Report) {
      const available = Object.keys(db).filter(k => !['sequelize', 'Sequelize'].includes(k))
      return res.status(500).json({
        success: false,
        message: 'Report model not found.',
        availableModels: available,
      })
    }

    const { year, month, from, to } = req.query

    if (!year && !(from && to)) {
      return res.status(400).json({
        success: false,
        message: 'Provide year, year+month, or from+to query params.',
      })
    }

    const allRows = await Report.findAll({ order: [['createdAt', 'ASC']] })
    const all = allRows.map(r => (typeof r.toJSON === 'function' ? r.toJSON() : { ...r }))

    let rows = []
    let sheetTitle = 'Report'

    if (from && to) {
      const fromDate = new Date(from); fromDate.setHours(0, 0, 0, 0)
      const toDate   = new Date(to);   toDate.setHours(23, 59, 59, 999)
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid from/to date. Use YYYY-MM-DD.' })
      }
      rows       = all.filter(r => { const d = rowDate(r); return d && d >= fromDate && d <= toDate })
      sheetTitle = `Report ${from} to ${to}`

    } else if (year && month) {
      const y = parseInt(year, 10)
      const m = parseInt(month, 10)
      if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
        return res.status(400).json({ success: false, message: 'Invalid year or month.' })
      }
      rows = all.filter(r => {
        const d = rowDate(r)
        return d && d.getFullYear() === y && (d.getMonth() + 1) === m
      })
      const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      sheetTitle = `${MN[m - 1]} ${y} Report`

    } else if (year) {
      const y = parseInt(year, 10)
      if (isNaN(y)) return res.status(400).json({ success: false, message: 'Invalid year.' })
      rows       = all.filter(r => { const d = rowDate(r); return d && d.getFullYear() === y })
      sheetTitle = `Year ${year} Report`
    }

    const wb  = await buildWorkbook(rows, sheetTitle)
    const buf = await wb.xlsx.writeBuffer()

    const safeName = sheetTitle.replace(/[^a-zA-Z0-9_\-. ]/g, '_')
    res.setHeader('Content-Type',        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="PL_${safeName}.xlsx"`)
    res.setHeader('Content-Length',       String(buf.length))
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

    return res.end(buf)

  } catch (err) {
    console.error('[ExportExcel] Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Excel export failed.',
      error:   err.message,
    })
  }
}