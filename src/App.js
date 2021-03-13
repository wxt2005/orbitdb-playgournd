import React, { useState, useEffect, useCallback, useRef } from 'react';
import Client from './Client';

const isConsumer = /consumer/.test(window.location.href)

function App() {
  const [appState, setAppState] = useState(0);
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([])
  const [followAddress, setFollowAddress] = useState('');

  const clientRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!clientRef.current) {
      return;
    }

    const messageList = await clientRef.current.getTimeline();
    setMessageList(messageList)
  }, [setMessageList])

  const loginNode = (
    <div>
      <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={async () => {
        if (!username) {
          return;
        }

        setAppState(1);
        const client = new Client(username, isConsumer);
        clientRef.current = client;
        await client.init();
        setAddress(client.getAddress());
        await refresh();
        setAppState(2);
      }}>login</button>
    </div>
  );

  const loadingNode = (
    <div>loading...</div>
  );

  const loggedInNode = (
    <div>
      <p>User: {username}</p>
      <p>Address: {address}</p>
      <div style={{marginBottom: 20}}>
        <input placeholder="follow address" value={followAddress} onChange={(e) => setFollowAddress(e.target.value)} />
        <button onClick={async () => {
          if (!followAddress) {
            return;
          }
          await clientRef.current.timelineController.addByAddress(followAddress);
          await refresh();
          setFollowAddress('');
        }}>
          follow
        </button>
      </div>
      <textarea placeholder="What would you like to share?" value={message} onChange={(e) => setMessage(e.target.value)} />
      <div>
        <button onClick={async () => {
          console.log('message', message);
          if (!message) {
            return;
          }
          await clientRef.current.newMessage(message);
          await refresh();
          setMessage('');
        }}>POST</button>
      </div>
      <ul>
        {
          messageList.map(o => (
          <li key={o.hash}>
            <p>{new Date(o.t).toLocaleString()}</p>
            <p>
              {o.handler}: {o.message}
            </p>
          </li>))
        }
      </ul>
    </div>
  )

  let content = null;
  switch (appState) {
    case 0:
      content = loginNode;
      break;
    case 1:
      content = loadingNode;
      break;
    case 2:
      content = loggedInNode;
      break;
    default:
      content = loginNode;
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
