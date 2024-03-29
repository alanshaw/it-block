import { expect } from 'aegir/chai'
import { pipe } from 'it-pipe'
import all from 'it-all'
import map from 'it-map'
import { block } from '../src/index.js'

describe('it-block', () => {
  it('should emit uniform block sizes (2b)', async () => {
    const input = [Uint8Array.from([0, 1, 2, 3, 4, 5])]

    const result = await pipe(
      input,
      block(2),
      source => map(source, l => l.subarray()),
      async (source) => await all(source)
    )

    expect(result).to.deep.equal([
      Uint8Array.from([0, 1]),
      Uint8Array.from([2, 3]),
      Uint8Array.from([4, 5])
    ])
  })

  it('should emit uniform block sizes (4b)', async () => {
    const input = [Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7])]

    const result = await pipe(
      input,
      block(4),
      source => map(source, l => l.subarray()),
      async (source) => await all(source)
    )

    expect(result).to.deep.equal([
      Uint8Array.from([0, 1, 2, 3]),
      Uint8Array.from([4, 5, 6, 7])
    ])
  })

  it('should emit uniform block sizes with padding', async () => {
    const input = [Uint8Array.from([0, 1, 2])]

    const result = await pipe(
      input,
      block(2),
      source => map(source, l => l.subarray()),
      async (source) => await all(source)
    )

    expect(result).to.deep.equal([
      Uint8Array.from([0, 1]),
      Uint8Array.from([2, 0])
    ])
  })

  it('should emit uniform block sizes without padding', async () => {
    const input = [Uint8Array.from([0, 1, 2])]

    const result = await pipe(
      input,
      block(2, { noPad: true }),
      source => map(source, l => l.subarray()),
      async (source) => await all(source)
    )

    expect(result).to.deep.equal([
      Uint8Array.from([0, 1]),
      Uint8Array.from([2])
    ])
  })
})
