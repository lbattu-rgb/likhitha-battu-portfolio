import { defineArrayMember, defineField, defineType } from 'sanity'
import { technologiesField, imagesField, linksField, displayOrderField, displayOrderOrdering } from './shared'

export const research = defineType({
  name: 'research',
  title: 'Research',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'e.g. "Mobley Lab", "EV71 RBFE Network"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
      description: 'e.g. "Computational Drug Discovery"',
    }),
    defineField({
      name: 'institution',
      type: 'string',
      title: 'Institution',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'startDate', type: 'date', title: 'Start Date' }),
    defineField({ name: 'endDate', type: 'date', title: 'End Date (leave blank if ongoing)' }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: 'Active',    value: 'active' },
          { title: 'Ongoing',   value: 'ongoing' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      description: 'One or two sentences shown on the card.',
      rows: 3,
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Full Description',
      of: [defineArrayMember({ type: 'block' })],
    }),
    technologiesField(),
    imagesField(),
    linksField(),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
      description: 'Show at the top of the page.',
      initialValue: false,
    }),
    displayOrderField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'institution', media: 'images.0' },
  },
  orderings: [
    displayOrderOrdering,
    { title: 'Start Date (newest first)', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
})
