import React from 'react';

function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1>content</h1>
      </div>
      <div className="overlay" onClick={onClose}></div>
    </div>
  );
}

export default Popup;