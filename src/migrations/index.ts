import * as migration_20250929_111647 from './20250929_111647'
import * as migration_20251001_120000 from './20251001_120000'
import * as migration_20251002_090000 from './20251002_090000'

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20251001_120000.up,
    down: migration_20251001_120000.down,
    name: '20251001_120000',
  },
  {
    up: migration_20251002_090000.up,
    down: migration_20251002_090000.down,
    name: '20251002_090000',
  },
]
