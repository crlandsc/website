#!/usr/bin/env python3
"""
iOS Video Background Generator
Generates videos with solid backgrounds for iOS compatibility
by replacing transparent areas with specified colors.

Requirements:
- FFmpeg installed and in PATH
- Python 3.6+

Usage:
    python3 generate-ios-videos.py
"""

import os
import subprocess
import sys
from pathlib import Path

# Video processing configuration
VIDEOS_CONFIG = {
    # Source video -> [(output_name, background_color, description)]
    "06 - Circle - Transparent (Sun).webm": [
        ("06 - Circle - Blue-BG.webm", "#4A90E2", "Introduction section (blue)"),
        ("06 - Circle - White-BG.webm", "#FFFFFF", "Externalized section (white)"),
        ("06 - Circle - Gray-BG.webm", "#F0F2F5", "Main site education card (gray)")
    ],
    "07 - Circle Elevation - Transparent (Sun).webm": [
        ("07 - Circle Elevation - Gray-BG.webm", "#F0F2F5", "Binaural section (gray)")
    ],
    "08 - Line - Transparent (Sun).webm": [
        ("08 - Line - White-BG.webm", "#FFFFFF", "Stereo section (white)")
    ]
}

# Directory paths
INPUT_DIR = Path("assets/binaural-externalization")
OUTPUT_DIR = Path("assets/binaural-externalization")

def check_ffmpeg():
    """Check if FFmpeg and FFprobe are installed and accessible"""
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        print("✓ FFmpeg found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ FFmpeg not found. Please install FFmpeg and add it to your PATH.")
        print("   Download: https://ffmpeg.org/download.html")
        return False
    
    try:
        subprocess.run(["ffprobe", "-version"], capture_output=True, check=True)
        print("✓ FFprobe found")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ FFprobe not found. Please install FFmpeg (includes FFprobe) and add it to your PATH.")
        print("   Download: https://ffmpeg.org/download.html")
        return False

