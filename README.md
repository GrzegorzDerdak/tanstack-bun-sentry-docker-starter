# Tanstack Start, Bun, Sentry, Docker starter

An opinionated, production-ready starter for building full-stack React applications. It combines **Bun** as the runtime and package manager, **TanStack Start** for the full-stack framework, **Sentry** for error monitoring, and **Docker** for containerized deployments -- with **shadcn/ui**, **Biome**, **Tailwind CSS v4**, and **Vitest** pre-configured so you can skip the setup and start building.

## Tech Stack

| Category | Tool | Purpose |
| --- | --- | --- |
| Runtime / Package Manager | [Bun](https://bun.sh/) | Fast JavaScript runtime, bundler, and package manager |
| Full-Stack Framework | [TanStack Start](https://tanstack.com/start) | SSR-capable React framework built on TanStack Router & Nitro |
| Routing | [TanStack Router](https://tanstack.com/router) | Type-safe, file-based routing with built-in data loading |
| Data Fetching | [TanStack React Query](https://tanstack.com/query) | Async state management with caching, background refetching |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (New York style) | Copy-paste accessible components built on Radix UI |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework |
| Icons | [Lucide React](https://lucide.dev/) | Beautiful, consistent icon set |
| Linting & Formatting | [Biome](https://biomejs.dev/) | Single tool for formatting, linting, and import sorting |
| Validation | [Zod v4](https://zod.dev/) | TypeScript-first schema validation |
| Error Monitoring | [Sentry](https://sentry.io/) | Client and server error tracking, tracing, and session replay |
| Build Tooling | [Vite](https://vite.dev/) + [Nitro](https://nitro.build/) (Bun preset) | Development server, HMR, and optimized production builds |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) | Unit and component testing |
| Containerization | [Docker](https://www.docker.com/) | Multi-stage production image based on `oven/bun:1-alpine` |
| Devtools | [TanStack Devtools](https://tanstack.com/devtools) | Unified devtools panel for Router and Query |
| TypeScript | [TypeScript](https://www.typescriptlang.org/) (strict mode) | Static type checking |

## Project Structure

```
.
├── public/                  # Static assets (favicon, logos, manifest)
├── src/
│   ├── components/          # Shared React components
│   │   └── ui/              # shadcn/ui components (generated)
│   ├── lib/                 # Utility functions (cn, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── routes/              # File-based routes (TanStack Router)
│   │   ├── __root.tsx       # Root layout (HTML shell, header, devtools)
│   │   └── index.tsx        # Home page
│   ├── server/              # Server-side code (server functions)
│   ├── router.tsx           # Router factory with Sentry integration
│   ├── server.ts            # Server entry point (Nitro + Sentry)
│   ├── styles.css           # Global styles, Tailwind imports, theme tokens
│   └── routeTree.gen.ts     # Auto-generated route tree (do not edit)
├── biome.json               # Biome configuration
├── components.json          # shadcn/ui configuration
├── Dockerfile               # Multi-stage production Docker build
├── instrument.server.mjs    # Sentry server-side instrumentation
├── tsconfig.json            # TypeScript configuration (strict)
├── vite.config.ts           # Vite plugins and build configuration
└── package.json
```

## Prerequisites

- [Bun](https://bun.sh/) v1.x or later

## Getting Started

**Install dependencies:**

```bash
bun install
```

**Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your values. See [Environment Variables](#environment-variables) for details.

**Start the development server:**

```bash
bun --bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `bun --bun run dev` | Start Vite dev server with HMR on port 3000 |
| `bun --bun run build` | Build for production (outputs to `.output/`) |
| `bun run start` | Run the production build |
| `bun --bun run preview` | Preview production build locally |
| `bun --bun run test` | Run tests with Vitest |
| `bun run format` | Format code with Biome |
| `bun run lint` | Lint and auto-fix with Biome |
| `bun run format:check` | Check formatting without writing |
| `bun run lint:check` | Check linting without writing |
| `bun run docker:build` | Build Docker image |
| `bun run docker:run` | Run Docker container on port 3000 |
| `bun run docker:dev` | Build and run Docker container |

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description | Required |
| --- | --- | --- |
| `PORT` | Server port (default: `3000`) | No |
| `VITE_SENTRY_DSN` | Sentry DSN for client and server error tracking | No |
| `SENTRY_ORG` | Sentry organization slug (build-time, for source map uploads) | No |
| `SENTRY_PROJECT` | Sentry project slug (build-time) | No |
| `SENTRY_AUTH_TOKEN` | Sentry auth token (build-time) | No |
| `SENTRY_ENVIRONMENT` | Environment name (`production`, `staging`, `development`) | No |

Sentry is optional -- the app runs fine without any Sentry variables configured.

## Adding UI Components

This template uses [shadcn/ui](https://ui.shadcn.com/) for UI components. Add new components with:

```bash
bunx shadcn@latest add button
```

Components are placed in `src/components/ui/` and can be freely customized.

## Routing

Routes are managed as files in `src/routes/` using [TanStack Router file-based routing](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing). Add a new route by creating a file in that directory -- the route tree is auto-generated.

### Adding a Route

Create a file like `src/routes/about.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return <div>About</div>;
}
```

### Navigation

Use the `Link` component for SPA navigation:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>
```

### Layout

The root layout lives in `src/routes/__root.tsx`. It defines the HTML shell, includes the header, and renders devtools in development.

## Server Functions

TanStack Start provides server functions for writing server-side logic that integrates with your client components:

```tsx
import { createServerFn } from "@tanstack/react-start";

const getServerTime = createServerFn({
  method: "GET",
}).handler(async () => {
  return new Date().toISOString();
});
```

## Docker

The included `Dockerfile` uses a multi-stage build optimized for Bun:

1. **deps** -- installs all dependencies for the build step
2. **prod-deps** -- installs production-only dependencies
3. **build** -- compiles the application with Vite/Nitro
4. **release** -- minimal Alpine image with only production artifacts

```bash
bun run docker:build
bun run docker:run
```

The container exposes port **3000** and runs as a non-root `bun` user.

## Linting & Formatting

[Biome](https://biomejs.dev/) handles both linting and formatting in a single tool, configured in `biome.json`:

- **Formatter:** 2-space indentation, double quotes, 100-char line width, LF line endings
- **Linter:** Recommended rules enabled, React domain rules, enforced import types
- **Assist:** Auto-sorted imports and object properties

```bash
# Format and lint with auto-fix
bun run format
bun run lint

# CI-friendly checks (no writes)
bun run format:check
bun run lint:check
```

## Testing

Tests run with [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/):

```bash
bun --bun run test
```

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev/)
- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vite.dev/guide/)
- [Sentry for TanStack Start](https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/)

## License

This is a template repository. Use it as a starting point for your own projects.
