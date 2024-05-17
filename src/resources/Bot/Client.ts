import { parseJSON } from '../../utils'
import { DialoqbaseFetchError, errorResponse } from '../../utils/error'
import type { Fetch } from '../../utils/fetch'
import { BotSource } from '../BotSource/Client'
import type { Bot, Chat, ChatResponse, CreateBot, UpdateBot } from './types'

/**
 * Represents a Bot Client for interacting with the server.
 */
export class BotClient {
  private url: string
  private fetch: Fetch
  private apiKey: string

  /**
   * Creates a new instance of BotClient.
   * @param url - The base URL of the server.
   * @param fetch - The fetch function to use for making HTTP requests.
   */
  constructor(
    url: string,
    fetch: Fetch,
    apiKey: string,
  ) {
    this.url = url
    this.fetch = fetch
    this.apiKey = apiKey
  }

  /**
   * Creates a new bot.
   * @param bot The bot object containing the necessary information.
   * @returns A Promise object that resolves to the ID of the created bot.
   */
  async create(bot: CreateBot): Promise<{
    data: string
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bot),
    })

    if (!response.ok)
      return await errorResponse(response)

    const data = await response.json() as { id: string }

    return {
      data: data.id,
      error: null,
    }
  }

  /**
   * Retrieves a list of all bots.
   * @returns A promise that resolves to an object containing the data and error properties.
   * - If the request is successful, the data property will contain an array of Bot objects and the error property will be null.
   * - If there is an error, the data property will be null and the error property will contain a DialoqbaseFetchError object.
   */
  async listAll(): Promise<{
    data: Bot[]
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok)
      return await errorResponse(response)

    const data = await response.json() as Bot[]

    return {
      data,
      error: null,
    }
  }

  /**
   * Retrieves information about a bot.
   *
   * @param botId - The ID of the bot to retrieve information for.
   * @returns A promise that resolves to an object containing the bot data if successful, or an error object if unsuccessful.
   */
  async get(botId: string): Promise<{
    data: Bot
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}/${botId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok)
      return await errorResponse(response)

    const { data } = await response.json() as { data: Bot }

    return {
      data,
      error: null,
    }
  }

  /**
   * Updates a bot with the specified ID.
   *
   * @param botId - The ID of the bot to update.
   * @param bot - The updated bot object.
   * @returns A promise that resolves to an object with `data` and `error` properties.
   *          - If the update is successful, `data` will be `true` and `error` will be `null`.
   *          - If there is an error during the update, `data` will be `null` and `error` will be a `DialoqbaseFetchError` object.
   */
  async update(botId: string, bot: UpdateBot): Promise<{
    data: boolean
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}/${botId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...bot,
        noOfDocumentsToRetrieve: bot?.no_of_documents_to_retrieve,
        no_of_documents_to_retrieve: undefined,
      }),
    })

    if (!response.ok)
      return await errorResponse(response)

    return {
      data: true,
      error: null,
    }
  }

  /**
   * Deletes a bot with the specified ID.
   * @param botId The ID of the bot to delete.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  async delete(botId: string): Promise<{
    data: boolean
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const resp = await this.fetch(`${this.url}/${botId}`, {
      method: 'DELETE',
    })

    if (!resp.ok)
      return await errorResponse(resp)

    return {
      data: true,
      error: null,
    }
  }

  /**
   * Checks if the bot with the specified ID is ready to chat.
   * @param botId - The ID of the bot to check.
   * @returns A promise that resolves to an object containing the result of the check.
   *          If the bot is ready, the `data` property will be `true` and the `error` property will be `null`.
   *          If there is an error during the check, the `data` property will be `null` and the `error` property will be a `DialoqbaseFetchError`.
   */
  async isReady(botId: string): Promise<{
    data: boolean
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}/${botId}/is-ready`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok)
      return await errorResponse(response)

    const data = await response.json() as { is_ready: boolean }

    return {
      data: data.is_ready,
      error: null,
    }
  }

  /**
   * Gets the source of the bot.
   * @returns {BotSource} The source of the bot.
   */
  get source(): BotSource {
    return new BotSource(this.url, this.fetch, this.apiKey)
  }

  protected async processChatRequest<T extends object>(
    url: string,
    body: { stream?: boolean } & Record<string, any>,
  ): Promise<T | AsyncGenerator<T>> {
    const res = await this.fetch(url, {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!body.stream) {
      const data = await res.json() as T
      return data
    }

    if (!res.body)
      throw new DialoqbaseFetchError(res.status, 'No response body')

    const itr = parseJSON<T>(res.body)

    return (async function* () {
      for await (const chunk of itr) {
        const { type, message } = chunk as { type: string, message: T }

        yield message

        if (type === 'result')
          return
      }
    }())
  }

  /**
   * Sends a chat request to the specified bot.
   * @param botId The ID of the bot to send the chat request to.
   * @param body The chat request body.
   * @returns A promise that resolves with the response from the chat request.
   */
  chat(botId: string, body: Chat & { stream: true }): Promise<AsyncGenerator<ChatResponse>>
  chat(botId: string, body: Chat & { stream: false }): Promise<ChatResponse>
  async chat(botId: string, body: Chat): Promise<ChatResponse | AsyncGenerator<ChatResponse>> {
    return this.processChatRequest<ChatResponse>(`${this.url}/${botId}/chat`, body)
  }
}
