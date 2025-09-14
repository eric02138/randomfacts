import React, { useState, useEffect } from 'react';

const RandomFactsApp = () => {
  const [facts, setFacts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomFact = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
      if (!response.ok) {
        throw new Error('Failed to fetch fact');
      }
      const data = await response.json();
      
      // Add new fact to the end of the array
      const newFacts = [...facts, data];
      setFacts(newFacts);
      setCurrentIndex(newFacts.length - 1);
    } catch (err) {
      setError('Failed to fetch a new fact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < facts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // If we're at the end, fetch a new fact
      fetchRandomFact();
    }
  };

  const goToFact = (index) => {
    setCurrentIndex(index);
  };

  // Fetch initial fact on component mount
  useEffect(() => {
    fetchRandomFact();
  }, []);

  const currentFact = facts[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
          Random Facts Explorer
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fact display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Current Fact
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              ) : currentFact ? (
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentFact.text}
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Source: {currentFact.source_url || 'Unknown'}</p>
                    <p>Fact #{currentIndex + 1} of {facts.length}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No fact available</p>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={goToPrevious}
                disabled={currentIndex <= 0 || loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={goToNext}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {currentIndex < facts.length - 1 ? 'Next' : 'Get New Fact'}
              </button>
            </div>
          </div>

          {/* History panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                History ({facts.length} facts)
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {facts.map((fact, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentIndex
                        ? 'bg-indigo-100 border border-indigo-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => goToFact(index)}
                  >
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {fact.text.length > 80 
                        ? fact.text.substring(0, 80) + '...' 
                        : fact.text
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Fact #{index + 1}
                    </p>
                  </div>
                ))}
                
                {facts.length === 0 && (
                  <p className="text-gray-500 text-sm">No facts yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomFactsApp;