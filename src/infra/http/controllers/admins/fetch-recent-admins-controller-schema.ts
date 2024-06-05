import { z } from 'zod'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

// Schemas
export const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export const perPageQueryParamSchema = z
  .string()
  .optional()
  .default('10')
  .transform(Number)
  .pipe(z.number().min(10))

export const sortQueryParamSchema = z.string().optional()

export const allQueryParamSchema = z.string().optional()

// ZOD Validation Pipes
export const pageQueryValidationPipe = new ZodValidationPipe(
  pageQueryParamSchema,
)
export const perPageQueryValidationPipe = new ZodValidationPipe(
  perPageQueryParamSchema,
)

export const sortQueryValidationPipe = new ZodValidationPipe(
  sortQueryParamSchema,
)

export const allQueryValidationPipe = new ZodValidationPipe(allQueryParamSchema)

// Types
export type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
export type PerPageQueryParamSchema = z.infer<typeof perPageQueryParamSchema>
export type SortQueryParamSchema = z.infer<typeof sortQueryParamSchema>
export type AllQueryParamSchema = z.infer<typeof allQueryParamSchema>
