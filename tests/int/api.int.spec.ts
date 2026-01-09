import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('fetches blog posts', async () => {
    const posts = await payload.find({
      collection: 'blog-posts',
    })
    expect(posts).toBeDefined()
  })

  it('fetches pages', async () => {
    const pages = await payload.find({
      collection: 'pages',
    })
    expect(pages).toBeDefined()
  })

  it('creates a blog post with a generated slug', async () => {
    const created = await payload.create({
      collection: 'blog-posts',
      data: {
        title: 'Hello Payload',
      },
      draft: true,
    })

    expect(created.slug).toBe('hello-payload')
  })

  it('creates a page with a generated slug', async () => {
    const created = await payload.create({
      collection: 'pages',
      data: {
        title: 'About Us',
      },
      draft: true,
    })

    expect(created.slug).toBe('about-us')
  })

  it('registers blog posts in the collection config', async () => {
    const payloadConfig = await config
    const collectionSlugs = payloadConfig.collections?.map((collection) => collection.slug) ?? []
    expect(collectionSlugs).toContain('blog-posts')
  })

  it('registers pages in the collection config', async () => {
    const payloadConfig = await config
    const collectionSlugs = payloadConfig.collections?.map((collection) => collection.slug) ?? []
    expect(collectionSlugs).toContain('pages')
  })

  it('exposes blog posts in the top-level admin navigation', async () => {
    const payloadConfig = await config
    const blogPostsCollection = payloadConfig.collections?.find(
      (collection) => collection.slug === 'blog-posts',
    )

    expect(blogPostsCollection?.admin?.group).toBeUndefined()
  })

  it('exposes pages in the top-level admin navigation', async () => {
    const payloadConfig = await config
    const pagesCollection = payloadConfig.collections?.find(
      (collection) => collection.slug === 'pages',
    )

    expect(pagesCollection?.admin?.group).toBeUndefined()
  })
})
