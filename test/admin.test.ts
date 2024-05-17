import { createClient } from "../src";
import { describe, expect, it } from 'vitest'


const dialoqbase = createClient(
    process.env.DIALOQBASE_API_URL ?? 'http://localhost:3000',
    process.env.DIALOQBASE_API_KEY ?? 'db_f72f42a139d14cbfb26b2f43344f17e2',
)



describe("Admin Module", () => {

    it("should return array of users", async () => {
        const users = await dialoqbase.admin.getAllUsers()
        expect(users.data).toBeInstanceOf(Array)
    })



    it("should return Dialoqbase core settings", async () => {
        const settings = await dialoqbase.admin.getDialoqbaseCoreSettings()
        expect(settings.data).toBeInstanceOf(Object)
        expect(settings.data).toHaveProperty("noOfBotsPerUser")
        expect(settings.data).toHaveProperty("allowUserToCreateBots")
        expect(settings.data).toHaveProperty("allowUserToRegister")
    })


    it("should update Dialoqbase core settings", async () => {
        const settings = await dialoqbase.admin.getDialoqbaseCoreSettings()

        expect(settings).toBeInstanceOf(Object)

        if (!settings.data) {
            return
        }


        settings.data.noOfBotsPerUser! = 10
        settings.data.allowUserToCreateBots = false
        settings.data.allowUserToRegister = false
        const updated = await dialoqbase.admin.updateDialoqbaseCoreSettings(settings.data)
        expect(updated.data).toBe(true)
    })

    it("should return array of all models", async () => {
        const models = await dialoqbase.admin.getAllModels()
        expect(models.data).toBeInstanceOf(Array)
    })


    it("should save new rag settings", async () => {
        const updated = await dialoqbase.admin.updateRagSettings({
            defaultChunkOverlap: 2000,
            defaultChunkSize: 10000
        })
        expect(updated.data).toBe(true)
    })
})