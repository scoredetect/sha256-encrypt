import { sha256 } from '@/lib/utils'

export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json

  // get the latest message with role 'user'
  const latestMessage = messages[messages.length - 1]

  const checksum = await sha256(latestMessage.content)

  const message = `Thanks! Here is your encrypted SHA256 checksum value:\n\n\`\`\`\n${checksum}\n\`\`\``

  return new Response(message, {
    status: 200
  })
}
