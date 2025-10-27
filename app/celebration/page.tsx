'use client'; // Client component needs this directive

// This page shows when you get a 100% on your test!
export default function Celebration() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        {/* Celebration Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-green-400 font-mono mb-4">
            🎉 100% PERFECT! 🎉
          </h1>
          <p className="text-2xl text-green-500 font-mono">
            You absolutely crushed it!
          </p>
        </div>

        {/* Meme Image */}
        <div className="mb-8">
          <div className="bg-gray-900 p-8 rounded-lg border-2 border-green-500">
            <img 
              src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif" 
              alt="Victory celebration"
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Additional Celebration Elements */}
        <div className="text-4xl mb-6">
          <span className="animate-bounce inline-block">🌟</span>
          <span className="animate-bounce inline-block ml-4" style={{ animationDelay: '0.1s' }}>⭐</span>
          <span className="animate-bounce inline-block ml-4" style={{ animationDelay: '0.2s' }}>✨</span>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-4 bg-green-600 text-black rounded-md font-bold font-mono border-2 border-green-400 hover:bg-green-500 transition-colors"
        >
          Calculate Another Score
        </button>
      </div>
    </div>
  );
}

