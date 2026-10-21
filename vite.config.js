import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  }
  if (env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const parsedUrl = new URL(req.url, 'http://localhost')
            if (parsedUrl.pathname === '/api/chat') {
              let body = ''
              req.on('data', (chunk) => {
                body += chunk
              })
              req.on('end', async () => {
                req.body = body

                // Add standard serverless helpers for compatibility
                res.status = (code) => {
                  res.statusCode = code
                  return {
                    json: (data) => {
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify(data))
                    },
                    send: (data) => {
                      res.end(data)
                    },
                  }
                }
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                }

                try {
                  const chatModule = await server.ssrLoadModule('./api/chat.js')
                  await chatModule.default(req, res)
                } catch (err) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }
            next()
          })
        },
      },
    ],
  }
})
