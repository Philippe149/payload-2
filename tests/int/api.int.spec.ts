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

  it('creates a blog post with a generated slug', async () => {
    const created = await payload.create({
      collection: 'blog-posts',
      data: {
        title: 'Hello Payload',
      },
    })

    expect(created.slug).toBe('hello-payload')
  })

  it('registers blog posts in the collection config', async () => {
    const payloadConfig = await config
    const collectionSlugs = payloadConfig.collections?.map((collection) => collection.slug) ?? []
    expect(collectionSlugs).toContain('blog-posts')
  })
})
