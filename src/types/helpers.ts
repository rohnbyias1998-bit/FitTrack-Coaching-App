/**
 * TYPE HELPER UTILITIES
 * Utilities for converting between camelCase and snake_case
 * Use these when working with database types in components
 */

/**
 * Converts snake_case object keys to camelCase
 * Useful for converting database results to component-friendly format
 */
export function toCamelCase<T extends Record<string, any>>(obj: T): any {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(toCamelCase)
  if (typeof obj !== 'object') return obj

  const result: Record<string, any> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = typeof value === 'object' ? toCamelCase(value) : value
    }
  }

  return result
}

/**
 * Converts camelCase object keys to snake_case
 * Useful for converting component data to database-friendly format
 */
export function toSnakeCase<T extends Record<string, any>>(obj: T): any {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(toSnakeCase)
  if (typeof obj !== 'object') return obj

  const result: Record<string, any> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = typeof value === 'object' ? toSnakeCase(value) : value
    }
  }

  return result
}

/**
 * Type-safe wrapper for Supabase queries that converts results to camelCase
 */
export function convertToCamelCase<T>(data: T): any {
  return toCamelCase(data as any)
}

/**
 * Type-safe wrapper for preparing data for Supabase insert/update
 */
export function convertToSnakeCase<T>(data: T): any {
  return toSnakeCase(data as any)
}

// Re-export for convenience
export { toCamelCase as camelCase, toSnakeCase as snakeCase }
