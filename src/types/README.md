# FitTrack TypeScript Types Documentation

## Overview

This directory contains all TypeScript type definitions for the FitTrack Calisthenics Coaching App.

## File Structure

```
src/types/
├── supabase.ts      # Auto-generated database types (snake_case)
├── nutrition.ts     # Nutrition-related types
├── exercise.ts      # Exercise and workout types (legacy - being phased out)
├── client.ts        # Client/user types (legacy - being phased out)
├── feedback.ts      # Feedback and notification types (legacy - being phased out)
└── helpers.ts       # Type conversion utilities (camelCase ↔ snake_case)
```

## Important Conventions

### Database Types (snake_case)

**All database types use `snake_case`** to match PostgreSQL naming conventions:

```typescript
// ✅ CORRECT - Database types use snake_case
const nutritionLog: NutritionLog = {
  id: 'uuid',
  user_id: 'user-uuid',
  food_name: 'Chicken Breast',
  created_at: '2024-01-01T00:00:00Z'
}
```

### Component Types (your choice)

You can use either:
1. **snake_case directly** (recommended for consistency)
2. **camelCase with conversion helpers**

## Usage Guide

### 1. Importing Database Types

```typescript
// Import from supabase.ts for database operations
import { NutritionLog, Tables, TablesInsert } from '@/types/supabase'

// Or import from domain-specific files
import { NutritionLog, SavedMeal } from '@/types/nutrition'
```

### 2. Inserting Data into Database

**Option A: Use snake_case directly** (Recommended)

```typescript
import { supabase } from '@/lib/supabaseClient'
import type { NutritionLogInsert } from '@/types/nutrition'

const newLog: NutritionLogInsert = {
  user_id: userId,
  food_name: 'Apple',
  calories: 95,
  protein: 0.5,
  carbs: 25,
  fat: 0.3,
  date: '2024-01-01'
}

const { data, error } = await supabase
  .from('nutrition_logs')
  .insert(newLog)
```

**Option B: Use camelCase with converter**

```typescript
import { toSnakeCase } from '@/types/helpers'

const newLog = {
  userId: userId,
  foodName: 'Apple',
  calories: 95,
  protein: 0.5,
  carbs: 25,
  fat: 0.3,
  date: '2024-01-01'
}

const { data, error } = await supabase
  .from('nutrition_logs')
  .insert(toSnakeCase(newLog))
```

### 3. Reading Data from Database

**Option A: Use snake_case directly** (Recommended)

```typescript
const { data, error } = await supabase
  .from('nutrition_logs')
  .select('*')
  .eq('user_id', userId)

// data is already typed as NutritionLog[]
// Access fields: data[0].food_name, data[0].created_at
```

**Option B: Convert to camelCase**

```typescript
import { toCamelCase } from '@/types/helpers'

const { data, error } = await supabase
  .from('nutrition_logs')
  .select('*')
  .eq('user_id', userId)

const camelData = toCamelCase(data)
// Access fields: camelData[0].foodName, camelData[0].createdAt
```

### 4. Type-Safe Queries

Use TypeScript generics for type-safe queries:

```typescript
// Type-safe select
const { data, error } = await supabase
  .from('nutrition_logs')
  .select('*')
  .eq('user_id', userId)
  .returns<NutritionLog[]>()

// Type-safe insert
const { data, error } = await supabase
  .from('nutrition_logs')
  .insert<NutritionLogInsert>(newLog)
  .select()
  .returns<NutritionLog[]>()
```

## Available Types

### Database Tables

All tables from `src/types/supabase.ts`:

- `Tables<'users'>` - User accounts
- `Tables<'exercises'>` - Exercise library
- `Tables<'workouts'>` - Workout plans
- `Tables<'workout_exercises'>` - Exercises within workouts
- `Tables<'workout_assignments'>` - Assigned workouts
- `Tables<'workout_logs'>` - Completed workouts
- `Tables<'exercise_logs'>` - Exercise performance logs
- `Tables<'set_logs'>` - Individual set logs
- `Tables<'nutrition_logs'>` - Food/nutrition logs
- `Tables<'nutrition_targets'>` - Daily nutrition goals
- `Tables<'saved_meals'>` - User's saved meals
- `Tables<'weight_logs'>` - Weight tracking
- `Tables<'coach_notes'>` - Coach notes about clients
- `Tables<'feedback'>` - User feedback
- `Tables<'user_profiles'>` - Extended user profile data

