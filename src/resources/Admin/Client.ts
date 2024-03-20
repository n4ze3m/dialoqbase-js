import type { DialoqbaseFetchError } from '../../utils/error'
import { errorResponse } from '../../utils/error'
import type { Fetch } from '../../utils/fetch'
import type { DialoqbaseCoreSettings, Model, User } from './types'

/**
 * Represents an Admin Client for interacting with the server.
 */
export class AdminClient {
  protected url: string
  protected fetch: Fetch

  /**
   * Creates a new instance of AdminClient.
   * @param url - The base URL of the server.
   * @param fetch - The fetch function to use for making HTTP requests.
   */
  constructor(
    url: string,
    fetch: Fetch,
  ) {
    this.url = url
    this.fetch = fetch
  }

  /**
   * Retrieves all users from the server.
   * @returns A promise that resolves to an array of User objects.
   */
  async getAllUsers(): Promise<{
    data: User[]
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}/users`)
    if (!response.ok)
      return await errorResponse(response)

    const data = await response.json() as User[]
    return {
      data,
      error: null,
    }
  }

  /**
   * Retrieves the Dialoqbase core settings from the server.
   * @returns A promise that resolves to the Dialoqbase core settings.
   */
  async getDialoqbaseCoreSettings(): Promise<{
    data: DialoqbaseCoreSettings
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}/dialoqbase-settings`)
    if (!response.ok)
      return await errorResponse(response)

    const data = await response.json() as DialoqbaseCoreSettings
    return {
      data,
      error: null,
    }
  }

  /**
   * Updates the Dialoqbase core settings.
   * @param settings - The Dialoqbase core settings to update.
   * @returns A promise that resolves to true if the settings were updated successfully.
   */
  async updateDialoqbaseCoreSettings(settings: DialoqbaseCoreSettings): Promise<{
    data: boolean
    error: null
  } |
  {
    data: null
    error: DialoqbaseFetchError
  }> {
    const response = await this.fetch(`${this.url}/dialoqbase-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
    if (!response.ok)
      return await errorResponse(response)

    return {
      data: true,
      error: null,
    }
  }

  /**
   * Retrieves all models from the server.
   * @returns A promise that resolves to an array of Model objects.
   */
  async getAllModels(): Promise<
    {
      data: Model[]
      error: null
    } |
    {
      data: null
      error: DialoqbaseFetchError
    }
    > {
    const response = await this.fetch(`${this.url}/models`)
    if (!response.ok)
      return await errorResponse(response)

    const res = await response.json() as { data: Model[] }
    return {
      data: res.data,
      error: null,
    }
  }
}
