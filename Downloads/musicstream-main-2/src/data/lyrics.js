// Centralized lyrics data
export const LYRICS_DATA = {
  1: [
    { time: 0, text: "Ishq wala love, ishq wala love" },
    { time: 3, text: "Ishq wala love, ishq wala love" },
    { time: 6, text: "Dil mein yeh ho kya, ho kya" },
    { time: 9, text: "Ishq wala love, ishq wala love" },
    { time: 12, text: "Jab se dekha tumhe, jab se dekha tumhe" },
    { time: 15, text: "Dil ne yeh kaha, dil ne yeh kaha" },
    { time: 18, text: "Tumse ho gaya hai, tumse ho gaya hai" },
    { time: 21, text: "Ishq wala love" },
  ],
  2: [
    { time: 0, text: "Manwa laage, manwa laage" },
    { time: 4, text: "Saansein laage, saansein laage" },
    { time: 8, text: "Dhadkan laage, dhadkan laage" },
    { time: 12, text: "Jab se tumhe jaana, jab se tumhe jaana" },
    { time: 16, text: "Manwa laage, manwa laage" },
    { time: 20, text: "Dil yeh jaane kya, jaane kya" },
    { time: 24, text: "Ho mann laage, mann laage" },
    { time: 28, text: "Jab se tumhein dekha, jab se tumhein dekha" },
  ],
  // Add more songs here as needed
};

// Helper function to get lyrics by track ID
export const getLyricsByTrackId = (trackId) => {
  return LYRICS_DATA[trackId] || [
    { time: 0, text: "♪ No lyrics available for this track ♪" },
    { time: 3, text: "Enjoy the music!" },
  ];
};
