# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

brick-pdf is a Vue 3 + TypeScript web application built with Vite.

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build` (runs `vue-tsc -b && vite build`)
- **Preview production build**: `npm run preview`

No test runner or linter is configured yet.

## Architecture

- **Entry point**: `src/main.ts` creates the Vue app and mounts it to `#app` in `index.html`
- **Root component**: `src/App.vue`
- **Components**: `src/components/`
- **Global styles**: `src/style.css`

Vue 3 Composition API with `<script setup>` syntax is used throughout. TypeScript is configured with strict mode enabled (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`).
