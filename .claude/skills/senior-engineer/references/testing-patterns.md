# Testing Composables — Patterns & Practices

## Core Setup

```typescript
// tests/setup.ts
import { config } from '@vue/test-utils'

// Silence Vue warnings in test output unless debugging
config.global.config.warnHandler = () => {}
```

## The Wrapper Pattern

Composables that use Vue lifecycle hooks (`onMounted`, `onScopeDispose`, etc.) must run inside a component context. Use a thin wrapper:

```typescript
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

function withSetup<T>(composable: () => T): {
  result: T
  wrapper: ReturnType<typeof mount>
} {
  let result!: T
  const wrapper = mount(
    defineComponent({
      setup() {
        result = composable()
        return () => null // renderless
      },
    })
  )
  return { result, wrapper }
}
```

Usage:

```typescript
describe('useCounter', () => {
  it('increments the count', async () => {
    const { result } = withSetup(() => useCounter(0))

    expect(result.count.value).toBe(0)
    result.increment()
    expect(result.count.value).toBe(1)
  })
})
```

## Pure Composables (No Lifecycle)

If a composable uses only `ref`, `computed`, `watch` and no lifecycle hooks, you can test it without a wrapper:

```typescript
describe('useToggle', () => {
  it('toggles between true and false', () => {
    const [value, toggle] = useToggle(false)

    expect(value.value).toBe(false)
    toggle()
    expect(value.value).toBe(true)
    toggle()
    expect(value.value).toBe(false)
  })
})
```

## Reactive Assertion Patterns

### Watching Computed Values

```typescript
it('reacts to input changes', async () => {
  const input = ref('hello')
  const { result } = withSetup(() => useCharCount(input))

  expect(result.count.value).toBe(5)

  input.value = 'hi'
  await nextTick()
  expect(result.count.value).toBe(2)
})
```

### Testing watch Side Effects

```typescript
it('calls onUpdate when source changes', async () => {
  const spy = vi.fn()
  const source = ref(1)

  withSetup(() => useWatcher(source, { onUpdate: spy }))

  source.value = 2
  await nextTick()

  expect(spy).toHaveBeenCalledOnce()
  expect(spy).toHaveBeenCalledWith(2, 1)
})
```

## Async Composable Testing

```typescript
describe('useFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches data and updates state', async () => {
    const mockData = { id: 1, name: 'Test' }
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 })
    )

    const { result } = withSetup(() => useFetch('/api/test'))

    // Initially loading
    expect(result.state.value.status).toBe('loading')

    // Wait for fetch to complete
    await vi.waitFor(() => {
      expect(result.state.value.status).toBe('success')
    })

    // Type narrowing via discriminated union
    if (result.state.value.status === 'success') {
      expect(result.state.value.data).toEqual(mockData)
    }
  })

  it('handles errors', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const { result } = withSetup(() => useFetch('/api/fail'))

    await vi.waitFor(() => {
      expect(result.state.value.status).toBe('error')
    })

    if (result.state.value.status === 'error') {
      expect(result.state.value.error.message).toBe('Network error')
    }
  })
})
```

## Mocking VueUse Dependencies

When your composable composes VueUse primitives, mock at the VueUse module boundary:

```typescript
import { vi } from 'vitest'

// Mock specific VueUse composable
vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useStorage: vi.fn((key: string, defaultValue: any) => ref(defaultValue)),
    useEventListener: vi.fn(), // no-op for non-DOM tests
  }
})
```

### When NOT to mock VueUse

Don't mock VueUse primitives that are pure reactive utilities (`computed`, `toValue`, `watchDebounced`). Only mock:
- Browser API wrappers (`useEventListener`, `useResizeObserver`)
- Storage (`useStorage`, `useLocalStorage`)
- Network (`useFetch` from VueUse — not to be confused with your own)

## Testing Cleanup / onScopeDispose

```typescript
it('cleans up WebSocket on unmount', () => {
  const closeSpy = vi.fn()
  vi.stubGlobal('WebSocket', class {
    close = closeSpy
    addEventListener = vi.fn()
    removeEventListener = vi.fn()
  })

  const { wrapper } = withSetup(() => useWebSocket('ws://localhost'))

  // Unmount triggers onScopeDispose
  wrapper.unmount()

  expect(closeSpy).toHaveBeenCalledOnce()
})
```

## Testing MaybeRefOrGetter Inputs

Every composable that accepts `MaybeRefOrGetter` should be tested with all three input forms:

```typescript
describe('useFormattedDate', () => {
  const testDate = new Date('2025-01-15')

  it('works with raw value', () => {
    const result = useFormattedDate(testDate)
    expect(result.value).toContain('2025')
  })

  it('works with ref', async () => {
    const dateRef = ref(testDate)
    const result = useFormattedDate(dateRef)
    expect(result.value).toContain('2025')

    dateRef.value = new Date('2026-06-01')
    await nextTick()
    expect(result.value).toContain('2026')
  })

  it('works with getter', async () => {
    const dateRef = ref(testDate)
    const result = useFormattedDate(() => dateRef.value)
    expect(result.value).toContain('2025')
  })
})
```

## Test Organization Pattern

```
src/composables/useCounter/
├── index.ts
├── types.ts
└── index.test.ts      # Tests live next to implementation
```

Each test file follows this structure:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useCounter } from '.'
import type { UseCounterOptions } from './types'

describe('useCounter', () => {
  describe('initialization', () => {
    it('starts with default value', () => { /* ... */ })
    it('accepts custom initial value', () => { /* ... */ })
  })

  describe('increment', () => {
    it('increments by 1 by default', () => { /* ... */ })
    it('increments by custom step', () => { /* ... */ })
  })

  describe('edge cases', () => {
    it('respects max boundary', () => { /* ... */ })
    it('handles negative step', () => { /* ... */ })
  })
})
```
