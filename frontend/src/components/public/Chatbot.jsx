import React, { useState, useRef, useEffect } from 'react';

// The main component for the chatbot UI and logic
export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'नमस्ते! मैं आपकी क्या मदद कर सकता हूँ? (Hi! How can I help you today?)' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Automatically scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { from: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot/public/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: inputValue })
            });
            if (!response.ok) throw new Error('Failed to get response.');
            
            const data = await response.json();
            const botMessage = { from: 'bot', text: data.answer };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            const errorMessage = { from: 'bot', text: 'Sorry, something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Chat Window */}
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 w-80' : 'max-h-0 w-0'} overflow-hidden`}>
                <div className="bg-white rounded-lg shadow-xl border flex flex-col h-96">
                    <header className="bg-green-700 text-white p-3 rounded-t-lg">
                        <h3 className="font-semibold text-center">Chat Assistant</h3>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} from={msg.from} text={msg.text} />
                        ))}
                        {isLoading && <p className="text-sm text-gray-500 italic">Bot is typing...</p>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full p-2 border rounded-md"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 rounded-md font-bold hover:bg-green-700" disabled={isLoading}>
                            Send
                        </button>
                    </form>
                </div>
            </div>

            {/* Floating Action Button to toggle the chat */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="bg-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl hover:bg-green-800 transition-transform hover:scale-110"
            >
                {isOpen ? '×' : '💬'}
            </button>
        </div>
    );
}

// A small component to render individual chat messages
function ChatMessage({ from, text }) {
    const isBot = from === 'bot';
    return (
        <div className={`flex mb-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-wrap ${isBot ? 'bg-gray-200 text-gray-800' : 'bg-green-600 text-white'}`}>
                {text}
            </div>
        </div>
    );
}
