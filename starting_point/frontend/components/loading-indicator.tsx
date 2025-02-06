import React from 'react'

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 10l3 3m0 0l3-3m-3 3V7"
            />
          </svg>
        </div>
      </div>
      <span className="text-blue-500 text-lg font-medium">
        Planning your premium travel experience...
      </span>
    </div>
  )
}

export default LoadingIndicator
