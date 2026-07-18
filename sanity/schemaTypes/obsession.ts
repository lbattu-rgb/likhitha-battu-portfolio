import { defineArrayMember, defineField, defineType } from 'sanity'
import { displayOrderField, displayOrderOrdering } from './shared'

export const obsession = defineType({
  name: 'obsession',
  title: 'Current Obsession',
  type: 'document',
  fields: [
    defineField({
      name: 'topic',
      type: 'string',
      title: 'Topic',
      description: 'e.g. "Agentic AI", "RBFE Methods", "RAG Architectures"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'whyInterested',
      type: 'text',
      title: 'Why I\'m Interested',
      description: 'A few sentences explaining the pull of this topic.',
      rows: 4,
    }),
    defineField({
      name: 'notes',
      type: 'array',
      title: 'Notes',
      description: 'Longer-form thoughts, formatted text.',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'resources',
      type: 'array',
      title: 'Resources',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'resource',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
            defineField({
              name: 'type',
              type: 'string',
              title: 'Type',
              options: {
                list: [
                  { title: 'Paper',   value: 'paper' },
                  { title: 'Article', value: 'article' },
                  { title: 'Video',   value: 'video' },
                  { title: 'Repo',    value: 'repo' },
                  { title: 'Other',   value: 'other' },
                ],
                layout: 'radio',
              },
              initialValue: 'article',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'type' } },
        }),
      ],
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: '● Active',   value: 'active' },
          { title: '○ Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    displayOrderField(),
  ],
  preview: {
    select: { title: 'topic', subtitle: 'status' },
  },
  orderings: [
    displayOrderOrdering,
    { title: 'Active First', name: 'statusActive', by: [{ field: 'status', direction: 'asc' }, { field: 'displayOrder', direction: 'asc' }] },
  ],
})
