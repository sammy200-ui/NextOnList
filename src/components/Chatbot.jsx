import React, { useState } from 'react';
import { getChatbotResponse } from '../api/chatbot';

function Chatbot({ onSuggestion }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, type: 'user' };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(message);
      const botMessage = { 
        text: response,
        type: 'bot' 
      };
      setChatHistory(prev => [...prev, botMessage]);
      onSuggestion(response);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = { 
        text: "I apologize, but I'm having trouble connecting to the recommendation service. Please try again in a moment.", 
        type: 'bot' 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setMessage('');
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h3>Movie Recommendation Assistant</h3>
      </div>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            {msg.type === 'bot' ? (
              <div className="recommendations">
                {msg.text.split('\n').map((line, i) => (
                  <div key={i} className="recommendation-item">
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message bot">
            <div className="loading-dots">
              Finding recommendations<span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask for movie/TV show/anime recommendations..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default Chatbot;