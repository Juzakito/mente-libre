import React, { useState } from 'react';

const getEmojiUrl = (emoji, keepSelector = true) => {
  if (!emoji) return '';
  let hex = Array.from(emoji).map(c => c.codePointAt(0).toString(16)).join('-');
  if (!keepSelector) {
    hex = hex.replace(/-fe0f/g, '');
  }
  return `https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/15.0.1/img/apple/64/${hex}.png`;
};

export default function AppleEmoji({ emoji, size = 24, style = {}, className = '' }) {
  const [attempt, setAttempt] = useState(0);

  if (!emoji) return null;

  // Fallback to native system emoji if CDN images fail
  if (attempt >= 2) {
    return (
      <span
        className={className}
        style={{
          fontSize: typeof size === 'number' ? `${size * 0.9}px` : size,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
          userSelect: 'none',
          ...style
        }}
        role="img"
        aria-label={emoji}
      >
        {emoji}
      </span>
    );
  }

  // Attempt 0: with selector (e.g. 1f399-fe0f.png)
  // Attempt 1: without selector (e.g. 1f399.png)
  const src = getEmojiUrl(emoji, attempt === 0);

  return (
    <img
      src={src}
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
      onError={() => {
        setAttempt(prev => prev + 1);
      }}
    />
  );
}
