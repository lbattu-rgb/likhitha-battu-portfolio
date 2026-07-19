import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production'

export default defineConfig({
  name:     'likhitha-battu-portfolio',
  title:    'Portfolio Studio',
  basePath: '/studio',
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Research')
              .schemaType('research')
              .child(S.documentTypeList('research').title('Research Entries')),
            S.listItem()
              .title('Projects')
              .schemaType('project')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('Hackathons')
              .schemaType('hackathon')
              .child(S.documentTypeList('hackathon').title('Hackathons')),
            S.listItem()
              .title('Current Obsessions')
              .schemaType('obsession')
              .child(S.documentTypeList('obsession').title('Current Obsessions')),
            S.listItem()
              .title('Skills')
              .schemaType('skill')
              .child(S.documentTypeList('skill').title('Skills')),
            S.divider(),
            // Singleton — always resolves to the one 'about' document.
            S.listItem()
              .title('About')
              .id('about')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about'),
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
