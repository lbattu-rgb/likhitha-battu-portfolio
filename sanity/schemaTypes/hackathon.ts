import { defineField, defineType } from 'sanity'
import { technologiesField, imagesField, linksField, displayOrderField, displayOrderOrdering } from './shared'

export const hackathon = defineType({
  name: 'hackathon',
  title: 'Hackathon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Project Title',
      description: 'Your project name, e.g. "Mycellium"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'event',
      type: 'string',
      title: 'Event Name',
      description: 'e.g. "Caltech Longevity Hackathon"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      title: 'Year',
      validation: (R) => R.integer().positive(),
    }),
    defineField({
      name: 'placement',
      type: 'string',
      title: 'Placement / Award',
      description: 'e.g. "1st Place", "Best Use of AI", "Finalist"',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      rows: 4,
    }),
    technologiesField(),
    imagesField({ withCaption: false }),
    linksField(),
    displayOrderField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'event' },
    prepare({ title, subtitle }) {
      return { title, subtitle }
    },
  },
  orderings: [
    displayOrderOrdering,
    { title: 'Year (newest first)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
})
