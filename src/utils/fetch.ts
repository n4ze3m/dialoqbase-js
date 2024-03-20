export type Fetch = typeof fetch


/**
 * Creates a fetch function that includes an API key in the request headers.
 * @param apiKey - The API key to be included in the request headers.
 * @returns A fetch function that includes the API key in the request headers.
 */
export const fetchWithApiKey = (apiKey: string): Fetch => {
    /**
     * Fetch function that includes the API key in the request headers.
     * @param input - The resource URL or Request object.
     * @param options - Optional request options.
     * @returns A Promise that resolves to the Response to the request.
     */
    return async (input: string | URL | Request, options?: RequestInit) => {
        let headers = new Headers(options?.headers)

        if (!headers.has('Authorization')) {
            headers.set('Authorization', apiKey)
        }

        return fetch(input, {
            ...options,
            headers
        });
    };
}