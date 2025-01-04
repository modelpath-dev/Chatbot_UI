import React, { useState } from 'react';
import { Send } from 'lucide-react';

const App = () => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();
      setResponses(prev => [...prev, {
        query: query.trim(),
        response: data.response,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setResponses(prev => [...prev, {
        query: query.trim(),
        response: 'Sorry, there was an error processing your request.',
        timestamp: new Date().toLocaleTimeString(),
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Assistant</h1>
          <p className="text-gray-600">#Modify this area and introduce your chatbot</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6">
            {responses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <Send className="w-8 h-8 text-blue-500 rotate-12" />
                </div>
                <p>Start a conversation by asking a question</p>
              </div>
            ) : (
              <div className="space-y-6">
                {responses.map((item, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-blue-50 rounded-lg py-2 px-4 max-w-[80%]">
                        <p className="text-gray-800">{item.query}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className={`${item.error ? 'bg-red-50' : 'bg-gray-50'} rounded-lg py-2 px-4 max-w-[80%]`}>
                        <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: item.response }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t">
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;