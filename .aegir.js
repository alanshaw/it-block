/** @type {import('aegir').Options} */
export default {
  build: {
    bundlesizeMax: '3KB'
  },
  dependencyCheck: {
    ignore: [
      'it-block',
      'it-pipe'
    ]
  }
}