def hex_to_rgb(hex_color):
    """Convert hex color to RGB values"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def get_video_info(input_path):
    """Get comprehensive video information"""
    cmd = [
        "ffprobe", 
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        str(input_path)
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        import json
        info = json.loads(result.stdout)
        
        # Find video stream
        for stream in info['streams']:
            if stream['codec_type'] == 'video':
                width = stream['width']
                height = stream['height']
                
                # Get duration from stream or format
                duration = None
                if 'duration' in stream:
                    duration = float(stream['duration'])
                elif 'duration' in info['format']:
                    duration = float(info['format']['duration'])
                
                # Get frame rate
                fps = None
                if 'r_frame_rate' in stream:
                    fps_str = stream['r_frame_rate']
                    if '/' in fps_str and fps_str != '0/0':
                        num, den = fps_str.split('/')
                        if int(den) != 0:
                            fps = float(num) / float(den)
                
                return {
                    'width': width,
                    'height': height, 
                    'duration': duration,
                    'fps': fps,
                    'has_alpha': stream.get('pix_fmt', '').endswith('a')
                }
        
        return None
    except Exception as e:
        print(f"❌ Error parsing video info: {e}")
        return None

def generate_video_with_background(input_path, output_path, bg_color, description):
    """Generate a video with solid background using FFmpeg"""
    
    if not input_path.exists():
        print(f"❌ Input video not found: {input_path}")
        return False
    
    # Get video properties
    video_info = get_video_info(input_path)
    if not video_info:
        print(f"❌ Could not get video information for {input_path}")
        return False
    
    width = video_info['width']
    height = video_info['height']
    duration = video_info['duration'] or 10.0  # Fallback to 10s if unknown
    fps = video_info['fps'] or 25.0  # Fallback to 25fps if unknown
    has_alpha = video_info['has_alpha']
    
    # Convert hex color to RGB
    r, g, b = hex_to_rgb(bg_color)
    
    print(f"🎬 Generating: {output_path.name} ({description})")
    print(f"   Background: {bg_color} (RGB: {r},{g},{b})")
    print(f"   Properties: {width}x{height}, {duration:.1f}s, {fps:.1f}fps, Alpha: {has_alpha}")
    
    # Method 1: Simple and reliable - create background, then overlay transparent video
    cmd_simple = [
        "ffmpeg",
        "-f", "lavfi", "-i", f"color=c={bg_color}:size={width}x{height}:duration={duration}:rate={fps}",
        "-i", str(input_path),
        "-filter_complex", "[0:v][1:v]overlay",
        "-c:v", "libvpx-vp9",
        "-crf", "30",
        "-b:v", "0",
        "-pix_fmt", "yuv420p",
        "-an",
        "-shortest",
        "-y",
        str(output_path)
    ]
    
    try:
        result = subprocess.run(cmd_simple, capture_output=True, text=True, check=True)
        print(f"✓ Generated with simple overlay: {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Simple overlay failed, trying alternative method...")
        print(f"   Error: {e.stderr[-300:]}")
        
        # Method 2: Force alpha channel handling
        cmd_alpha = [
            "ffmpeg",
            "-i", str(input_path),
            "-vf", f"format=rgba,colorkey=0x000000:0.1:0.1,format=yuva420p",
            "-f", "lavfi", "-i", f"color=c={bg_color}:size={width}x{height}:duration={duration}:rate={fps}",
            "-filter_complex", "[1:v][0:v]overlay",
            "-c:v", "libvpx-vp9",
            "-crf", "30",
            "-b:v", "0", 
            "-pix_fmt", "yuv420p",
            "-an",
            "-y",
            str(output_path)
        ]
        
        try:
            result = subprocess.run(cmd_alpha, capture_output=True, text=True, check=True)
            print(f"✓ Generated with alpha handling: {output_path}")
            return True
        except subprocess.CalledProcessError as e2:
            print(f"❌ Both methods failed for {output_path}")
            print(f"   Simple error: {e.stderr[-200:]}")
            print(f"   Alpha error: {e2.stderr[-200:]}")
            return False

def create_mov_version(webm_path):
    """Create MOV version from WebM for mobile compatibility"""
    mov_path = webm_path.with_suffix('.mov')
    
    cmd = [
        "ffmpeg",
        "-i", str(webm_path),
        "-c:v", "libx264",                              # H.264 codec for MOV
        "-preset", "medium",                            # Encoding speed/quality
        "-crf", "23",                                   # High quality
        "-pix_fmt", "yuv420p",                         # Compatibility
        "-an",                                          # Remove audio
        "-y",                                           # Overwrite
        str(mov_path)
    ]
    
    print(f"📱 Creating MOV version: {mov_path.name}")
    
    try:
        subprocess.run(cmd, capture_output=True, check=True)
        print(f"✓ MOV created: {mov_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create MOV version: {e}")
        return False

def main():
    """Main function to process all videos"""
    
    print("🎥 iOS Video Background Generator")
    print("=" * 50)
    
    # Check dependencies
    if not check_ffmpeg():
        sys.exit(1)
    
    # Verify input directory
    if not INPUT_DIR.exists():
        print(f"❌ Input directory not found: {INPUT_DIR}")
        print("   Please run this script from your website root directory.")
        sys.exit(1)
    
    # Create output directory if needed
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    total_videos = sum(len(outputs) for outputs in VIDEOS_CONFIG.values())
    processed = 0
    successful = 0
    
    print(f"\n📊 Processing {total_videos} video variants...")
    print("-" * 50)
    
    # Process each source video
    for source_name, outputs in VIDEOS_CONFIG.items():
        input_path = INPUT_DIR / source_name
        
        print(f"\n🎯 Source: {source_name}")
        
        # Generate each output variant
        for output_name, bg_color, description in outputs:
            output_path = OUTPUT_DIR / output_name
            
            processed += 1
            
            if generate_video_with_background(input_path, output_path, bg_color, description):
                successful += 1
                
                # Also create MOV version
                if output_path.suffix == '.webm':
                    create_mov_version(output_path)
    
    # Summary
    print("\n" + "=" * 50)
    print(f"🏁 Processing Complete!")
    print(f"   Processed: {processed}/{total_videos}")
    print(f"   Successful: {successful}/{total_videos}")
    
    if successful == total_videos:
        print("✅ All videos generated successfully!")
        print("\n📝 Next steps:")
        print("   1. Test the videos in your browser")
        print("   2. Deploy the new video files")
        print("   3. The JavaScript will automatically use them on iOS")
    else:
        print(f"⚠️  {total_videos - successful} videos failed to generate")
        print("   Check the error messages above")

if __name__ == "__main__":
    main() 