import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  HTTP_PORT: z.coerce.number().optional().default(8080),
})

export type Env = z.infer<typeof envSchema>
