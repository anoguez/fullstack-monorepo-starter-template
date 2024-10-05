'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Send, User, Paperclip, X } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string | CardContent;
  file?: File;
}

interface CardContent {
  title: string;
  description: string;
  items: string[];
}

const initialMessages: Message[] = [
  { id: 0, type: 'bot', content: 'Hello! How can I assist you today?' },
];

export function ChatbotUi() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() && !file) return;

    const newMessage: Message = {
      id: messages.length,
      type: 'user',
      content: inputValue.trim() || 'Uploaded a file',
      file: file || undefined,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setFile(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${await response.text()}`
        );
      }

      const data: Message = await response.json();
      setMessages((prevMessages) => [...prevMessages, data]);
      setError(null); // Clear error on successful response
    } catch (error: any) {
      setError(error.message);
    }
  }, [file, inputValue, messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  //Improved message rendering with a functional component for better readability and reusability
  const renderMessage = ({ id, type, content, file }: Message) => (
    <div key={id} className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${type === 'user' ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg p-3 shadow`}>
        {typeof content === 'string' ? (
          <>
            <p>{content}</p>
            {file && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">Uploaded: {file.name}</p>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{content.description}</p>
              <ul className="list-disc pl-5 mt-2">{content.items.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Fullstack Chatbot</h2>
        <ul>
          {['Chat Example'].map((topic, index) => (
            <li key={index} className="mb-2">
              <Button variant="ghost" className="w-full justify-start">
                <ChevronRight className="mr-2 h-4 w-4" />
                {topic}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              } mb-4`}
            >
              <div
                className={`max-w-[70%] ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white'
                } rounded-lg p-3 shadow`}
              >
                {typeof message.content === 'string' ? (
                  <>
                    <p>{message.content}</p>
                    {message.file && (
                      <div className="mt-2 p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">
                          Uploaded: {message.file.name}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.content.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{message.content.description}</p>
                      <ul className="list-disc pl-5 mt-2">
                        {message.content.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 mr-2"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                size="icon"
                className="mr-2"
                aria-label="Upload file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </label>
            <Button onClick={handleSendMessage} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {file && (
            <div className="mt-2 p-2 bg-gray-100 rounded flex items-center justify-between">
              <p className="text-sm text-gray-600">{file.name}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
