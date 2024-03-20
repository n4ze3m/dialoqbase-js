import { createClient } from "../src";
import { beforeEach, describe, expect, it } from 'vitest'

const dialoqbase = createClient(
    "http://localhost:3000",
    "db_ed2e9ded3f8a46a89063fee4590179b5"
)



describe("Bot Chat Module", () => {
    let botId: string = ""

    beforeEach(async () => {
        const { data: bots } = await dialoqbase.bot.listAll()
        const bot = bots?.find(bot => bot.source.length > 0)
        botId = bot?.id!
    })



    it("should return a async iterator", async () => {
        const chat = await dialoqbase.bot.chat(botId, {
            message: "Hello tell me a joke",
            stream: true,
            history: []
        })

        let result = [];

        for await (const message of chat) {
            result.push(message)

        }


        expect(result).toBeInstanceOf(Array)

        expect(result.length).toBeGreaterThan(0)

    }, 100000)


    it("should return a chat response", async () => {
        const chat = await dialoqbase.bot.chat(botId, {
            message: "Hello tell me a joke",
            stream: false,
            history: []
        })
        expect(chat).toBeInstanceOf(Object)
    }, 100000)
})