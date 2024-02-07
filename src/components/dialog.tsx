import React, { ReactNode } from 'react';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Dialog({ isOpen, onClose, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 backdrop-blur-md">
      <div className="bg-white p-8 rounded shadow-md max-w-m fixed">
        <button className="absolute top-0 right-0 p-2" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 hover:text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};