import { defineField, defineType } from 'sanity'
import { displayOrderField, displayOrderOrdering } from './shared'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'e.g. "Python", "PyTorch", "Molecular Dynamics"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Languages', value: 'languages' },
          { title: 'Frameworks & Libraries', value: 'frameworks' },
          { title: 'Tools & Platforms', value: 'tools' },
          { title: 'ML / AI', value: 'ml-ai' },
          { title: 'Scientific Computing', value: 'scientific' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'proficiency',
      type: 'string',
      title: 'Proficiency',
      options: {
        list: [
          { title: 'Familiar', value: 'familiar' },
          { title: 'Proficient', value: 'proficient' },
          { title: 'Expert', value: 'expert' },
        ],
        layout: 'radio',
      },
      initialValue: 'proficient',
    }),
    displayOrderField(),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
  orderings: [
    displayOrderOrdering,
    { title: 'Category', name: 'categoryAsc', by: [{ field: 'category', direction: 'asc' }, { field: 'displayOrder', direction: 'asc' }] },
  ],
})
