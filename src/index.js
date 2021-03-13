import React from 'react';
import ReactDOM from 'react-dom';
import App from './App2';
// import reportWebVitals from './reportWebVitals';

// window.console.log = 'Verbose'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to console.log results (for example: reportWebVitals(console.console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// (async function main() {
//   const libp2p = await Libp2p.create({
//     addresses: {
//       // Add the signaling server address, along with our PeerId to our multiaddrs list
//       // libp2p will automatically attempt to dial to the signaling server so that it can
//       // receive inbound connections from other peers
//       listen: [
//         '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
//         '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
//       ]
//     },
//     modules: {
//       transport: [Websockets, WebRTCStar],
//       connEncryption: [NOISE],
//       streamMuxer: [Mplex],
//       peerDiscovery: [Bootstrap]
//     },
//     config: {
//       peerDiscovery: {
//         // The `tag` property will be searched when creating the instance of your Peer Discovery service.
//         // The associated object, will be passed to the service when it is instantiated.
//         [Bootstrap.tag]: {
//           enabled: true,
//           list: [
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
//           ]
//         }
//       }
//     }
//   })

//   // Listen for new peers
//   libp2p.on('peer:discovery', (peerId) => {
//     console.log(`Found peer ${peerId.toB58String()}`)
//   })

//   // Listen for new connections to peers
//   libp2p.connectionManager.on('peer:connect', (connection) => {
//     console.log(`Connected to ${connection.remotePeer.toB58String()}`)
//   })

//   // Listen for peers disconnecting
//   libp2p.connectionManager.on('peer:disconnect', (connection) => {
//     console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
//   })

//   await libp2p.start()
//   console.log(`libp2p id is ${libp2p.peerId.toB58String()}`)
//   libp2p.multiaddrs.forEach(addr => {
//     console.log(`${addr.toString()}/p2p/${libp2p.peerId.toB58String()}`)
//   })
// })();
