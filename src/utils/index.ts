
const parsesStreamingResponse = (text: string) => {
    const REGEX = /event: (.+)\ndata: (.+)/g;
    const matches = text.matchAll(REGEX);
    const result = [];
    for (const match of matches) {
        const type = match[1];
        const message = match[2];
        result.push({
            type,
            message: JSON.parse(message),
        });
    }

    return result;
};

export const parseJSON = async function* <T = unknown>(
    itr: ReadableStream<Uint8Array>,
): AsyncGenerator<T> {
    const decoder = new TextDecoder("utf-8");

    const reader = itr.getReader()
    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            const text = decoder.decode(value);
            const parts = parsesStreamingResponse(text);

            for (const part of parts) {
                yield JSON.parse(JSON.stringify(part));
            }
        }
    } finally {
        reader.releaseLock();
    }
}