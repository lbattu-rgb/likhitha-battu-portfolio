import { defineArrayMember, defineField, defineType } from 'sanity'
import { linksField } from './shared'

// Singleton — locked to a single document via structure.ts (documentId 'about').
export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      description: 'A short one-line summary, e.g. "Building at the intersection of AI and biology"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'bio',
      type: 'array',
      title: 'Bio',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'values',
      type: 'array',
      title: 'Values',
      description: 'Short phrases describing what drives you, e.g. "Rigor", "Curiosity over certainty"',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'photo',
      type: 'image',
      title: 'Photo',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
      ],
    }),
    linksField(),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: title ?? 'About' }
    },
  },
})
