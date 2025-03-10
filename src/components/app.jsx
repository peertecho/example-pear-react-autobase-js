import { useState } from 'react'
import b4a from 'b4a'

import { createBase } from '../lib/base'

export default function App () {
  const [inputName, setInputName] = useState('owner')
  const [inputKey, setInputKey] = useState('')
  const [base, setBase] = useState()

  const [writerIndexer, setWriterIndexer] = useState('')
  const [writer, setWriter] = useState('')

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const startBase = async () => {
    const res = await createBase({ name: inputName, ownerKey: inputKey || undefined })
    setBase(res.base)
  }

  return (
    <div style={{ padding: 10, background: 'cyan' }}>
      <h1>MyApp</h1>

      <h2>Start Base</h2>
      <label>Name</label>
      <div>
        <input type='text' value={inputName} onChange={(evt) => setInputName(evt.currentTarget.value)} />
      </div>
      <label>Key</label>
      <div>
        <textarea type='text' value={inputKey} onChange={(evt) => setInputKey(evt.currentTarget.value)} />
      </div>
      <button onClick={startBase}>Start</button>
      <p>Key: {base && b4a.toString(base.local.key, 'hex')}</p>
      <p>Indexer: {base && base.isIndexer}</p>
      <p>Members: {base && base.system.members}</p>
      <p>Writers: {base && base.activeWriters.size}</p>

      <hr />

      <h3>Add writer (indexer)</h3>
      <div>
        <textarea type='text' value={writerIndexer} onChange={(evt) => setWriterIndexer(evt.currentTarget.value)} />
      </div>
      <button onClick={() => base.append({ add: writerIndexer, indexer: true })}>Add</button>

      <h3>Add writer (non-indexer)</h3>
      <div>
        <textarea type='text' value={writer} onChange={(evt) => setWriter(evt.currentTarget.value)} />
      </div>
      <button onClick={() => base.append({ add: writer, indexer: false })}>Add</button>

      <hr />

      <h3>Send message</h3>
      <div>
        <textarea type='text' value={message} onChange={(evt) => setMessage(evt.currentTarget.value)} />
      </div>
      <button onClick={() => base.append(message)}>Send</button>
      <button onClick={() => base.update().then(async () => {
        console.log('updated', base.view.length)
        const data = []
        for (let i = 0; i < base.view.length; i++) {
          data.push(await base.view.get(i))
        }
        setMessages(data)
      })}
      >Sync
      </button>

      <h3>Receive message</h3>
      {messages.map((msg, idx) => (
        <div key={idx}>
          <pre>{msg}</pre>
        </div>
      ))}
    </div>
  )
}
