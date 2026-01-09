import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD COLUMN \`is_home\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD COLUMN \`show_in_navigation\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD COLUMN \`navigation_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD COLUMN \`navigation_order\` numeric;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`navigation_order\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`navigation_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`show_in_navigation\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`is_home\`;`)
}
