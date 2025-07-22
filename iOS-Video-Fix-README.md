# iOS Transparent Video Fix

This system automatically generates iOS-compatible videos with solid backgrounds to fix the transparent video issue on iOS devices.

## Quick Start

1. **Install FFmpeg** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install ffmpeg
   
   # Or download from: https://ffmpeg.org/download.html
   ```

2. **Generate the videos**:
   ```bash
   python3 generate-ios-videos.py
   ```

3. **Deploy to your website** - The JavaScript will automatically detect iOS and use the new videos!

## What It Does

### The Python Script (`generate-ios-videos.py`)
- Detects your transparent video files
- Generates versions with solid color backgrounds for each section:
  - **Blue** (#4A90E2): Introduction sections
  - **White** (#FFFFFF): Stereo/Externalized sections  
  - **Gray** (#F0F2F5): Binaural sections and main site
- Creates both WebM and MOV versions for compatibility
- Preserves video quality and timing

### The JavaScript (`js/ios-video-fallback.js`)
- Automatically detects iOS devices (iPhone, iPad, iPod)
- Switches transparent videos to background versions when available
- Falls back to original videos if background versions don't exist
- Works on both main site and binaural demonstration page
- Provides console logging for debugging

## Generated Videos

After running the script, you'll have:

```
assets/binaural-externalization/
├── 06 - Circle - Blue-BG.webm/.mov    (Introduction)
├── 06 - Circle - White-BG.webm/.mov   (Externalized) 
├── 06 - Circle - Gray-BG.webm/.mov    (Main site)
├── 07 - Circle Elevation - Gray-BG.webm/.mov  (Binaural)
└── 08 - Line - White-BG.webm/.mov     (Stereo)
```

## How It Works

1. **Desktop/Android**: Uses original transparent videos (best quality)
2. **iOS**: Automatically switches to solid background versions
3. **Fallback**: If background videos don't exist, uses originals

## Customization

### Adding New Videos
Edit `VIDEOS_CONFIG` in `generate-ios-videos.py`:

```python
"your-video.webm": [
    ("your-video-bg.webm", "#HEXCOLOR", "Description")
]
```

### Changing Colors
Update the hex colors in the configuration to match your design:

```python
("output-name.webm", "#4A90E2", "Your section")
```

### Testing

On iOS devices, check the browser console to see:
```
iOS fallback: iOS device detected, checking for video replacements...
iOS fallback: original.webm → background-version.webm
```

## Troubleshooting

### FFmpeg Not Found
```bash
# Install FFmpeg first
brew install ffmpeg  # macOS
# or download from https://ffmpeg.org/download.html
```

### Videos Not Switching on iOS
1. Check browser console for error messages
2. Verify the background videos exist in the correct directory
3. Make sure `js/ios-video-fallback.js` is loaded on your pages

### Video Quality Issues
Adjust quality settings in `generate-ios-videos.py`:
```python
"-crf", "20",  # Lower = higher quality (18-28 recommended)
```

## File Structure

```
website/
├── generate-ios-videos.py          # Video generator script
├── js/ios-video-fallback.js        # iOS detection & switching
├── assets/binaural-externalization/
│   ├── *-Transparent*.webm        # Original transparent videos  
│   └── *-BG.webm                  # Generated background videos
├── index.html                      # Includes fallback script
└── binaural-externalization/
    └── index.html                  # Includes fallback script
```

## Performance

- **No impact** on non-iOS devices (original videos used)
- **Automatic switching** on iOS (no user interaction needed)  
- **Smart fallback** if background videos aren't available
- **Optimized file sizes** with VP9/H.264 encoding

The background videos are typically the same size or smaller than the original transparent versions due to the solid color backgrounds compressing better. 