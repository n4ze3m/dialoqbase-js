import { DialoqbaseClient } from "./DialoqbaseClient"

/**
 * Creates a Dialoqbase client instance.
 * @param url - The URL of the Dialoqbase server.
 * @param apiKey - The API key for authentication.
 * @returns A new instance of the DialoqbaseClient class.
 */
export const createClient = (url: string, apiKey: string) => {
    return new DialoqbaseClient(url, apiKey)
}