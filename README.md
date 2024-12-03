# vite-plugin-llms

A framework-agnostic Vite plugin to support the llms.txt specification.

## Background

The llms.txt specification aims to provide information in a more concise form for Large Language Models (LLMs). While websites primarily serve human readers, they are increasingly accessed by LLMs through AI helpers and development environments.

The specification suggests adding a `/llms.txt` file to your site and providing clean markdown versions of your pages at the same URL with `.md` appended.

For more information visit: [llmstxt.org](https://llmstxt.org)

## Features

- Serves markdown files alongside your routes in development
- Copies llms.txt and markdown files to build output
- Preserves directory structure for markdown routes
- Logs available markdown routes during development and build
- Works with any Vite-based framework (Vue, React, Svelte, Astro, etc.)

## Installation

```bash
npm install vite-plugin-llms --save-dev
```

## Usage

1. Add the plugin to your `vite.config.js` or `vite.config.ts`:

```javascript
import { defineConfig } from 'vite'
import llms from 'vite-plugin-llms'

export default defineConfig({
  plugins: [
    llms({
      llmsDir: 'llms' // optional, defaults to 'llms'
    })
  ]
})
```

2. Create a `llms` directory in your project root and add your `llms.txt` file:

```markdown
# Project Name

> Project description goes here

## Documentation

- [Getting Started](docs/getting-started.md): Introduction to the project
```

3. Add markdown files corresponding to your routes. Examples for different frameworks:

```
# Vue
your-project/
├── src/
│   └── views/
│       ├── AboutView.vue      # route: /about
│       └── DocsView.vue       # route: /docs
├── llms/
│   ├── llms.txt
│   ├── about.md              # accessible via: /about.md
│   └── docs.md               # accessible via: /docs.md
└── vite.config.js

# React
your-project/
├── src/
│   └── pages/
│       ├── About.tsx         # route: /about
│       └── Docs.tsx          # route: /docs
├── llms/
│   ├── llms.txt
│   ├── about.md             # accessible via: /about.md
│   └── docs.md              # accessible via: /docs.md
└── vite.config.js

# Astro
your-project/
├── src/
│   └── pages/
│       ├── about.astro      # route: /about
│       └── docs.astro       # route: /docs
├── llms/
│   ├── llms.txt
│   ├── about.md            # accessible via: /about.md
│   └── docs.md             # accessible via: /docs.md
└── vite.config.js
```

## Development

During development, the plugin will:
- Make markdown files available at `your-route.md`
- Log all available markdown routes on server start

## Production

In production builds, the plugin will:
- Copy llms.txt to your build output
- Copy all markdown files with preserved directory structure
- Log all copied files for verification

## License

MIT