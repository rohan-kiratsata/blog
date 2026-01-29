# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
```

No lint or test scripts are configured.

## Architecture Overview

This is a Next.js 16 (App Router) personal portfolio and blog site using TypeScript, React 19, and Tailwind CSS v4.

### Key Directories

- **`app/`** - App Router root with pages, components, and API routes
- **`app/blog/posts/`** - MDX blog posts with YAML frontmatter
- **`app/components/`** - Reusable React components (MDX renderer, cards, navigation)
- **`app/util/content.ts`** - Project data and site metadata
- **`public/`** - Static assets

### Content Management

**Blog posts**: Add MDX files to `/app/blog/posts/` with frontmatter:
```yaml
---
title: 'Post Title'
publishedAt: 'YYYY-MM-DD'
summary: 'Brief description'
image: '/optional-image.png'
---
```

**Projects**: Update the `projects` and `freelanceProjects` arrays in `/app/util/content.ts`

### Route Structure

- `/` - Home page
- `/blog` - Blog index
- `/blog/[slug]` - Individual blog posts (dynamic route)
- `/side-quest` - Additional content page
- `/og` - Dynamic OG image generation (route handler)
- `/rss` - RSS feed generation (route handler)

### MDX Processing

Custom MDX components in `/app/components/mdx.tsx` provide:
- Heading anchors with auto-generated IDs
- Code syntax highlighting via sugar-high
- Next.js Image optimization
- Internal/external link handling

### SEO

- Dynamic metadata in root layout
- JSON-LD structured data (Person, WebSite, BlogPosting schemas)
- Auto-generated sitemap (`/app/sitemap.ts`)
- Dynamic OG images via `next/og`

### Environment Variables

- `G_TAG_ID` - Google Tag Manager ID (optional)
