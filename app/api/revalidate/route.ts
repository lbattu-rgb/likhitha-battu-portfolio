import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Called by a Sanity GROQ-powered webhook whenever content changes.
// Set up at: manage.sanity.io → your project → API → Webhooks
// URL: https://yourdomain.com/api/revalidate
// Secret: set SANITY_REVALIDATE_SECRET in env and match it in the webhook config.
//
// Webhook filter examples:
//   *[_type == "research"]    → tag: research
//   *[_type == "project"]     → tag: projects
//   *[_type == "hackathon"]   → tag: hackathons
//   *[_type == "obsession"]   → tag: obsessions
//   *[_type == "skill"]       → tag: skills
//   *[_type == "about"]       → tag: about

const TYPE_TO_TAG: Record<string, string> = {
  research:  'research',
  project:   'projects',
  hackathon: 'hackathons',
  obsession: 'obsessions',
  skill:     'skills',
  about:     'about',
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (secret) {
    const incoming = req.headers.get('x-sanity-webhook-secret')
    if (incoming !== secret) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: { _type?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const tag = body._type ? (TYPE_TO_TAG[body._type] ?? 'all') : 'all'

  if (tag === 'all') {
    for (const t of Object.values(TYPE_TO_TAG)) revalidateTag(t, 'max')
  } else {
    revalidateTag(tag, 'max')
  }

  return NextResponse.json({ revalidated: true, tag })
}
