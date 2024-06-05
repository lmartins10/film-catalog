import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  ROOT_ADMIN_EMAIL: z.string().default('root@email.com'),
  ROOT_ADMIN_PASSWORD: z.string().default('Admin123!'),
  EMAIL_FROM: z.string().default('Admin <root@email.com>'),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USER: z.string(),
  EMAIL_USER_TEST: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_LOGO_URL: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  TEST_SEND_EMAIL: z
    .string()
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
  SEND_EMAIL: z
    .string()
    .optional()
    .default('true')
    .transform((value) => value === 'true'),
  PREVIEW_EMAIL: z
    .string()
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
