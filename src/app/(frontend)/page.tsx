import { headers as getHeaders } from 'next/headers.js'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    limit: 1,
    sort: '-createdAt',
    overrideAccess: false,
    depth: 0,
    user,
  })
  const { docs: homePages } = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { isHome: { equals: true } },
    overrideAccess: false,
    depth: 0,
    user,
  })
  const [homePageFromFlag] = homePages
  const homePage =
    homePageFromFlag ??
    (
      await payload.find({
        collection: 'pages',
        limit: 1,
        where: { slug: { equals: 'home' } },
        overrideAccess: false,
        depth: 0,
        user,
      })
    ).docs[0]
  const { docs: navigationPages } = await payload.find({
    collection: 'pages',
    limit: 10,
    sort: ['navigationOrder', 'title'],
    where: { showInNavigation: { equals: true } },
    overrideAccess: false,
    depth: 0,
    user,
  })

  const [post] = posts
  const homeContent =
    homePage?.content && typeof homePage.content === 'object'
      ? convertLexicalToPlaintext({ data: homePage.content })
      : undefined

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content">
        <p className="subtitle">
          {user ? `Welcome back, ${user.email}.` : 'Welcome to the blog.'}
        </p>
        <h1>{homePage?.title ?? post?.title ?? 'Welcome to the blog'}</h1>
        {homeContent && <p>{homeContent}</p>}
        {!homeContent && post?.excerpt && <p>{post.excerpt}</p>}
        <div className="links">
          {navigationPages.map((page) => {
            const href = page.slug === 'home' ? '/' : `/${page.slug}`

            return (
              <a key={page.id} href={href}>
                {page.navigationLabel ?? page.title}
              </a>
            )
          })}
          <a className="admin" href={payloadConfig.routes.admin} rel="noopener noreferrer">
            Manage posts
          </a>
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
