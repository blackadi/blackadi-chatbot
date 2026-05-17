# blackadi-chatbot

A Nuxt 4 based conversational chatbot prototype using OpenAI Threads API.

This repository is implemented as a lightweight Nuxt application with a client-side chat UI, server-side API routes, and a small runtime config surface for OpenAI integration.

---

## Architecture Overview

### Core layers

- `app/`: Nuxt application entrypoints and Vue components.
  - `app/app.vue`: root page wrapper that switches between the onboarding screen and chat experience.
  - `app/components/Start.vue`: initial onboarding form that creates a new OpenAI thread and run.
  - `app/components/Chat.vue`: chat display component that fetches and renders thread messages.
  - `app/components/MessageForm.vue`: message input component that submits user text to the server and renders assistant replies.
  - `app/composables/`: shared state and customer utilities.

- `server/api/`: Nitro server handlers exposed as internal REST-style endpoints.
  - `server/api/thread.ts`: creates a new OpenAI thread and initial run for a customer session.
  - `server/api/message.post.ts`: sends a user message into an existing thread and creates a new assistant run.
  - `server/api/message.get.ts`: polls for run completion and returns the latest thread messages.

- `server/utils/`: shared helper modules for OpenAI access.
  - `server/utils/openai.ts`: constructs the OpenAI SDK client using `runtimeConfig.openaiKey`.
  - `server/utils/get-message.ts`: waits for a thread run to complete and returns the message list.

### External services

- OpenAI SDK: `openai@^6.37.0`
- Tailwind CSS via `@nuxtjs/tailwindcss`
- Markdown sanitization/rendering with `marked` and `dompurify`

---

## Runtime Behavior

### Thread lifecycle

1. User enters their name in `Start.vue`.
2. `server/api/thread.ts` creates a new OpenAI thread and initial assistant run.
3. The API returns `thread.id` and `run.id`, which are stored in Nitro cookies:
   - `thread-id`
   - `run-id`
4. Chat messages are rendered in `Chat.vue` by fetching `GET /api/message`.
5. `MessageForm.vue` submits user text via `POST /api/message`.
6. `server/api/message.post.ts` appends the user message to the thread and creates a new assistant run.
7. `server/utils/get-message.ts` polls the run until `status === "completed"`, then returns the latest messages for the thread.

### Message rendering

- The assistant response is sanitized with `DOMPurify` and parsed into HTML using `marked`.
- `Chat.vue` renders assistant content with `v-html` for rich text support.
- User messages are rendered as plain text.

---

## Installation

```bash
npm install
```

> This project is configured as a Nuxt 4 app with ESM mode via `type: "module"`.

## Running Locally

### Development mode

```bash
npm run dev
```

### Production preview

```bash
npm run build
npm run preview
```

---

## Configuration

### OpenAI API Key

This app expects the OpenAI key to be available in Nuxt runtime config as `openaiKey`.

In Nuxt 4, you can set this using environment variables or a `.env` file if you extend the config.

Example:

```bash
export NUXT_PUBLIC_OPENAIKEY="sk-..."
```

Then wire it into `nuxt.config.ts` as needed.

> Current config in `nuxt.config.ts`:
>
> ```ts
> export default defineNuxtConfig({
>   compatibilityDate: '2025-07-15',
>   devtools: { enabled: true },
>   modules: ['@nuxtjs/tailwindcss'],
>   runtimeConfig: {
>     openaiKey: ''
>   }
> })
> ```

### Environment variables

The repo currently uses `runtimeConfig.openaiKey` directly. For production, you should expose the key via secure environment variable injection in your deployment platform.

---

## Important Files

- `package.json`: dependency and script configuration
- `nuxt.config.ts`: Nuxt runtime config and modules
- `server/utils/openai.ts`: OpenAI client bootstrap
- `server/api/thread.ts`: thread and first run creation
- `server/api/message.post.ts`: send user messages and spawn new assistant runs
- `server/api/message.get.ts`: poll for run completion and return thread messages
- `app/components/Chat.vue`: message list rendering
- `app/components/MessageForm.vue`: user message submission
- `app/components/Start.vue`: customer onboarding and thread initialization

---

## Extending the Project

### Adding a new feature

1. Identify the data flow:
   - user input -> `MessageForm.vue`
   - server processing -> `server/api/message.post.ts`
   - OpenAI thread/run -> `server/utils/get-message.ts`
   - display -> `Chat.vue`
2. Add new frontend state in `app/composables/` if the feature needs shared reactive state.
3. Extend the API routes in `server/api/` for new backend behavior.
4. Keep OpenAI client construction centralized in `server/utils/openai.ts`.

### Recommended improvements

- Persist `thread-id` / `run-id` to a backend session store or database for multi-device continuity.
- Add explicit typed runtime config validation and support for environment variable fallbacks.
- Update `server/api/message.post.ts` so it updates the active `run-id` cookie after every new run creation. This ensures polling and run status tracking remain aligned with the latest assistant execution.
- Add error handling around OpenAI API calls and HTTP response errors.
- Extract markdown sanitization to a shared utility if multiple components need safe HTML rendering.

### Adding a new conversational assistant

1. Define a new assistant ID constant in `server/utils/openai.ts` or a dedicated config file.
2. Use the new ID in `server/api/thread.ts` and `server/api/message.post.ts`.
3. Update the prompt or `additional_instructions` payload to reflect the assistant’s persona or behavior.

---

## Developer Notes

- `useState` in `app/composables/states.ts` is global reactive state shared across the Nuxt app.
- `useCookie` in `app/composables/customer.ts` persists the customer name across page reloads.
- `server/api/message.get.ts` is called with `lazy: true` in `Chat.vue` to fetch messages only after the component mounts.
- The OpenAI `Threads API` usage is inside the beta namespace and is subject to changes in the upstream SDK.

---

## Troubleshooting

- If the app throws `Missing OpenAI API Key in runtimeConfig`, verify that `openaiKey` is set and available to Nitro.
- If assistant responses do not appear, check the browser cookies for `thread-id` and `run-id`.
- If markdown is not rendering safely, inspect `DOMPurify.sanitize(...)` usage in `MessageForm.vue`.

---

## License

This repository does not include a license file by default.