### Insert/Update Types

For every table, there are Insert and Update variants:

```typescript
import type {
  TablesInsert,
  TablesUpdate
} from '@/types/supabase'

// For inserting new records
type NewNutritionLog = TablesInsert<'nutrition_logs'>

// For updating existing records
type UpdateNutritionLog = TablesUpdate<'nutrition_logs'>
```

### Nutrition Types

From `src/types/nutrition.ts`:

- `NutritionLog` - Individual food log entry
- `NutritionTarget` - Daily nutrition goals
- `SavedMeal` - Saved meal with multiple foods
- `WeightLog` - Weight measurement
- `FoodItem` - Individual food item data
- `DailyNutritionSummary` - Daily nutrition aggregation
- `USDAFood` - USDA API food data
- `USDASearchResponse` - USDA API search results

## Migration from Legacy Types

### Old Code (camelCase - DEPRECATED)

```typescript
// ❌ OLD - Don't use
import { Exercise } from '@/types/exercise'

const exercise = {
  exerciseId: '123',
  muscleGroups: ['chest'],
  videoUrl: 'https://...'
}
```

### New Code (snake_case - CURRENT)

```typescript
// ✅ NEW - Use this
import type { Exercise } from '@/types/supabase'

const exercise = {
  exercise_id: '123',
  muscle_groups: ['chest'],
  video_url: 'https://...'
}
```

## Common Patterns

### Pattern 1: Creating a New Record

```typescript
import { supabase } from '@/lib/supabaseClient'
import type { NutritionLogInsert } from '@/types/nutrition'

async function createNutritionLog(log: NutritionLogInsert) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert(log)
    .select()
    .single()

  if (error) throw error
  return data // Typed as NutritionLog
}
```

### Pattern 2: Fetching with Joins

```typescript
import type { SavedMeal } from '@/types/nutrition'

const { data, error } = await supabase
  .from('saved_meals')
  .select(`
    *,
    user:users(full_name, email)
  `)
  .eq('user_id', userId)

// data is typed with the join
```

### Pattern 3: Form Handling

```typescript
import type { NutritionLogFormData } from '@/types/nutrition'

function NutritionForm() {
  const [formData, setFormData] = useState<NutritionLogFormData>({
    food_name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  })

  async function handleSubmit() {
    const logData: NutritionLogInsert = {
      user_id: currentUserId,
      ...formData
    }

    await supabase.from('nutrition_logs').insert(logData)
  }
}
```

## Regenerating Types

When the database schema changes, regenerate types:

```bash
# Make sure SUPABASE_PROJECT_ID is set in .env
npm run types:supabase
```

This will update `src/types/supabase.ts` with the latest schema.

## Best Practices

1. ✅ **Use snake_case for database operations** - matches PostgreSQL conventions
2. ✅ **Import from `@/types/supabase`** - most accurate and up-to-date
3. ✅ **Use Insert/Update types** - for type-safe mutations
4. ✅ **Leverage TypeScript inference** - let TS infer types from queries
5. ✅ **Use domain-specific files** - `nutrition.ts` for nutrition features
6. ❌ **Don't mix camelCase and snake_case** - pick one convention
7. ❌ **Don't use legacy types** - migrate from `exercise.ts`, `client.ts`

## Helper Functions

### Case Conversion

```typescript
import { toCamelCase, toSnakeCase } from '@/types/helpers'

// Convert database result to camelCase
const camelData = toCamelCase(databaseResult)

// Convert form data to snake_case for database
const dbData = toSnakeCase(formData)
```

## Questions?

- Database schema: Check `src/types/supabase.ts`
- Nutrition types: Check `src/types/nutrition.ts`
- Type helpers: Check `src/types/helpers.ts`
- Supabase docs: https://supabase.com/docs/reference/javascript/typescript-support
