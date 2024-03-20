# dialoqbase-js

This is a JavaScript library for the [Dialoqbase](https://dialoqbase.n4ze3m.com) API. It is a simple wrapper around the API, providing a more convenient way to interact with it.

## Getting Started

First of all, you need to install the library:

```bash
npm install dialoqbase
```

Then you're ready to use it:

```typescript
import { createClient } from 'dialoqbase';

const dialoqbase = createClient(
    'http://localhost:3000',
    'your-api-key'
)
```

## Usage

### Creating a new bot

```typescript
const {data, error} = await dialoqbase.bot.create({
    name: "Test Bot 2",
    model: "claude-3-opus-20240229",
    embedding: "nomic-ai/nomic-embed-text-v1.5"
})
```

### Adding file based sources

```typescript
const formData = new FormData();

formData.append("file", pdfFile, "test.pdf")
formData.append("file", mp3File, "test.mp3")

const {data, error} = await dialoqbase.bot.source.addFile(botId, formData)
```

### Adding text based sources

```typescript
const {data, error} = await dialoqbase.bot.source.add(botId, [
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
```

### Chatting with the bot (streaming)

```typescript
const chat = await dialoqbase.bot.chat(botId, {
    message: "Hello tell me a joke",
    stream: true,
    history: []
})

for await (const message of chat) {
    console.log(message.bot.text)
}
```

### Chatting with the bot (non-streaming)

```typescript
const response = await dialoqbase.bot.chat(botId, {
    message: "Hello tell me a joke",
    stream: false,
    history: []
})

console.log(response.bot.text)
```

### Deleting a bot

```typescript
const {data, error} = await dialoqbase.bot.delete(botId)
```

## License

MIT
