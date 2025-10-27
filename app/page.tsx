'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Test entry data structure
interface TestEntry {
  id: string;
  earned: number;
  total: number;
  percentage: number;
  letterGrade: string;
  message: string;
  date: string;
}

export default function Home() {
  // State
  const [earned, setEarned] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentGrade, setCurrentGrade] = useState<TestEntry | null>(null);
  const [history, setHistory] = useState<TestEntry[]>([]);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<'green' | 'blue'>('green');
  const [showExplosion, setShowExplosion] = useState(false);
  
  // Navigation
  const router = useRouter();
  
  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('testHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Get letter grade from percentage
  function getLetterGrade(percentage: number): string {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  }

  // Get motivational message based on letter grade
  function getMessage(letterGrade: string): string {
    if (letterGrade === 'A+') return 'Great job! 🎉';
    if (letterGrade.startsWith('A') || letterGrade.startsWith('B')) return 'Stellar! ⭐';
    if (letterGrade.startsWith('C')) return 'Try a little harder next time 💪';
    return 'Make sure you are studying 📚';
  }

  // Calculate grade and create entry
  function calculateGrade(earned: number, total: number): TestEntry {
    const percentage = parseFloat(((earned / total) * 100).toFixed(2));
    
    return {
      id: Date.now().toString() + Math.random(),
      earned,
      total,
      percentage,
      letterGrade: getLetterGrade(percentage),
      message: getMessage(getLetterGrade(percentage)),
      date: new Date().toLocaleString()
    };
  }

  // Handle calculate button click
  function handleCalculate() {
    setError('');
    
    if (earned > total) {
      setError('Points earned cannot be greater than total points');
      setCurrentGrade(null);
      return;
    }
    
    if (total === 0) {
      setError('Total points cannot be zero');
      setCurrentGrade(null);
      return;
    }
    
    if (earned < 0 || total < 0) {
      setError('Values cannot be negative');
      setCurrentGrade(null);
      return;
    }
    
    // If validation passes, calculate the grade
    const grade = calculateGrade(earned, total);
    
    // Set the current grade (this displays it on the screen)
    setCurrentGrade(grade);
    
    // Add to history (spread operator ... creates a new array with old items + new item)
    // We add new item first so it appears at the top of the history list
    const newHistory = [grade, ...history];
    setHistory(newHistory);
    
    // Save to localStorage so it persists after page refresh
    localStorage.setItem('testHistory', JSON.stringify(newHistory));

    // Check if grade is 50% or lower to show explosion modal
    if (grade.percentage <= 50) {
      setShowExplosion(true); // Show the explosion modal
    }

    if (grade.percentage === 100) {
      router.push("/celebration");
    }
    
    // Check if grade is 100% to navigate to celebration page
    // BUG #6: Missing check - what should happen at 100%?
    // Look around line ~160-165
    // Hint: Should navigate to celebration page when percentage is 100
  }

  // Function to clear all history
  function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]); // Reset history to empty array
      localStorage.removeItem('testHistory'); // Remove from localStorage too
    }
  }

  // Function to delete a single entry from history
  function deleteEntry(id: string) {
    // Filter out the entry with the matching ID
    // filter() keeps only items where the condition is true
    const newHistory = history.filter(entry => entry.id !== id);
    setHistory(newHistory); // Update state
    localStorage.setItem('testHistory', JSON.stringify(newHistory)); // Update localStorage
  }

  // Function to clear the input fields
  function clearInputs() {
    setEarned(0); // Reset earned points to 0
    setTotal(0); // Reset total points to 0
    setCurrentGrade(null); // Clear the displayed result
    setError(''); // Clear any error messages
  }

  // Function to toggle between green and blue hacker themes
  function toggleTheme() {
    // Toggle between 'green' and 'blue'
    // If current theme is 'green', switch to 'blue', otherwise switch to 'green'
    setTheme(theme === 'green' ? 'blue' : 'green');
  }

  // Helper function to get theme colors
  // Returns different color classes based on the current theme
  function getThemeColors() {
    if (theme === 'blue') {
      return {
        accent: 'text-blue-400', // Main accent color (blue)
        accentDark: 'text-blue-500', // Darker blue
        accentLight: 'text-blue-600', // Lighter blue
        bgAccent: 'bg-blue-600', // Background for buttons
        borderAccent: 'border-blue-500', // Border color
        shadowAccent: 'shadow-blue-500/20', // Shadow color
      };
    }
    // Default green theme
    return {
      accent: 'text-green-400',
      accentDark: 'text-green-500',
      accentLight: 'text-green-600',
      bgAccent: 'bg-green-600',
      borderAccent: 'border-green-500',
      shadowAccent: 'shadow-green-500/20',
    };
  }

  // Get the current theme colors
  const colors = getThemeColors();

  // Return the JSX (HTML-like syntax) that renders the UI
  return (
    <div className="min-h-screen bg-black p-8">
      {/* Outer container with max width and centered */}
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div> {/* Empty spacer for centering */}
            <div className="flex-1 text-center">
              <h1 className={`text-4xl font-bold mb-2 font-mono ${colors.accent}`}>
                Test Grade Calculator
              </h1>
              <p className={colors.accentDark}>
                Enter your test scores to calculate your grade
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-gray-800 text-gray-100 rounded-md border-2 border-gray-700 hover:bg-gray-700 font-mono text-sm"
              >
                {theme === 'green' ? 'Switch to Blue' : 'Switch to Green'}
              </button>
            </div>
          </div>
        </div>

        {/* Calculator Card */}
        <div className={`bg-gray-900 rounded-lg shadow-lg border p-6 mb-8 ${colors.borderAccent} ${colors.shadowAccent}`}>
          
          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Points Earned Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 font-mono ${colors.accent}`}>
                Points Earned
              </label>
              <input
                type="number"
                value={earned || ''} // Show empty string if 0, otherwise the value
                onChange={(e) => setEarned(parseFloat(e.target.value) || 0)}
                // onChange fires whenever the user types in the input
                // parseFloat converts string to number, || 0 handles empty input
                className={`w-full px-4 py-2 bg-black border-2 rounded-md focus:outline-none focus:ring-2 font-mono ${colors.borderAccent} ${colors.accent}`}
                placeholder="10"
                style={{ color: theme === 'green' ? '#4ade80' : '#60a5fa' }} // Dynamic color: green-400 or blue-400
              />
            </div>
            
            {/* Total Points Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 font-mono ${colors.accent}`}>
                Total Points
              </label>
              <input
                type="number"
                value={total || ''}
                onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 bg-black border-2 rounded-md focus:outline-none focus:ring-2 font-mono ${colors.borderAccent} ${colors.accent}`}
                placeholder="15"
                style={{ color: theme === 'green' ? '#4ade80' : '#60a5fa' }} // Dynamic color: green-400 or blue-400
              />
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-600 text-red-400 rounded-md font-mono">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              // onClick calls our function when button is clicked
              className={`text-black py-2 px-4 rounded-md transition-colors font-bold font-mono border-2 ${colors.bgAccent} ${colors.borderAccent}`}
            >
              Calculate Grade
            </button>
            
            {/* Clear Button - BUG IS HERE! 👾 */}
            {/* 
              Can you spot the bug? The Calculate button uses theme colors correctly above,
              but this Clear button is hardcoded to green colors instead of using the 'colors' variable.
              
              Hint: Look at lines around 300-310 (where the buttons are)
              The bug: It says 'text-green-400' instead of using colors.accent
            */}
            <button
              onClick={clearInputs}
              // onClick calls clearInputs to reset the form
              className={`bg-gray-800 py-2 px-4 rounded-md hover:bg-gray-700 transition-colors font-bold font-mono border-2 ${colors.accent} ${colors.borderAccent}`}
            >
              Clear
            </button>
          </div>

          {/* Current Result Display */}
          {currentGrade && (
            <div className={`mt-6 p-4 bg-black rounded-md border-2 shadow-lg p-6 ${colors.borderAccent} ${colors.shadowAccent}`}>
              <div className="text-center">
                {/* Score Display */}
                <div className={`text-2xl font-bold mb-2 font-mono ${colors.accent}`}>
                  {currentGrade.earned} / {currentGrade.total}
                </div>
                
                {/* Percentage Display */}
                <div className={`text-4xl font-bold mb-2 font-mono ${colors.accentDark}`}>
                  {currentGrade.percentage}%
                </div>
                
                {/* Letter Grade Display */}
                <div className={`text-xl font-semibold mb-2 font-mono ${colors.accent}`}>
                  Grade: {currentGrade.letterGrade}
                </div>
                
                {/* Message Display */}
                <div className={`text-lg font-mono ${colors.accentDark}`}>
                  {currentGrade.message}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className={`bg-gray-900 rounded-lg shadow-lg border p-6 ${colors.borderAccent} ${colors.shadowAccent}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold font-mono ${colors.accent}`}>Score History</h2>
              <button
                onClick={clearHistory}
                className="text-sm text-red-500 hover:text-red-400 font-mono"
              >
                Clear All
              </button>
            </div>
            
            {/* History List */}
            <div className="space-y-2">
              {history.map((entry) => (
                // map() loops through each entry and creates a div for it
                <div
                  key={entry.id}
                  // key helps React keep track of each item efficiently
                  className={`flex justify-between items-center p-3 bg-black rounded-md border hover:border-opacity-70 ${colors.borderAccent}`}
                >
                  <div className="font-mono">
                    <span className={`font-semibold ${colors.accent}`}>
                      {entry.earned}/{entry.total}
                    </span>
                    {' '}
                    <span className={`font-semibold ${colors.accentDark}`}>
                      {entry.percentage}%
                    </span>
                    {' '}
                    <span className={colors.accent}>
                      {entry.letterGrade}
                    </span>
                    {' - '}
                    <span className={`text-sm ${colors.accentLight}`}>
                      {entry.date}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    // () => creates an inline function that calls deleteEntry with this entry's ID
                    className="text-red-500 hover:text-red-400 text-sm font-mono"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explosion Modal - BUGS ARE HERE! 🐛🐛 */}
        {/* 
          BUG #2 and #3 ARE IN THIS MODAL! 
          Look at lines ~400-435
          
          BUG #2: The modal shows the text "Your grade blew up!" but it's hardcoded!
            It should show the actual grade percentage. Where do we get that from?
          
          BUG #3: The button text is "Close" but it should match the theme!
            Blue theme should say something blue-themed, green should say green-themed
        */}
        {showExplosion && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="text-center">
              {/* Explosion Visual */}
              <div className="text-9xl font-bold mb-4 animate-pulse">
                💥
              </div>
              
              {/* Message */}
              <h2 className={`text-5xl font-bold mb-4 font-mono ${colors.accent}`}>
                EXPLOSION!
              </h2>
              <p className={`text-2xl mb-6 font-mono ${colors.accentDark}`}>
                Your grade blew up! You got {currentGrade?.percentage}%
              </p>
              <p className={`text-xl mb-6 font-mono ${colors.accentLight}`}>
                You got {currentGrade?.percentage}% - That's below 50%!
              </p>
              
              {/* Close Button - BUG #3 FIXED! Now it's dynamic! */}
              <button
                onClick={() => setShowExplosion(false)}
                className={`px-8 py-4 rounded-md font-bold font-mono border-2 ${colors.bgAccent} ${colors.borderAccent}`}
              >
                {theme === 'green' ? 'Deactivate' : 'Shut Down'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}