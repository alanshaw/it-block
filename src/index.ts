import { Uint8ArrayList } from 'uint8arraylist'
import type { Source } from 'it-stream-types'

interface Options {
  noPad?: boolean
}

export function block (size: number, options?: Options): (source: Source<Uint8Array>) => AsyncIterable<Uint8Array> {
  return async function * (source: Source<Uint8Array>) {
    let buffer = new Uint8ArrayList()
    let started = false

    for await (const chunk of source) {
      started = true
      buffer.append(chunk)

      while (buffer.length >= size) {
        if (buffer.length === size) {
          yield buffer.subarray()
          buffer = new Uint8ArrayList()
          break
        }

        yield buffer.subarray(0, size)
        buffer.consume(size)
      }
    }

    if (started && buffer.length > 0) {
      if (options == null || options.noPad == null || !options.noPad) {
        buffer.append(new Uint8Array(size - buffer.length))
      }

      yield buffer.subarray()
    }
  }
}
