import { UseChatHelpers } from 'ai/react'

import { ExternalLink } from '@/components/external-link'

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to the SHA256 Tool!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an open source tool built with native browser Web APIs.
        </p>
        <p className="mb-2 leading-normal text-muted-foreground">
          You can input your content in the box below to generate a SHA256 hash
          of your context. Any string of text is accepted including line-breaks.
        </p>
        <p className="leading-normal text-muted-foreground">
          The code for this tool is available on{' '}
          <ExternalLink href="https://github.com/scoredetect/sha256-encrypt">
            GitHub
          </ExternalLink>
        </p>
      </div>
    </div>
  )
}
