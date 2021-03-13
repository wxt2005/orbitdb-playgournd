import React, { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import Libp2p from 'libp2p'
import Websockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import { NOISE } from 'libp2p-noise'
import Mplex from 'libp2p-mplex'
import Bootstrap from 'libp2p-bootstrap'
import multiaddr from 'multiaddr'
import pipe from 'it-pipe';
// import lp from 'it-length-prefixed'
// import pushable from 'it-pushable';
// import pair from 'it-pair'

const CHAT_PROTOCAL = '/chat/0.0.';
const initialMessageListState = [];
function messageListReducer(state, action) {
  switch (action.type) {
    case 'push':
      return [...state, ...action.payload];
    default:
      throw new Error();
  }
}


function App() {
  const nodeRef = useRef(null);
  const inStream = useRef(null);
  const [status, setStatus] = useState(0);
  const [peerID, setPeerID] = useState('');
  const [listenList, setListenList] = useState([]);
  const [targetAddress, setTargetAddress] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, messageListDispatch] = useReducer(messageListReducer, initialMessageListState);

  useEffect(() => {
    async function init() {
      const node = await Libp2p.create({
        addresses: {
          // Add the signaling server address, along with our PeerId to our multiaddrs list
          // libp2p will automatically attempt to dial to the signaling server so that it can
          // receive inbound connections from other peers
          listen: [
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
          ]
        },
        modules: {
          transport: [Websockets, WebRTCStar],
          connEncryption: [NOISE],
          streamMuxer: [Mplex],
          peerDiscovery: [Bootstrap]
        },
        config: {
          peerDiscovery: {
            // The `tag` property will be searched when creating the instance of your Peer Discovery service.
            // The associated object, will be passed to the service when it is instantiated.
            [Bootstrap.tag]: {
              enabled: true,
              list: [
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
              ]
            }
          }
        }
      })
      nodeRef.current = node;
    
      // libp2p.on('peer:discovery', (peerId) => {
      //   console.log(`Found peer ${peerId.toB58String()}`)
      // })
    
      node.connectionManager.on('peer:connect', (connection) => {
        console.log(`Connected to ${connection.remotePeer.toB58String()}`)
      })
    
      // Listen for peers disconnecting
      node.connectionManager.on('peer:disconnect', (connection) => {
        console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
      })
    }
    init();
  }, [])
  const start = useCallback(async () => {
    const node = nodeRef.current;
    if (!node) {
      return;
    }

    await node.start();
    const peerID = node.peerId.toB58String()
    const listenList = node.multiaddrs.map(addr => `${addr.toString()}/p2p/${peerID}`)

    await node.handle(CHAT_PROTOCAL, async ({ stream }) => {
      inStream.current = stream
      pipe(
        stream.source,
        // lp.decode(),
        async function(source) {
          const res = [];
          for await (const msg of source) {
            res.push(msg.toString())
          }
          messageListDispatch({ type: 'push', payload: res })
        }
      )
    })

    setPeerID(peerID);
    setListenList(listenList)
    setStatus(1);
  }, [setPeerID, setStatus, messageListDispatch])
  

  const stop = useCallback(async () => {
    const node = nodeRef.current;
    if (!node) {
      return;
    }

    await node.stop();
    inStream.current = null;
    setPeerID('');
    setListenList([]);
    setStatus(0);
  }, [setPeerID, setStatus]);

  const ping = useCallback(async () => {
    const node = nodeRef.current;
    if (!node) {
      return;
    }

    const ma = multiaddr(targetAddress);
    const latency = await node.ping(ma)
    console.log(`pinged ${targetAddress} in ${latency}ms`)
  }, [targetAddress])


  const sendMessage = useCallback(async () => {
    const node = nodeRef.current;

    if (!node || !message || !targetAddress) {
      return;
    }

    const ma = multiaddr(targetAddress);
    const { stream } = await node.dialProtocol(ma, CHAT_PROTOCAL)
    
    try {
      await pipe(
        [message],
        stream.sink
      )
    } catch (err) {
      console.error(err)
    }
    setMessage('');
  }, [setMessage, message, targetAddress]);

  const node = (
    <div>
      <p>Status: {status === 0 ? 'stopped' : 'started'}</p>
      <p>PeerID: {peerID}</p>
      <div>Listening on:
        <ul>
          {
            listenList.map(addr => <li key={addr.slice(10)}>{addr}</li>)
          }
        </ul>
      </div>
      <div>
        {
          status === 0 ?
            <button onClick={start}>Start</button> :
            <button onClick={stop}>Stop</button>
        }
      </div>
      <div>
        <input placeholder="Target Address" value={targetAddress} onChange={e => setTargetAddress(e.target.value)} />
      </div>
      <div>
        <button onClick={ping}>PING</button>
      </div>
      <div>
        <input placeholder="Your message" value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <ul>
          {
            messageList.map((message, i) => <li key={i}>{message}</li>)
          }
        </ul>
      </div>
    </div>
  )

  return node;
}

export default App