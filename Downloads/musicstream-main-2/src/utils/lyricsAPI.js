// Lyrics API service for fetching real lyrics
export class LyricsAPI {
  static async fetchLyrics(trackId, title, artist) {
    try {
      // Option 1: Use a real lyrics API (requires API key)
      // const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
      // const data = await response.json();
      // return this.parseLyricsWithTiming(data.lyrics);
      
      // Option 2: Mock API for development
      return this.getMockLyrics(trackId);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      return this.getDefaultLyrics();
    }
  }

  static getMockLyrics(trackId) {
    const mockData = {
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
      // Add more tracks as needed
    };
    
    return mockData[trackId] || this.getDefaultLyrics();
  }

  static parseLyricsWithTiming(lyricsText) {
    // Convert plain text lyrics to timed format
    const lines = lyricsText.split('\n').filter(line => line.trim());
    const avgLineDuration = 4; // 4 seconds per line
    
    return lines.map((line, index) => ({
      time: index * avgLineDuration,
      text: line.trim()
    }));
  }

  static getDefaultLyrics() {
    return [
      { time: 0, text: "♪ No lyrics available for this track ♪" },
      { time: 3, text: "Enjoy the music!" },
    ];
  }
}
