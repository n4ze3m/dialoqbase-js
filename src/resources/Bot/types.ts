import { z } from 'zod'

const BotSchema = z.object({
  id: z.string(),
  publicId: z.string(),
  description: z.nullable(z.string()),
  createdAt: z.string(),
  provider: z.string(),
  name: z.string(),
  temperature: z.number(),
  model: z.string(),
  embedding: z.string(),
  streaming: z.boolean(),
  showRef: z.boolean(),
  questionGeneratorPrompt: z.string(),
  qaPrompt: z.string(),
  use_hybrid_search: z.boolean(),
  voice_to_text_type: z.string(),
  text_to_voice_enabled: z.boolean(),
  text_to_voice_type: z.string(),
  text_to_voice_type_metadata: z.object({}),
  use_rag: z.boolean(),
  bot_protect: z.boolean(),
  bot_api_key: z.nullable(z.string()),
  bot_model_api_key: z.nullable(z.string()),
  options: z.object({}),
  source: z.array(z.object({ type: z.string() })),
})

export type Bot = z.infer<typeof BotSchema>

const baseBotSchema = z.object({
  name: z.string().optional(),
  embedding: z.string(),
  model: z.string(),
  system_prompt: z.string().optional(),
  question_generator_prompt: z.string().optional(),
  temperature: z.number().optional(),
})

export type CreateBot = z.infer<typeof baseBotSchema>

const baseChatSchema = z.object({
  stream: z.boolean().default(false),
  message: z.string(),
  history_id: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(['human', 'ai']),
    text: z.string(),
  })).optional(),
})

export type Chat = z.infer<typeof baseChatSchema>

const updateBotSchema = z.object({
  system_prompt: z.string().optional(),
  question_generator_prompt: z.string().optional(),
  name: z.string().optional(),
  temperature: z.number().optional(),
  model: z.string().optional(),
  streaming: z.boolean().optional(),
  showRef: z.boolean().optional(),
  use_hybrid_search: z.boolean().optional(),
  bot_protect: z.boolean().optional(),
  use_rag: z.boolean().optional(),
  bot_model_api_key: z.string().optional(),
  no_of_documents_to_retrieve: z.number().optional(),
})

export type UpdateBot = z.infer<typeof updateBotSchema>

export interface ChatResponse {
  bot: {
    text: string
    sourceDocuments: {
      pageContent: string
      metadata: object
      source: string
      content: string
    }[]
  }
  history: {
    type: 'ai' | 'human'
    text: string
  }[]
}
