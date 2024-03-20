import { z } from "zod"


const baseSourceDataSchema = z.object({
    content: z.string(),
    type: z.union([
        z.literal("text"),
        z.literal("website"),
        z.literal("crawl"),
        z.literal("github"),
        z.literal("youtube"),
        z.literal("rest"),
        z.literal("sitemap"),
    ]),
    options: z.record(z.string(), z.any())
});

const websiteSourceDataSchema = baseSourceDataSchema.extend({
    type: z.literal("website"),

    options: z.object({}).optional(),
});

const sitemapSourceDataSchema = baseSourceDataSchema.extend({
    type: z.literal("sitemap"),
    options: z.object({}).optional(),
});


const crawlSourceDataSchema = baseSourceDataSchema.extend({
    type: z.literal("crawl"),
    maxDepth: z.number().default(2),
    maxLink: z.number().default(10),
    options: z.object({}).optional(),
});

const youTubeSourceDataSchema = baseSourceDataSchema.extend({
    type: z.literal("youtube"),
    options: z.object({
        youtube_mode: z.union([
            z.literal("whisper"),
            z.literal("transcript")
        ])
    }),
});

const restSourceDataSchema = baseSourceDataSchema.extend({
    type: z.literal("rest"),
    options: z.object({
        method: z.string(),
        headers: z.record(z.string(), z.string()),
        body: z.any(),
    }).default({ method: "GET", headers: {}, body: null }),
});

const gitHubSourceDataSchema = baseSourceDataSchema.extend({
    type: z.literal("github"),
    options: z.object({
        is_private: z.boolean(),
        branch: z.string(),
    }).default({ is_private: false, branch: "main" }),
});

const textSourceDataSchema = baseSourceDataSchema.extend({
    type: z.literal("text"),
    options: z.object({}).optional(),
});

const sourceDataUnionSchema = z.union([
    textSourceDataSchema,
    websiteSourceDataSchema,
    sitemapSourceDataSchema,
    crawlSourceDataSchema,
    youTubeSourceDataSchema,
    restSourceDataSchema,
    gitHubSourceDataSchema,
    baseSourceDataSchema,
]);

export type Source = z.infer<typeof sourceDataUnionSchema>;

// copypaste from supabase
export type FileBody =
    | ArrayBuffer
    | ArrayBufferView
    | Blob
    | Buffer
    | File
    | FormData
    | NodeJS.ReadableStream
    | URLSearchParams
    | string


const baseSourceSchema = z.object({
    id: z.string(),
    type: z.string(),
    content: z.string(),
    location: z.optional(z.string()),
    isPending: z.boolean(),
    status: z.string(),
    createdAt: z.string(),
    options: z.record(z.string(), z.any()).optional(),
})


export type SourceData = z.infer<typeof baseSourceSchema>;