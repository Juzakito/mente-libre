import React from 'react';
import AppleEmoji from './AppleEmoji';

export const SHOP_AVATARS_LIST = [
  { id: 'owl', emoji: '🦉', name: 'Búho Base', cost: 0 },
  { id: 'cat', emoji: '🐱', name: 'Gatito Zen', cost: 50 },
  { id: 'dog', emoji: '🐶', name: 'Perrito Fiel', cost: 75 },
  { id: 'panda', emoji: '🐼', name: 'Panda Dormilón', cost: 100 },
  { id: 'fox', emoji: '🦊', name: 'Zorro Astuto', cost: 150 },
  { id: 'frog', emoji: '🐸', name: 'Ranita Chill', cost: 200 },
  { id: 'trex', emoji: '🦖', name: 'T-Rex Pro', cost: 250 },
  { id: 'alien', emoji: '👽', name: 'Alien Zen', cost: 300 },
  { id: 'unicorn', emoji: '🦄', name: 'Unicornio Mágico', cost: 400 },
  { id: 'robot', emoji: '🤖', name: 'Robot Coder', cost: 500 },
  { id: 'ghost', emoji: '👻', name: 'Fantasma Anónimo', cost: 600 },
  { id: 'otter', emoji: '🦦', name: 'Nutria Tranquila', cost: 700 },
];

const KEY_MAP = {
  flying_jay: '🦊',
  earth_angel: '🦄',
  ivory_bird: '🐱',
  anxious_soul: '👽',
  cosmic_buddy: '🤖',
  delta_clover: '🦉',
  owl: '🦉',
  buho: '🦉',
  búho: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  panda: '🐼',
  frog: '🐸',
  trex: '🦖',
  alien: '👽',
  unicorn: '🦄',
  robot: '🤖',
  ghost: '👻',
  otter: '🦦'
};

export default function TalkCampusAvatar({ id = '🦉', size = 44, style = {} }) {
  const avatarStr = String(id || '🦉').trim();
  
  // Resolve emoji from avatar shop map or direct emoji
  const emoji = KEY_MAP[avatarStr.toLowerCase()] || (avatarStr.length <= 4 ? avatarStr : '🦉');

  const badgeRadius = size < 32 ? '8px' : size < 40 ? '10px' : '12px';
  const emojiSize = Math.max(16, Math.round(size * 0.65));

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: badgeRadius,
        backgroundColor: 'rgba(12, 35, 40, 0.85)',
        border: '1px solid rgba(0, 210, 142, 0.35)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        ...style
      }}
    >
      <AppleEmoji emoji={emoji} size={emojiSize} />
    </div>
  );
}
