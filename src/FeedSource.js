import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';

export default class FeedSource {
  static id = 1;
  constructor(handler) {
    this.handler = handler;
  }

  async init(nameOrAddress) {
    const ipfsOptions = { 
      repo : `/orbitdb/test/tw${FeedSource.id++}`,
      repoAutoMigrate: true,
      silent: false,
      relay: { enabled: true, hop: { enabled: true, active: true } },
      EXPERIMENTAL: {
        pubsub: true
      } 
    }
    const ipfs = await IPFS.create(ipfsOptions)
    this.ipfs = ipfs;

    ipfs.libp2p.connectionManager.on('peer:disconnect', (peerId) => {
      console.info('Lost Connection"', JSON.stringify(peerId.id))
    })
  
    ipfs.libp2p.connectionManager.on('peer:connect', (peer) => {
      console.info('Producer Found:', peer.id)
    })
    ipfs.pubsub.subscribe('orbitdb-remote-poc', msg => console.info(msg.data.toString()))
    console.log('topics', ipfs.libp2p.pubsub.getTopics())

    const orbitdb = await OrbitDB.createInstance(ipfs, { 
      overwrite: true,
      replicate: true,
      directory: `./id${FeedSource.id++}` 
    })
    const db = await orbitdb.feed(nameOrAddress, {
      accessController: {
        write: ['*']
      }
    })
    this.db = db;
    this.db.events.on('replicate', (address) => {
      console.log('replicate', address)
    })

    this.db.events.on('replicated', () => {
      console.log('replicated')
      const result = this.db.iterator({ limit: -1 }).collect().map(e => e.payload.value)
    console.log(result.join('\n'))
    })
    db.events.on('replicate.progress', () => {console.log('hhhh')})
    db.events.on('ready', () => {
      console.log('database is ready.')
});
    await db.load();
  }

  getDB() {
    return this.db;
  }

  getAddress() {
    return this.db.address.toString();
  }
}