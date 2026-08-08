// Run once: node copy-achievements.mjs
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const SRC = 'C:\\Users\\abdul\\.gemini\\antigravity-ide\\brain\\d34d39a2-110b-4476-b9e5-51772b074b0e'
const DEST = './public/achievements'

if (!existsSync(DEST)) mkdirSync(DEST, { recursive: true })

const files = [
  ['ach_first_link_1786190973587.png',  'first-link.png'],
  ['ach_week_one_1786190989047.png',    'week-one.png'],
  ['ach_repaired_1786191002515.png',    'repaired.png'],
  ['ach_hard_mode_1786191017646.png',   'hard-mode.png'],
  ['ach_full_stack_1786191039050.png',  'full-stack.png'],
  ['ach_halfway_1786191049793.png',     'halfway.png'],
  ['ach_clean_chain_1786191060957.png', 'clean-chain.png'],
  ['ach_finisher_1786191073926.png',    'finisher.png'],
]

files.forEach(([src, dest]) => {
  copyFileSync(join(SRC, src), join(DEST, dest))
  console.log(`✓ ${dest}`)
})
console.log('\nAll 8 achievement icons copied to public/achievements/')
