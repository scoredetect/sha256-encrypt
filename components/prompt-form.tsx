import * as React from 'react'
import Link from 'next/link'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import { stripHtml } from 'string-strip-html'

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

interface InputMessageEvent extends MessageEvent {
  data: {
    payload: {
      content: string
      type: string
    }
    source: string
  }
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // get message called 'message' from postMessage
    const handleMessage = (event: InputMessageEvent) => {
      // check if the message payload contains the content
      if (!event.data?.payload?.content) {
        return
      }

      // check if the message payload contains the type as 'verify'
      if (event.data?.payload?.type !== 'verify') {
        return
      }

      const { payload } = event.data

      setInput(payload.content)

      // set timeout to at least 1ms to make sure the form is rendered
      setTimeout(() => {
        // submit the form
        formRef.current?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        )
      }, 1)
    }

    globalThis.addEventListener('message', handleMessage)
  }, [formRef, setInput])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        const sanitizedContent = stripHtml(input.trim()).result
        await onSubmit(sanitizedContent)
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pr-8 sm:rounded-md sm:border sm:pr-12">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus />
              <span className="sr-only">Upload File</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Upload File</TooltipContent>
        </Tooltip> */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Input your content here."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Generate SHA256</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate SHA256</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
