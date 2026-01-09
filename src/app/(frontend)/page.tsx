import { headers as getHeaders } from 'next/headers.js'
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

  const [post] = posts

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content">
        <p className="subtitle">
          {user ? `Welcome back, ${user.email}.` : 'Welcome to the blog.'}
        </p>
        <h1>{post?.title ?? 'No posts yet'}</h1>
        {post?.excerpt && <p>{post.excerpt}</p>}
        <div className="links">
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
