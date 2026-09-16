import { API_BASE_URL } from '../config';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Connect to our backend socket server
const socket = io(API_BASE_URL);

export default function ChatBox({ receiver, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  // THE FIX: Safely grab the ID whether it has an underscore or not!
  const myId = currentUser._id || currentUser.id;

  // Automatically scroll to the bottom of the chat when a new message appears
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 1. Join our private room to listen for incoming messages
    socket.emit('join_room', myId);

    // 2. Fetch past conversation history from the database
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/${receiver._id}`, {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        
        // Ensure we only set array data
        if (Array.isArray(data)) {
            setMessages(data);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    fetchHistory();

    // 3. Listen for live incoming messages from Socket.io
    const receiveMessageHandler = (message) => {
      if (message.sender === receiver._id || message.sender === myId) {
         setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receive_message', receiveMessageHandler);

    // Cleanup the listener when we close the chat box
    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [receiver._id, myId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: myId, // Using the safe ID here!
      receiverId: receiver._id,
      content: newMessage
    };

    // Emit the message instantly via WebSockets
    socket.emit('send_message', messageData);

    // Optimistically add it to our own screen right away
    setMessages((prev) => [...prev, { ...messageData, sender: myId }]);
    setNewMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-t-xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-blue-600 p-3 flex justify-between items-center text-white shadow-sm">
        <h3 className="font-bold text-sm">{receiver.name}</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200 font-bold text-lg leading-none">&times;</button>
      </div>

      {/* Messages Area */}
      <div className="h-64 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-3">
        {messages.length === 0 && <p className="text-center text-xs text-gray-400 mt-4">Start the conversation...</p>}
        
        {messages.map((msg, index) => {
          const isMe = msg.sender === myId;
          return (
            <div key={index} className={`max-w-[85%] p-2 rounded-lg text-sm ${isMe ? 'bg-blue-500 text-white self-end rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none shadow-sm'}`}>
              {msg.content}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-r-md hover:bg-blue-700 transition">Send</button>
      </form>
      
    </div>
  );
}