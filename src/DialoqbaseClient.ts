import { AdminClient } from "./resources/Admin/Client";
import { BotClient } from "./resources/Bot/Client";
import { Fetch, fetchWithApiKey } from "./utils/fetch";
import { removeSlash } from "./utils/remove-slash";

/**
 * Represents a client for interacting with the Dialoqbase API.
 */
export class DialoqbaseClient {

    protected fetch: Fetch;
    protected adminUrl: string;
    protected botUrl: string;
    protected apiKey: string;


    constructor(
        protected dialoqbaseUrl: string,
        protected dialoqbaseApiKey: string
    ) {

        if (!dialoqbaseUrl) {
            throw new Error('DialoqbaseClient: Missing dialoqbaseUrl');
        }

        if (!dialoqbaseApiKey) {
            throw new Error('DialoqbaseClient: Missing dialoqbaseApiKey');
        }

        const baseUrl = removeSlash(dialoqbaseUrl);

        this.adminUrl = `${baseUrl}/api/v1/admin`;

        this.botUrl = `${baseUrl}/api/v1/bot`;


        this.apiKey = dialoqbaseApiKey;

        this.fetch = fetchWithApiKey(this.dialoqbaseApiKey);
    }


    /**
     * Get an instance of the admin client for performing operations on the admin API.
     * @returns {AdminClient} The admin client instance.
     */
    get admin(): AdminClient {
        return new AdminClient(this.adminUrl, this.fetch)
    }


    /**
     * Get an instance of the bot client for performing operations on the bot API.
     * @returns {BotClient} The bot client instance.
     */
    get bot() : BotClient {
        return new BotClient(this.botUrl, this.fetch, this.apiKey)
    }

}