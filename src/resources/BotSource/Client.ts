import axios, { isAxiosError } from "axios";
import { Fetch } from "../../utils/fetch";
import { DialoqbaseFetchError, errorResponse } from "../../utils/error";
import { FileBody, Source, SourceData } from "./types";

/**
 * Represents a Bot Source Client for interacting with the server.
 * 
*/
export class BotSource {
    url: string;
    fetch: Fetch;
    apiKey: string;

    /**
     * Creates a new instance of BotSource.
     * @param url - The base URL of the server.
     * @param fetch - The fetch function to use for making HTTP requests.
     */
    constructor(
        url: string,
        fetch: Fetch,
        apiKey: string
    ) {
        this.url = url;
        this.fetch = fetch;
        this.apiKey = apiKey;
    }
    private async _uploadWithAxios(url: string, body: FormData) {
        try {
            const headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": this.apiKey
            }

            const response = await axios.post(url, body, { headers });

            const data = response.data as { source_ids: string[] };

            return {
                data: data.source_ids,
                error: null
            }

        } catch (error: any) {
            if (isAxiosError(error)) {
                return {
                    data: null,
                    error: new DialoqbaseFetchError(error.response?.status || 500, error?.response?.data?.message || error?.response?.data?.error || error.message)
                }
            }

            return {
                data: null,
                error: new DialoqbaseFetchError(500, error?.message)
            }
        }
    }


    /**
    * Add text, website, sitemap, crawl, youtube, rest, or github as source to the bot.
    * @param botId - The ID of the bot.
    * @param source - An array of Source objects to be added.
    * @returns A Promise object that resolves to an array of source IDs that were added.
    */
    async add(botId: string, source: Source[]): Promise<{
        data: string[],
        error: null
    } |
    {
        data: null,
        error: DialoqbaseFetchError
    }> {
        const resp = await this.fetch(`${this.url}/${botId}/source/bulk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(source)
        })

        if (!resp.ok) {
            return await errorResponse(resp);
        }

        const data = await resp.json() as { source_ids: string[] };

        return {
            data: data.source_ids,
            error: null
        }
    }

    /**
     * Add files as source to the bot.
     * @param botId - The ID of the bot.
     * @param fileBody - The file to be uploaded. Can be a Blob or FormData object.
     * @returns A promise that resolves to an object containing the uploaded source file IDs, or an error object if the upload fails.
     */
    async addFile(botId: string, fileBody: FileBody): Promise<{
        data: string[],
        error: null
    } |
    {
        data: null,
        error: DialoqbaseFetchError
    }
    > {

        let body;

        if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
            body = new FormData();
            body.append('file', fileBody);
        } else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
            body = fileBody;
        } else {
            body = fileBody;
        }

        const resp = await this._uploadWithAxios(`${this.url}/${botId}/source/upload/bulk`, body as FormData);

        return resp;
    }

    /**
     * Retrieves a list of all sources for the bot.
     * @param botId - The ID of the bot.
     * @returns A promise that resolves to an object containing the data and error properties.
     * - If the request is successful, the data property will contain an array of Source objects and the error property will be null.
     * - If there is an error, the data property will be null and the error property will contain a DialoqbaseFetchError object.
     */
    async listAll(botId: string): Promise<{
        data: SourceData[],
        error: null
    } |
    {
        data: null,
        error: DialoqbaseFetchError
    }> {
        const resp = await this.fetch(`${this.url}/${botId}/source`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resp.ok) {
            return await errorResponse(resp);
        }

        const { data } = await resp.json() as { data: SourceData[] };

        return {
            data: data,
            error: null
        }
    }


    /**
     * Deletes a source for a bot.
     * @param botId - The ID of the bot.
     * @param sourceId - The ID of the source to delete.
     * @returns A promise that resolves to an object with `data` and `error` properties.
     *          - If the deletion is successful, `data` will be `true` and `error` will be `null`.
     *          - If there is an error during the deletion, `data` will be `null` and `error` will be a `DialoqbaseFetchError`.
     */
    async delete(botId: string, sourceId: string) : Promise<{
        data: boolean,
        error: null
    } |
    {
        data: null,
        error: DialoqbaseFetchError
    }> {

        const resp = await this.fetch(`${this.url}/${botId}/source/${sourceId}`, {
            method: "DELETE",
        })

        if (!resp.ok) {
            return await errorResponse(resp);
        }

        return {
            data: true,
            error: null
        }
    }


    /**
     * Refreshes the bot source with the specified botId and sourceId.
     * 
     * @param botId - The ID of the bot.
     * @param sourceId - The ID of the source.
     * @returns A promise that resolves to an object containing either a `data` property with a boolean value of `true` and `error` property set to `null`, or a `data` property set to `null` and an `error` property of type `DialoqbaseFetchError`.
     */
    async refresh(botId: string, sourceId: string) : Promise<{
        data: boolean,
        error: null
    } |
    {
        data: null,
        error: DialoqbaseFetchError
    }> {

        const resp = await this.fetch(`${this.url}/${botId}/source/${sourceId}/refresh`, {
            method: "POST",
        })

        if (!resp.ok) {
            return await errorResponse(resp);
        }

        return {
            data: true,
            error: null
        }
    }
}