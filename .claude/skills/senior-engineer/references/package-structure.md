# Package Structure Reference

Canonical structure for a Vue 3 composable npm library.

## Directory Layout

```
my-composable-lib/
├── src/
│   ├── composables/
│   │   ├── useCounter/
│   │   │   ├── index.ts          # Implementation
│   │   │   ├── types.ts          # Types/interfaces for this composable
│   │   │   └── index.test.ts     # Co-located test
│   │   ├── useFetch/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── index.test.ts
│   │   └── index.ts              # Barrel: re-exports all composables
│   ├── utils/                    # Shared internal utilities (not exported)
│   │   ├── reactivity.ts
│   │   └── types.ts
│   ├── types/                    # Shared public types
│   │   └── index.ts
│   └── index.ts                  # Package entry: re-exports composables + types
├── tests/
│   └── setup.ts                  # Global test setup
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── README.md
├── LICENSE
└── .npmignore
```

### Why co-locate tests?

Each composable is a self-contained unit. Keeping `index.test.ts` next to `index.ts` makes the dependency relationship obvious and encourages SRP — if a composable's test file is growing too large, the composable itself probably has too many responsibilities.

## package.json

```json
{
  "name": "@scope/my-composable-lib",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "sideEffects": false,
  "peerDependencies": {
    "vue": "^3.3.0",
    "@vueuse/core": "^10.0.0 || ^11.0.0 || ^12.0.0"
  },
  "peerDependenciesMeta": {
    "@vueuse/core": {
      "optional": true
    }
  },
  "devDependencies": {
    "vue": "^3.5.0",
    "@vueuse/core": "^12.0.0",
    "@vue/test-utils": "^2.4.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0",
    "vite-plugin-dts": "^4.0.0",
    "jsdom": "^25.0.0"
  },
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run typecheck && npm run test && npm run build"
  }
}
```

### Key decisions explained

- **`sideEffects: false`** — tells bundlers every module is safe to tree-shake. This is essential for composable libraries; consumers should only pay for what they import.
- **`peerDependencies`** — Vue and VueUse are peer deps, not bundled. This avoids duplicate Vue instances (which break reactivity) and lets consumers control versions.
- **`peerDependenciesMeta.@vueuse/core.optional`** — if some composables don't need VueUse, make it optional and guard usage with runtime checks or document which composables require it.
- **`exports` map with `types` condition first** — TypeScript resolves types through the exports map. The `types` condition must come before `default` in each block.
- **Dual CJS/ESM output** — Some consumers still use CJS (Nuxt 2 compat, Jest without ESM, older build tools). Cost is minimal.

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["vitest/globals"],
    "skipLibCheck": true,
    "jsx": "preserve"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Strict flags that matter

- **`noUncheckedIndexedAccess`** — forces handling of `T | undefined` when indexing arrays/objects. Prevents runtime errors in composables that deal with collections.
- **`exactOptionalPropertyTypes`** — distinguishes between `prop?: T` (absent) and `prop: T | undefined` (present but undefined). Prevents subtle bugs in options objects.

## vite.config.ts

```typescript
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyComposableLib',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core', '@vueuse/shared'],
      output: {
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse',
        },
      },
    },
    minify: false, // Let consumer's bundler handle minification
    sourcemap: true,
  },
})
```

### Why `minify: false`?

Library code should ship readable. The consumer's bundler (Vite, Webpack, etc.) will minify the final application bundle. Shipping minified library code makes debugging harder and provides negligible benefit since the consumer's tree-shaking + minification pass handles it.

## vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/composables/**/*.ts'],
      exclude: ['**/*.test.ts', '**/types.ts', '**/index.ts'],
    },
  },
})
```

## Barrel Export Strategy

```typescript
// src/composables/index.ts — barrel for composables
export { useCounter } from './useCounter'
export type { UseCounterOptions, UseCounterReturn } from './useCounter/types'

export { useFetch } from './useFetch'
export type { UseFetchOptions, UseFetchReturn } from './useFetch/types'

// src/index.ts — package entry
export * from './composables'
export * from './types'
```

### Rules for barrel exports

1. **Only export public API** — internal utilities (`src/utils/`) are never exported
2. **Always re-export types** — consumers need them for typing their own code
3. **Use `export type` for type-only exports** — enables proper type erasure and avoids circular dependency issues
4. **One composable = one named export** — no default exports, no namespace objects

## Publishing Checklist

Before running `npm publish`:

1. `npm run typecheck` passes
2. `npm run test` passes
3. `npm run build` produces expected output in `dist/`
4. `dist/index.d.ts` exists and contains all public types
5. `npm pack --dry-run` shows only intended files
6. `package.json` version is bumped appropriately (semver)
7. README has usage examples for every exported composable
8. CHANGELOG is updated (if maintaining one)
9. Peer dependency ranges are tested against min and max versions
