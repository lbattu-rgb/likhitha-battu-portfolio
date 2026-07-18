import { defineArrayMember, defineField, defineType } from 'sanity'
import { technologiesField, imagesField, displayOrderField, displayOrderOrdering } from './shared'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL path, e.g. "mycellium" → /projects/mycellium',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      description: 'Short description shown on the card (1–2 sentences).',
      rows: 2,
    }),
    defineField({
      name: 'problem',
      type: 'text',
      title: 'Problem Statement',
      rows: 3,
    }),
    defineField({
      name: 'solution',
      type: 'text',
      title: 'Solution',
      rows: 3,
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Full Description',
      of: [defineArrayMember({ type: 'block' })],
    }),
    technologiesField(),
    defineField({ name: 'githubUrl', type: 'url', title: 'GitHub URL' }),
    defineField({ name: 'demoUrl', type: 'url', title: 'Live Demo URL' }),
    imagesField(),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
      description: 'Show at the top of the projects grid.',
      initialValue: false,
    }),
    displayOrderField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'summary', media: 'images.0' },
  },
  orderings: [
    displayOrderOrdering,
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
})
