import { z } from 'zod'

const baseDialogbaseCoreSettingsSchema = z.object({
  noOfBotsPerUser: z.number(),
  allowUserToCreateBots: z.boolean(),
  allowUserToRegister: z.boolean(),
})

export type DialoqbaseCoreSettings = z.infer<typeof baseDialogbaseCoreSettingsSchema>

const baseModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  model_id: z.string(),
  model_type: z.string(),
  stream_available: z.boolean(),
  model_provider: z.string(),
  local_model: z.boolean(),
  config: z.any().nullable(),
  hide: z.boolean(),
  deleted: z.boolean(),
  createdAt: z.string(),
})

export type Model = z.infer<typeof baseModelSchema>

const baseUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().optional(),
  is_admin: z.boolean(),
  bots: z.number(),
  createdAt: z.string(),
})

export type User = z.infer<typeof baseUserSchema>

const ragSettings = z.object({
  defaultChunkSize: z.number(),
  defaultChunkOverlap: z.number(),
})

export type RagSettings = z.infer<typeof ragSettings>
