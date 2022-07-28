# it-block <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/alanshaw/it-block.svg?style=flat-square)](https://codecov.io/gh/alanshaw/it-block)
[![CI](https://img.shields.io/github/workflow/status/alanshaw/it-block/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/alanshaw/it-block/actions/workflows/js-test-and-release.yml)

> transform input into equally-sized blocks of output using async iterators

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
  - [Example](#example)
- [API](#api)
  - [`const b = block(size, opts)`](#const-b--blocksize-opts)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-block
```

An async iterators version of [block-stream](https://npmjs.org/package/block-stream).

## Usage

### Example

```js
import { block } from 'it-block'
import { pipe } from 'it-pipe'

const chr = s => '\\x' + pad(s.charCodeAt(0).toString(16), 2)
const pad = (s, n) => Array(n - s.length + 1).join('0') + s

pipe(
  process.stdin,
  block({ size: 16 }),
  async source => {
    for await (const buf of source) {
      const str = new TextDecoder().decode(buf.slice()).replace(/[\x00-\x1f]/g, chr)
      console.log('buf[' + buf.byteLength + ']=' + str)
    }
  }
)
```

```console
$ echo {c,d,f}{a,e,i,o,u}{t,g,r} | node example/stream.js
buf[16]=cat cag car cet
buf[16]=ceg cer cit cig
buf[16]=cir cot cog cor
buf[16]=cut cug cur dat
buf[16]=dag dar det deg
buf[16]=der dit dig dir
buf[16]=dot dog dor dut
buf[16]=dug dur fat fag
buf[16]=far fet feg fer
buf[16]=fit fig fir fot
buf[16]=fog for fut fug
buf[16]=fur\x0a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00
```

## API

```js
import { block } from 'it-block'
```

### `const b = block(size, opts)`

Create a new [transform](https://www.npmjs.com/package/it-stream-types) `b` that yields chunks of length `size`.

**Note**: chunks that are output are [`Uint8ArrayList`](https://www.npmjs.com/package/uint8arraylist) objects NOT `Uint8Array`s.

When `opts.noPad` is `true`, do not zero-pad the last chunk.

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
