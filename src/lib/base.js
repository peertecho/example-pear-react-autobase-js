/* global Pear */
/** @typedef {import('pear-interface')} */

import path from 'path'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import Autobase from 'autobase'
import b4a from 'b4a'

const { updates, reload, teardown } = Pear

updates(() => reload())

const swarm = new Hyperswarm()
teardown(() => swarm.destroy())

export async function createBase ({ name, ownerKey } = {}) {
  console.log('starting base', name)
  const store = new Corestore(path.join(Pear.config.storage, name))
  teardown(() => store.close())
  await store.ready()
  swarm.on('connection', (conn) => store.replicate(conn))

  const base = new Autobase(store, ownerKey, {
    valueEncoding: 'json',
    apply: async (nodes, view, base) => {
      for (const { value } of nodes) {
        if (value.add) {
          const key = b4a.from(value.add, 'hex')
          await base.addWriter(key, { indexer: value.indexer })
          continue
        }
        if (view) await view.append(value)
      }
    },
    open: (store) => store.get('view', { valueEncoding: 'json' })
  })
  teardown(() => base.close())
  await base.ready()

  swarm.join(base.discoveryKey)
  await swarm.flush()

  await base.update()

  return { base }
}
