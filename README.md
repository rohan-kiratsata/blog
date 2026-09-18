# Portfolio Blog Starter

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Demo

https://portfolio-blog-starter.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog&project-name=blog&repository-name=blog)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Use Node.js 24 (see `.nvmrc`) and pnpm. The app requires Node.js 22 or newer.

```bash
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

Validate the app with `pnpm typecheck` and `pnpm build`. The interface uses a fixed light theme, including browser chrome and social preview images.

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).


## Zen exploration mode

The home page’s “Take the scenic route” button opens Serein, a calm 3D portfolio planet. The game is loaded on demand. It runs locally in the browser using Three.js and locally hosted CC0 models; no game service or API key is required.

Asset sources and licensing are documented in [docs/zen-assets.md](docs/zen-assets.md).


Serein controls: WASD/arrows to move, Shift to sprint, tap Space to jump, hold Space to fly with the jetpack, drag to orbit, scroll to zoom, and **Mouse look** for a captured cursor. Escape releases the cursor before exiting. R scans for portfolio signals, E opens a nearby discovery, and J opens the journal. Touch movement, sprint and hold-to-fly buttons are included. Jetpack charge replenishes on the ground. The 760 m valley contains four regions, 16 encounters, power cells, relays, a repairable crossing, and a companion drone. Discoveries persist on this device; activated beacons and visited portfolio stations enable return travel. Exploration is contained within a surveyed valley; the terrain is deterministic, not an infinite world.
