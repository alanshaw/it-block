import { Uint8ArrayList } from 'uint8arraylist'
import { withArrayBuffer } from 'uint8arrays/with-array-buffer'
import type { Source } from 'it-stream-types'

interface Options {
  noPad?: boolean
}

export function block <T extends ArrayBufferLike = ArrayBufferLike> (size: number, options?: Options): (source: Source<Uint8Array<T> | Uint8ArrayList<T>>) => AsyncIterable<Uint8ArrayList<ArrayBuffer>> {
  return async function * (source: Source<Uint8Array<T> | Uint8ArrayList<T>>) {
    let buffer = new Uint8ArrayList<ArrayBuffer>()
    let started = false

    for await (const chunk of source) {
      started = true
      buffer.append(withArrayBuffer(chunk instanceof Uint8Array ? chunk : chunk.subarray()))

      while (buffer.length >= size) {
        if (buffer.length === size) {
          yield buffer.sublist()
          buffer = new Uint8ArrayList()
          break
        }

        yield buffer.sublist(0, size)
        buffer.consume(size)
      }
    }

    if (started && buffer.length > 0) {
      if (options == null || options.noPad == null || !options.noPad) {
        buffer.append(new Uint8Array(size - buffer.length))
      }

      yield buffer.sublist()
    }
  }
}
