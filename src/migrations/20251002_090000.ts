import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

const placeholderPost = {
  title: 'Welcome to the blog',
  slug: 'welcome-to-the-blog',
  excerpt: 'This is your first post. Update it with fresh content in the admin.',
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    INSERT INTO blog_posts (title, slug, excerpt, created_at, updated_at)
    SELECT ${placeholderPost.title}, ${placeholderPost.slug}, ${placeholderPost.excerpt},
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE NOT EXISTS (SELECT 1 FROM blog_posts);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DELETE FROM blog_posts WHERE slug = ${placeholderPost.slug};`)
}
