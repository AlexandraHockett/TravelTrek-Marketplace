// components/host/MessageThread.tsx
"use client";
import { useState } from "react";
import Button from "../shared/Button";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface MessageThreadProps {
  messages: Message[];
}

export default function MessageThread({ messages }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async () => {
    // Call API to send message
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ content: newMessage }),
    });
    setNewMessage("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 ${msg.sender === "host" ? "text-right" : "text-left"}`}
          >
            <p className="text-sm">{msg.content}</p>
            <span className="text-xs text-gray-500">{msg.timestamp}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <Button onClick={handleSend} className="ml-2">
          Send
        </Button>
      </div>
    </div>
  );
}
