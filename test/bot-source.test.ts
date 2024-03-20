import { createClient } from "../src";
import { beforeEach, describe, expect, it } from 'vitest'
import * as fsp from "fs/promises"
import FormData from "form-data"


const dialoqbase = createClient(
    "http://localhost:3000",
    "db_ed2e9ded3f8a46a89063fee4590179b5"
)



describe("Bot Source Module", () => {
    let botId: string = ""
    let pdfFile: Buffer
    let mp3File: Buffer
    let errorFile: Buffer
    let sourceToDelete: string = ""
    let sourceToUpdate: string = ""
    
    beforeEach(async () => {
        const { data: bots } = await dialoqbase.bot.listAll()
        const bot = bots?.find(bot => bot.source.length > 0)
        botId = bot?.id!
        pdfFile = await fsp.readFile("./test/assets/test.pdf")
        mp3File = await fsp.readFile("./test/assets/test.mp3")
        errorFile = await fsp.readFile("./test/assets/test.html")
    })

    it("shoud return list of all sources", async () => {
        const sources = await dialoqbase.bot.source.listAll(botId)

        const source = sources.data?.find(source => source.status.toLowerCase() === "finished")
        sourceToDelete = source?.id!

        const source2 = sources.data?.find(source => source.status.toLowerCase() === "pending")
        sourceToUpdate = source2?.id!
        expect(sources.data).toBeInstanceOf(Array)
    })

    it("should add a source to the bot", async () => {
        const bot = await dialoqbase.bot.source.add(botId, [
            {
                content: "https://n4ze3m.com",
                type: "website",
            },
            {
                content: "https://www.youtube.com/watch?v=BLmsVvcUxmY",
                type: "youtube",
                options: {
                    youtube_mode: "transcript"
                }
            },
            {
                content: "Hello World!",
                type: "text",
            },
        ])

        expect(bot.data).toBeInstanceOf(Array)

        expect(bot.data?.length).toBe(3)

    })


    it("It should throw an error due to invalid source content", async () => {
        const { error } = await dialoqbase.bot.source.add(botId, [
            {
                content: "Where is the content?",
                type: "website",
            },
            {
                content: "https://www.youtube.com/watch?v=BLmsVvcUxmY",
                type: "youtube",
                options: {
                    youtube_mode: "transcript"
                }
            },
            {
                content: "Hello World!",
                type: "text",
            },
        ])


        expect(error).toBeInstanceOf(Object)
        expect(error?.status).toBe(400)

    })


    it("should add file source to the bot", async () => {

        const formData = new FormData();

        formData.append("file", pdfFile, "test.pdf")
        formData.append("file", mp3File, "test.mp3")

        const bot = await dialoqbase.bot.source.addFile(botId, formData)
        expect(bot.data).toBeInstanceOf(Array)
        expect(bot.data?.length).toBe(2)

    })


    it("It should throw an error due to invalid file source content", async () => {

        const formData = new FormData();

        formData.append("file", pdfFile, "test.pdf")
        formData.append("file", errorFile, "test.html")

        const { error } = await dialoqbase.bot.source.addFile(botId, formData)

        expect(error).toBeInstanceOf(Object)
        expect(error?.status).toBe(400)

    })


    it("should delete a source from the bot", async () => {
        if (sourceToDelete) {
            const deleted = await dialoqbase.bot.source.delete(botId, sourceToDelete)
            expect(deleted.data).toBe(true)
        }
    })

    it("should refresh a source", async () => {
        if (sourceToUpdate) {
            const refresh = await dialoqbase.bot.source.refresh(botId, sourceToUpdate)
            expect(refresh.data).toBe(true)
        }
    })
})