/**
 * Removes trailing slash from a URL.
 * 
 * @param url - The URL to remove the trailing slash from.
 * @returns The URL without the trailing slash.
 */
export const removeSlash = (url: string): string => {
    if (url.endsWith('/')) {
        return url.slice(0, -1);
    }
    return url;
};