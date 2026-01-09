import type { CollectionConfig } from 'payload'

import type { Page } from '../payload-types'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) {
          return data
        }

        const typedData = data as Partial<Page>

        if ((operation === 'create' || operation === 'update') && typedData.title && !typedData.slug) {
          typedData.slug = formatSlug(typedData.title)
        }

        if (
          (operation === 'create' || operation === 'update') &&
          typedData.showInNavigation &&
          typedData.title &&
          !typedData.navigationLabel
        ) {
          typedData.navigationLabel = typedData.title
        }

        return typedData
      },
    ],
  },
  fields: [
    {
      name: 'isHome',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Use this page content on the homepage.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this page in the main navigation.',
      },
    },
    {
      name: 'navigationLabel',
      type: 'text',
      admin: {
        description: 'Optional label for the navigation menu.',
        condition: (_, siblingData) => Boolean(siblingData?.showInNavigation),
      },
    },
    {
      name: 'navigationOrder',
      type: 'number',
      admin: {
        description: 'Lower numbers appear first in the navigation menu.',
        condition: (_, siblingData) => Boolean(siblingData?.showInNavigation),
      },
    },
  ],
  timestamps: true,
}

const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
