/**
 * Playlist Update Script for ChoristerCorner
 * Fetches YouTube playlist data and updates songs.csv and songs.json
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  csvPath: path.join(__dirname, '../csv/songs.csv'),
  jsonPath: path.join(__dirname, '../json/songs.json'),
  // You'll need to add your YouTube Data API key here
  youtubeApiKey: process.env.YOUTUBE_API_KEY || 'YOUR_API_KEY_HERE'
};

/**
 * Extract playlist ID from YouTube URL
 */
function extractPlaylistId(url) {
  const patterns = [
    /[?&]list=([^&\n?#]+)/,
    /youtube\.com\/playlist\?list=([^&\n?#]+)/,
    /youtube\.com\/watch\?.*list=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Fetch playlist data from YouTube API
 */
async function fetchPlaylistData(playlistId) {
  const apiKey = CONFIG.youtubeApiKey;
  
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('YouTube API key not configured. Please set YOUTUBE_API_KEY environment variable.');
  }
  
  try {
    // Fetch playlist info
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
    );
    
    if (!playlistResponse.ok) {
      throw new Error(`Failed to fetch playlist: ${playlistResponse.statusText}`);
    }
    
    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      throw new Error('Playlist not found or is private');
    }
    
    // Fetch playlist items
    let allVideos = [];
    let nextPageToken = '';
    
    do {
      const itemsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`
      );
      
      if (!itemsResponse.ok) {
        throw new Error(`Failed to fetch playlist items: ${itemsResponse.statusText}`);
      }
      
      const itemsData = await itemsResponse.json();
      allVideos.push(...itemsData.items);
      nextPageToken = itemsData.nextPageToken || '';
      
    } while (nextPageToken);
    
    // Get video details (duration, etc.)
    const videoIds = allVideos.map(item => item.contentDetails.videoId).join(',');
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`
    );
    
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video details: ${videoResponse.statusText}`);
    }
    
    const videoData = await videoResponse.json();
    
    return {
      playlist: playlistData.items[0],
      videos: videoData.items
    };
    
  } catch (error) {
    console.error('Error fetching playlist data:', error);
    throw error;
  }
}

/**
 * Convert ISO 8601 duration to readable format
 */
function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'Unknown';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Read existing songs data
 */
async function readExistingSongs() {
  try {
    const jsonData = await fs.readFile(CONFIG.jsonPath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.log('No existing songs.json found, starting fresh');
    return [];
  }
}

/**
 * Convert playlist data to songs format
 */
function convertPlaylistToSongs(playlistData, existingSongs = []) {
  const { playlist, videos } = playlistData;
  const existingUrls = new Set(existingSongs.map(song => song.url));
  let nextSerialNumber = existingSongs.length > 0 ? Math.max(...existingSongs.map(s => s.serial_number)) + 1 : 1;
  
  const newSongs = videos
    .filter(video => {
      const url = `https://www.youtube.com/watch?v=${video.id}`;
      return !existingUrls.has(url); // Only add new songs
    })
    .map(video => {
      const title = video.snippet.title;
      const channel = video.snippet.channelTitle;
      const duration = formatDuration(video.contentDetails.duration);
      const url = `https://www.youtube.com/watch?v=${video.id}`;
      
      return {
        serial_number: nextSerialNumber++,
        title: title,
        channel: channel,
        duration: duration,
        url: url,
        lyrics: [
          "Verse 1:",
          "Please add lyrics here...",
          "",
          "Chorus:",
          "Please add lyrics here...",
          "",
          "Verse 2:",
          "Please add lyrics here..."
        ]
      };
    });
  
  return [...existingSongs, ...newSongs];
}

/**
 * Generate CSV content from songs data
 */
function generateCSV(songs) {
  const headers = ['serial_number', 'title', 'channel', 'duration', 'url', 'lyrics'];
  const rows = songs.map(song => {
    const lyricsText = song.lyrics.join(' | '); // Join lyrics with separator
    return [
      song.serial_number,
      `"${song.title.replace(/"/g, '""')}"`, // Escape quotes
      `"${song.channel.replace(/"/g, '""')}"`,
      song.duration,
      song.url,
      `"${lyricsText.replace(/"/g, '""')}"`
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Update songs files
 */
async function updateSongsFiles(songs) {
  try {
    // Update JSON file
    await fs.writeFile(CONFIG.jsonPath, JSON.stringify(songs, null, 2));
    console.log(`✅ Updated ${CONFIG.jsonPath}`);
    
    // Update CSV file
    const csvContent = generateCSV(songs);
    await fs.writeFile(CONFIG.csvPath, csvContent);
    console.log(`✅ Updated ${CONFIG.csvPath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error updating files:', error);
    return false;
  }
}

/**
 * Main function to update playlist
 */
async function updatePlaylist(playlistUrl) {
  try {
    console.log('🎵 ChoristerCorner Playlist Updater');
    console.log('=====================================');
    
    // Extract playlist ID
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      throw new Error('Invalid YouTube playlist URL');
    }
    
    console.log(`📋 Playlist ID: ${playlistId}`);
    
    // Fetch playlist data
    console.log('🔍 Fetching playlist data...');
    const playlistData = await fetchPlaylistData(playlistId);
    
    console.log(`📺 Found ${playlistData.videos.length} videos in playlist: "${playlistData.playlist.snippet.title}"`);
    
    // Read existing songs
    console.log('📖 Reading existing songs...');
    const existingSongs = await readExistingSongs();
    console.log(`📚 Found ${existingSongs.length} existing songs`);
    
    // Convert and merge
    console.log('🔄 Processing playlist videos...');
    const updatedSongs = convertPlaylistToSongs(playlistData, existingSongs);
    const newSongsCount = updatedSongs.length - existingSongs.length;
    
    console.log(`➕ Adding ${newSongsCount} new songs`);
    
    if (newSongsCount === 0) {
      console.log('✨ No new songs to add - playlist is already up to date!');
      return;
    }
    
    // Update files
    console.log('💾 Updating songs files...');
    const success = await updateSongsFiles(updatedSongs);
    
    if (success) {
      console.log('=====================================');
      console.log('🎉 Playlist update completed successfully!');
      console.log(`📊 Total songs: ${updatedSongs.length}`);
      console.log(`🆕 New songs added: ${newSongsCount}`);
      console.log('=====================================');
      console.log('💡 Note: Please review and update lyrics for new songs');
    }
    
  } catch (error) {
    console.error('❌ Error updating playlist:', error.message);
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  const playlistUrl = process.argv[2];
  
  if (!playlistUrl) {
    console.log('Usage: node update-playlist.js <YouTube Playlist URL>');
    console.log('Example: node update-playlist.js "https://www.youtube.com/playlist?list=PLrAXtmRdnEQy..."');
    process.exit(1);
  }
  
  updatePlaylist(playlistUrl);
}

module.exports = {
  updatePlaylist,
  extractPlaylistId,
  fetchPlaylistData,
  convertPlaylistToSongs
};
