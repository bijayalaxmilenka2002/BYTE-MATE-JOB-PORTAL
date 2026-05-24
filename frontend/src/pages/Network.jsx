import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function Network() {
  const [activeTab, setActiveTab] = useState('connections'); 
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  const socketRef = useRef(null);
  const selectedUserRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const currentUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!currentUserId) return;
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join_room', currentUserId);

    socketRef.current.on('receive_message', (newMessage) => {
      const incomingSenderId = newMessage.sender?._id || newMessage.sender;
      const activeUser = selectedUserRef.current; 
      
      if (activeUser && incomingSenderId === activeUser._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [currentUserId]);

  const loadNetworkData = async () => {
    try {
      const netRes = await fetch('http://localhost:5000/api/network/network', {
        headers: { 'x-auth-token': token }
      });
      if (netRes.ok) {
        const netData = await netRes.json();
        setConnections(netData.connections);
        setPendingRequests(netData.pendingRequests);
      }

      const sugRes = await fetch('http://localhost:5000/api/network/suggested', {
        headers: { 'x-auth-token': token }
      });
      if (sugRes.ok) {
        const sugData = await sugRes.json();
        setSuggestions(sugData);
      }
    } catch (err) {
      console.error("Error loading network data:", err);
    }
  };

  useEffect(() => {
    loadNetworkData();
  }, []);

  const handleSendRequest = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/network/request/${userId}`, {
        method: 'POST', headers: { 'x-auth-token': token }
      });
      if (res.ok) loadNetworkData(); 
    } catch (err) { console.error(err); }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/network/accept/${userId}`, {
        method: 'POST', headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        loadNetworkData(); 
        setActiveTab('connections'); 
      }
    } catch (err) { console.error(err); }
  };

  const handleDeclineRequest = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/network/decline/${userId}`, {
        method: 'POST', headers: { 'x-auth-token': token }
      });
      if (res.ok) loadNetworkData();
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (selectedUser && activeTab === 'connections') {
      const fetchHistory = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/messages/${selectedUser._id}`, {
            headers: { 
                'x-auth-token': token,
                'userid': currentUserId // Sending our ID to the backend route
            }
          });
          if (res.ok) {
            const history = await res.json();
            setMessages(history);
          }
        } catch (err) { console.error(err); }
      };
      fetchHistory();
    }
  }, [selectedUser, activeTab, currentUserId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Error: User ID is missing! Please click the red Logout button and log back in.");
      return;
    }
    if (!socketRef.current) {
      alert("Error: Not connected to the live chat server. Is your Node backend running?");
      return;
    }

    if (messageInput.trim() && selectedUser) {
      const messageData = {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        content: messageInput,
      };
      
      socketRef.current.emit('send_message', messageData);
      
      setMessages((prev) => [...prev, {
        sender: { _id: currentUserId }, 
        receiver: selectedUser._id,
        content: messageInput
      }]);
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 py-8 px-4 flex justify-center">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden min-h-[75vh]">
        
        <div className="w-1/3 border-r border-gray-100 bg-gray-50/30 flex flex-col">
          <div className="flex border-b border-gray-200 bg-white">
            <button onClick={() => setActiveTab('connections')} className={`flex-1 py-4 text-sm font-bold ${activeTab === 'connections' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
              Chat ({connections.length})
            </button>
            <button onClick={() => setActiveTab('suggestions')} className={`flex-1 py-4 text-sm font-bold ${activeTab === 'suggestions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
              Find Connects
            </button>
            <button onClick={() => setActiveTab('requests')} className={`flex-1 py-4 text-sm font-bold relative ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
              Requests
              {pendingRequests.length > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{pendingRequests.length}</span>}
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow p-4 space-y-3">
            {activeTab === 'connections' && (
              connections.length === 0 ? <p className="text-center text-gray-400 mt-10 text-sm">No connections yet. Go find some!</p> :
              connections.map(user => (
                <div key={user._id} onClick={() => setSelectedUser(user)} className={`p-4 rounded-xl cursor-pointer transition flex items-center space-x-4 border ${selectedUser?._id === user._id ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent hover:border-gray-200 shadow-sm'}`}>
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              ))
            )}

            {activeTab === 'suggestions' && (
              suggestions.length === 0 ? <p className="text-center text-gray-400 mt-10 text-sm">No new people found.</p> :
              suggestions.map(user => (
                <div key={user._id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={() => handleSendRequest(user._id)} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded hover:bg-blue-600 hover:text-white transition">
                    Connect
                  </button>
                </div>
              ))
            )}

            {activeTab === 'requests' && (
              pendingRequests.length === 0 ? <p className="text-center text-gray-400 mt-10 text-sm">No pending requests.</p> :
              pendingRequests.map(user => (
                <div key={user._id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleAcceptRequest(user._id)} className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition">Accept</button>
                    <button onClick={() => handleDeclineRequest(user._id)} className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded hover:bg-gray-200 transition">Decline</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-2/3 flex flex-col bg-white">
          {activeTab === 'connections' && selectedUser ? (
            <>
              <div className="p-6 border-b border-gray-100 flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{selectedUser.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-xs text-green-500 font-bold">Connected</p>
                </div>
              </div>

              <div className="flex-grow p-6 overflow-y-auto bg-gray-50/30 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20 font-medium">Say hello to {selectedUser.name}!</div>
                ) : (
                  messages.map((msg, index) => {
                    const isMyMessage = (msg.sender?._id || msg.sender) === currentUserId;
                    return (
                      <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${isMyMessage ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-none'}`}>
                          <p className="text-sm">{msg.content}</p> 
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={sendMessage} className="flex space-x-3">
                  <input 
                    type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..." className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" disabled={!messageInput.trim()} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50">
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400 bg-gray-50/10">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <p className="font-medium text-lg text-gray-500">
                {activeTab === 'suggestions' ? "Send connection requests to grow your network" :
                 activeTab === 'requests' ? "Review your pending connection requests" :
                 "Select a connection to start chatting"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}