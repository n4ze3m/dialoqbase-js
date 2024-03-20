import { createClient } from "../src";
import { describe, expect, it } from 'vitest'

const dialoqbase = createClient(
    "http://localhost:3000",
    "db_ed2e9ded3f8a46a89063fee4590179b5"
)



describe("Bot Module", () => {
    let botForDelete: string = ""

    it("should return all bots", async () => {
        const bots = await dialoqbase.bot.listAll()
        expect(bots.data).toBeInstanceOf(Array)
        expect(bots.data?.length).toBeGreaterThan(0)
    })


    it("should return a bot id", async () => {
        const bot = await dialoqbase.bot.create({
            name: "Test Bot 2",
            model: "claude-3-opus-20240229",
            embedding: "nomic-ai/nomic-embed-text-v1.5"
        })
        botForDelete = bot.data!
        expect(typeof bot.data).toBe("string")
    }, 100000)


    it("should return a boolean wheather the bot is ready to chat", async () => {
        const ready = await dialoqbase.bot.isReady(botForDelete)
        expect(typeof ready.data).toBe("boolean")
    })

    it("get a info about a bot", async () => {
        const bot = await dialoqbase.bot.get(botForDelete)
        expect(bot.data).toBeInstanceOf(Object)
    })


    it("it should update a bot info", async () => {
        const data = {
            bot_model_api_key: "test",
            bot_protect: true,
            model: "claude-3-opus-20240229",
            name: "Test Bot 3",
            question_generator_prompt: "Hello World",
            system_prompt: "Hello World",
            showRef: true,
            streaming: false,
            temperature: 0.5,
            use_hybrid_search: false,
            use_rag: false
        }
        const updated = await dialoqbase.bot.update(botForDelete, data)

        const bot = await dialoqbase.bot.get(botForDelete)
        expect(updated.data).toBe(true)

        expect(bot.data).toHaveProperty("name", data.name)
        expect(bot.data).toHaveProperty("model", data.model)
        expect(bot.data).toHaveProperty("questionGeneratorPrompt", data.question_generator_prompt)
        expect(bot.data).toHaveProperty("qaPrompt", data.system_prompt)

    },100000)

    it("delete bot", async () => {
        const deleted = await dialoqbase.bot.delete(botForDelete)
        expect(deleted.data).toBe(true)
    })

})