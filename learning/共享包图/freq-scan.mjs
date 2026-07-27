/**
 * packages 仓内使用频率扫描（仅服务 learning/共享包图）。
 *
 * - 只读 monorepo 源码树；只写入本域 `_data/freq-latest.json`
 * - 不扫描 `learning/`（避免笔记自引用抬高分数）
 * - 不改 package.json / 不装依赖 / 不碰外部环境
 *
 * Agent：用户要求重跑时，在本域目录执行：
 *   node ./freq-scan.mjs
 * 然后按 JSON 更新「包索引总表」数字与抽样日期。
 */

import fs from 'node:fs'
import path from 'node:path'

import { fileURLToPath } from 'node:url'

const domainDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(domainDir, '../..')
const outDir = path.join(domainDir, '_data')
const outFile = path.join(outDir, 'freq-latest.json')

const SKIP_DIR = new Set([
  'node_modules',
  'dist',
  '.git',
  'coverage',
  '.turbo',
  'out',
  'release',
  '.histoire',
  'artifacts',
])

const SCAN_SCOPES = [
  'apps',
  'packages',
  'services',
  'plugins',
  'integrations',
  'docs',
  'engines',
  'examples',
]

const ROOT_FILES = [
  'uno.config.ts',
  'vitest.config.ts',
  'eslint.config.js',
  'package.json',
]

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function walk(dir, out = []) {
  let ents
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true })
  }
  catch {
    return out
  }
  for (const e of ents) {
    if (SKIP_DIR.has(e.name))
      continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      walk(full, out)
      continue
    }
    if (/\.(?:ts|tsx|vue|js|mjs|cjs|md|json)$/.test(e.name))
      out.push(full)
  }
  return out
}

function listPackages() {
  const pkgRoot = path.join(repoRoot, 'packages')
  const names = []
  for (const dir of fs.readdirSync(pkgRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()) {
    const p = path.join(pkgRoot, dir, 'package.json')
    if (!fs.existsSync(p))
      continue
    try {
      const j = JSON.parse(fs.readFileSync(p, 'utf8'))
      if (j.name)
        names.push({ dir, name: j.name, desc: (j.description || '').slice(0, 120) })
    }
    catch {
      // skip invalid json
    }
  }
  return names
}

function scanDepConsumers(names, stats) {
  function visit(dir) {
    let ents
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true })
    }
    catch {
      return
    }
    for (const e of ents) {
      if (SKIP_DIR.has(e.name) || e.name === 'learning')
        continue
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        visit(full)
        continue
      }
      if (e.name !== 'package.json')
        continue
      let j
      try {
        j = JSON.parse(fs.readFileSync(full, 'utf8'))
      }
      catch {
        continue
      }
      const all = {
        ...j.dependencies,
        ...j.devDependencies,
        ...j.peerDependencies,
        ...j.optionalDependencies,
      }
      for (const { dir: d, name } of names) {
        if (all[name])
          stats[d].depConsumers++
      }
    }
  }
  visit(repoRoot)
}

function main() {
  const names = listPackages()
  const stats = Object.fromEntries(names.map(({ dir, name, desc }) => [dir, {
    dir,
    name,
    desc,
    depConsumers: 0,
    importHits: 0,
    files: 0,
  }]))

  scanDepConsumers(names, stats)

  const files = []
  for (const s of SCAN_SCOPES) {
    const d = path.join(repoRoot, s)
    if (fs.existsSync(d))
      walk(d, files)
  }
  for (const f of ROOT_FILES) {
    const p = path.join(repoRoot, f)
    if (fs.existsSync(p))
      files.push(p)
  }

  for (const file of files) {
    let text
    try {
      text = fs.readFileSync(file, 'utf8')
    }
    catch {
      continue
    }
    for (const { dir, name } of names) {
      const re1 = new RegExp(escapeRe(name), 'g')
      const re2 = new RegExp(`packages/${escapeRe(dir)}(?:/|"|'|$)`, 'g')
      let c = 0
      const m1 = text.match(re1)
      if (m1)
        c += m1.length
      const m2 = text.match(re2)
      if (m2)
        c += m2.length
      if (c > 0) {
        stats[dir].importHits += c
        stats[dir].files++
      }
    }
  }

  const rows = Object.values(stats).map(s => ({
    ...s,
    score: s.depConsumers * 100 + s.files * 3 + Math.min(s.importHits, 400),
  })).sort((a, b) => b.score - a.score || b.depConsumers - a.depConsumers || b.files - a.files)

  const payload = {
    meta: {
      scannedAt: new Date().toISOString(),
      filesScanned: files.length,
      packageCount: rows.length,
      repoRoot: repoRoot.replace(/\\/g, '/'),
      domain: 'learning/共享包图',
      excludeFromFileScan: ['learning/', ...SKIP_DIR],
      scoreFormula: 'depConsumers*100 + files*3 + min(importHits,400)',
      columns: {
        depConsumers: 'workspace package.json 直接依赖次数',
        files: '触及文件数',
        importHits: '包名或 packages/<dir> 命中次数',
        score: '排序用综合分',
      },
    },
    rows,
  }

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

  // 仅 stdout 摘要，方便 Agent 核对；不写入域外
  console.info(JSON.stringify({
    ok: true,
    outFile: path.relative(repoRoot, outFile).replace(/\\/g, '/'),
    scannedAt: payload.meta.scannedAt,
    filesScanned: payload.meta.filesScanned,
    top5: rows.slice(0, 5).map(r => ({ dir: r.dir, dep: r.depConsumers, files: r.files, score: r.score })),
  }, null, 2))
}

main()
