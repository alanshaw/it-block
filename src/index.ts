import BufferList from 'bl/BufferList.js'
import type { Source } from 'it-stream-types'

interface Options {
  noPad?: boolean
}

export function block (size: number, options?: Options): (source: Source<Uint8Array>) => AsyncIterable<Uint8Array> {
  return async function * (source: Source<Uint8Array>) {
    let buffer = new BufferList()
    let started = false

    for await (const chunk of source) {
      started = true
      // @ts-expect-error bl types are broken
      buffer = buffer.append(chunk)

      while (buffer.length >= size) {
        if (buffer.length === size) {
          yield buffer.slice()
          buffer = new BufferList()
          break
        }

        yield buffer.slice(0, size)
        buffer = buffer.shallowSlice(size)
      }
    }

    if (started && buffer.length > 0) {
      if (options?.noPad === true) {
        yield buffer.slice()
      } else {
        // @ts-expect-error bl types are broken
        yield buffer.append(new Uint8Array(size - buffer.length)).slice()
      }
    }
  }
}
