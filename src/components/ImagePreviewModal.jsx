import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ImagePreviewModal = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-yellow-500 transition-colors"
        >
          <FaTimes size={24} />
        </button>
        <img 
          src={image} 
          alt="Preview" 
          className="w-full h-auto rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;