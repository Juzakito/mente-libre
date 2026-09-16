import React from 'react';

const getEmojiUrl = (emoji) => {
  if (!emoji) return '';
  // Convert emoji to hex sequence
  let hex = Array.from(emoji).map(c => c.codePointAt(0).toString(16)).join('-');
  // Remove variation selector if present (apple datasource usually drops it)
  hex = hex.replace('-fe0f', '');
  return `https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/15.0.1/img/apple/64/${hex}.png`;
};

export default function AppleEmoji({ emoji, size = 24, style = {}, className = '' }) {
  if (!emoji) return null;
  
  return (
    <img
      src={getEmojiUrl(emoji)}
      alt={emoji}
      className={className}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
      draggable={false}
      onError={(e) => {
        // Fallback to native emoji if the image fails to load
        e.target.style.display = 'none';
        if (e.target.nextSibling) {
          e.target.nextSibling.style.display = 'inline-block';
        }
      }}
    />
  );
}
