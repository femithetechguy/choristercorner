/**
 * Manual Playlist Processor for GitHub Actions
 * Processes manually input playlist data without API requirements
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  csvPath: path.join(__dirname, '../csv/songs.csv'),
  jsonPath: path.join(__dirname, '../json/songs.json')
};

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
 * Process manual playlist data
 */
function processManualPlaylist(playlistText, existingSongs = []) {
  const lines = playlistText.split('\n').filter(line => line.trim());
  const newSongs = [];
  const existingUrls = new Set(existingSongs.map(song => song.url));
  let nextSerialNumber = existingSongs.length > 0 ? Math.max(...existingSongs.map(s => s.serial_number)) + 1 : 1;

  for (const line of lines) {
    // Try to parse line formats
    if (line.includes('youtube.com/watch') || line.includes('youtu.be/')) {
      const urlMatch = line.match(/(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/);
      
      if (urlMatch && !existingUrls.has(urlMatch[1])) {
        const url = urlMatch[1];
        
        // Try to extract title and channel from the line
        const parts = line.split(/[-|]/);
        
        let title = 'Unknown Title';
        let channel = 'Unknown Channel';
        let duration = 'Unknown';
        
        if (parts.length >= 3) {
          title = parts[0].replace(urlMatch[1], '').trim();
          channel = parts[1].trim();
          duration = parts[2].replace(urlMatch[1], '').trim();
        } else if (parts.length >= 2) {
          title = parts[0].replace(urlMatch[1], '').trim();
          channel = parts[1].replace(urlMatch[1], '').trim();
        }
        
        // Clean up extracted data
        if (!title || title === 'Unknown Title') {
          title = `Song ${nextSerialNumber}`;
        }
        
        newSongs.push({
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
        });
      }
    }
  }

  return [...existingSongs, ...newSongs];
}

/**
 * Generate CSV content from songs data
 */
function generateCSV(songs) {
  const headers = ['serial_number', 'title', 'channel', 'duration', 'url', 'lyrics'];
  const rows = songs.map(song => {
    const lyricsText = song.lyrics.join(' | ');
    return [
      song.serial_number,
      `"${song.title.replace(/"/g, '""')}"`,
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
 * Main function
 */
async function main() {
  try {
    const inputFile = process.argv[2];
    
    if (!inputFile) {
      console.error('Usage: node process-manual-playlist.js <input-file>');
      process.exit(1);
    }
    
    // Read input file
    const playlistData = await fs.readFile(inputFile, 'utf-8');
    
    if (!playlistData.trim()) {
      console.log('No playlist data provided');
      return;
    }
    
    console.log('🎵 Processing manual playlist data...');
    
    // Read existing songs
    const existingSongs = await readExistingSongs();
    console.log(`📚 Found ${existingSongs.length} existing songs`);
    
    // Process playlist
    const updatedSongs = processManualPlaylist(playlistData, existingSongs);
    const newSongsCount = updatedSongs.length - existingSongs.length;
    
    console.log(`➕ Adding ${newSongsCount} new songs`);
    
    if (newSongsCount === 0) {
      console.log('✨ No new songs to add');
      return;
    }
    
    // Update files
    const success = await updateSongsFiles(updatedSongs);
    
    if (success) {
      console.log('🎉 Playlist processing completed successfully!');
      console.log(`📊 Total songs: ${updatedSongs.length}`);
      console.log(`🆕 New songs added: ${newSongsCount}`);
    }
    
  } catch (error) {
    console.error('❌ Error processing playlist:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  processManualPlaylist,
  readExistingSongs,
  updateSongsFiles
};
