import React from 'react'

export default function Spinner() {
return (
  <div className="flex flex-col items-center justify-center min-h-[50vh] w-full space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        
        <div className="absolute w-3.5 h-3.5 bg-blue-600 rounded-full shadow-md shadow-blue-500/50"></div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-base font-bold text-gray-700 tracking-wide">Loading Posts</p>
        <p className="text-xs text-gray-400 animate-pulse">Fetching the latest feed for you...</p>
      </div>
    </div>
  );
}
