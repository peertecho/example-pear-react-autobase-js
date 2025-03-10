# Overview
- Example of Pear desktop app with Javascript + React + Hyperswarm + Hypercore
- Multiple app instances can run concurrently (same machine or different machines) 
to connect and replicate messages

# Getting started
## Prod mode
```shell
npm i
npm run build
npm start
```

## Dev mode
```shell
npm i
npm run dev
```

# Run
- Open two apps, e.g. run `npm run dev` in two terminals
- On the first app, 
  - click Start base (name = 'owner', key = '')
  - wait for core created with a core key
- On the second app
  - copy the above core key into the key input box
  - type name as 'member-1'
  - click Start base
  - wait for core created with a core key
- Go back to first app
  - copy the core key of the second app to the writer input box
  - click add
- Now from any app, send message, sync
