export class DialoqbaseFetchError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'DialoqbaseFetchError';
        this.status = status;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message
        }
    }
}


export const errorResponse = async (response: Response) => {
    const status = response.status;
    const data = await response.json() as { message?: string, error?: string };
    const message = data?.message || data?.error || response.statusText;

    return {
        data: null,
        error: new DialoqbaseFetchError(status, message)
    }
}