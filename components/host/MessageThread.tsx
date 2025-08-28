"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDateTime, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "host" | "customer";
  content: string;
  timestamp: string;
  read: boolean;
  bookingId?: string;
}

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  bookingId?: string;
  tourTitle?: string;
  lastMessage?: Message;
  unreadCount: number;
}

interface MessageThreadProps {
  conversationId?: string;
  onConversationSelect?: (conversation: Conversation) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  conversationId,
  onConversationSelect,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (conversation) {
        selectConversation(conversation);
      }
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/host/messages/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    onConversationSelect?.(conversation);

    try {
      const response = await fetch(
        `/api/host/messages/conversations/${conversation.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);

        // Mark messages as read
        await fetch(
          `/api/host/messages/conversations/${conversation.id}/read`,
          {
            method: "POST",
          }
        );

        // Update conversation unread count locally
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id ? { ...c, unreadCount: 0 } : c
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentConversation) return;

    setSendingMessage(true);

    try {
      const response = await fetch("/api/host/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: currentConversation.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage("");

        // Update conversation last message
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConversation.id ? { ...c, lastMessage: message } : c
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Erro ao enviar mensagem. Tenta novamente.");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <Card className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2 animate-pulse">
          <div className="h-full bg-gray-200 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card padding="none" className="flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Conversas</h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <svg
                className="h-8 w-8 mx-auto mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm">Ainda sem conversas</p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={cn(
                    "w-full p-4 text-left hover:bg-gray-50 transition-colors",
                    currentConversation?.id === conversation.id && "bg-blue-50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {conversation.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {conversation.customerName}
                          </p>
                          {conversation.tourTitle && (
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.tourTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {conversation.lastMessage && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.senderRole === "host"
                              ? "Tu: "
                              : ""}
                            {conversation.lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDateTime(conversation.lastMessage.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>

                    {conversation.unreadCount > 0 && (
                      <div className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Messages */}
      <Card padding="none" className="lg:col-span-2 flex flex-col">
        {currentConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b">
              <h4 className="font-semibold text-gray-900">
                {currentConversation.customerName}
              </h4>
              {currentConversation.tourTitle && (
                <p className="text-sm text-gray-600">
                  {currentConversation.tourTitle}
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Inicia uma conversa com o teu cliente</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderRole === "host"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm",
                        message.senderRole === "host"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      <p>{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.senderRole === "host"
                            ? "text-blue-100"
                            : "text-gray-500"
                        )}
                      >
                        {formatDateTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreve uma mensagem..."
                  className="flex-1"
                  disabled={sendingMessage}
                />
                <Button
                  type="submit"
                  loading={sendingMessage}
                  disabled={!newMessage.trim()}
                >
                  Enviar
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="h-12 w-12 mx-auto mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p>Selecciona uma conversa para começar</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MessageThread;
