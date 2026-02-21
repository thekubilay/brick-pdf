import type { ElementTypeDefinition } from '../types'

const registry = new Map<string, ElementTypeDefinition>()

export function registerElement(definition: ElementTypeDefinition): void {
  registry.set(definition.type, definition)
}

export function getElementDefinition(type: string): ElementTypeDefinition | undefined {
  return registry.get(type)
}

export function getAllElementDefinitions(): ElementTypeDefinition[] {
  return Array.from(registry.values())
}

export function unregisterElement(type: string): boolean {
  return registry.delete(type)
}
