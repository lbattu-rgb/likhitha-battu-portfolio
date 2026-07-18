import { defineArrayMember, defineField } from 'sanity'

// ─── Reusable field definitions shared across document schemas ────────────────

export const technologiesField = () =>
  defineField({
    name: 'technologies',
    type: 'array',
    title: 'Technologies',
    of: [defineArrayMember({ type: 'string' })],
    options: { layout: 'tags' },
  })

export const imagesField = ({ withCaption = true }: { withCaption?: boolean } = {}) =>
  defineField({
    name: 'images',
    type: 'array',
    title: 'Images',
    of: [
      defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
          ...(withCaption ? [defineField({ name: 'caption', type: 'string', title: 'Caption' })] : []),
        ],
      }),
    ],
  })

export const linksField = () =>
  defineField({
    name: 'links',
    type: 'array',
    title: 'Links',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'link',
        fields: [
          defineField({ name: 'label', type: 'string', title: 'Label', description: 'e.g. "Lab Website", "Paper", "Code"' }),
          defineField({ name: 'url', type: 'url', title: 'URL' }),
        ],
        preview: { select: { title: 'label', subtitle: 'url' } },
      }),
    ],
  })

export const displayOrderField = () =>
  defineField({
    name: 'displayOrder',
    type: 'number',
    title: 'Display Order',
    description: 'Lower numbers appear first.',
    initialValue: 0,
  })

export const displayOrderOrdering = {
  title: 'Display Order',
  name: 'displayOrderAsc',
  by: [{ field: 'displayOrder', direction: 'asc' as const }],
}
