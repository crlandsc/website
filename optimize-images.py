#!/usr/bin/env python3
"""
Image Optimization Script for Web Performance
Optimizes carousel images and profile photo for modern web viewing.

Features:
- Resizes images to appropriate web dimensions
- Creates WebP versions with JPEG fallbacks
- Maintains quality while reducing file sizes
- Updates HTML references automatically

Requirements:
- Python 3.6+
- Pillow (pip install Pillow)
- (Optional) cwebp for WebP conversion

Usage:
    python3 optimize-images.py
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageOps
import shutil
import re

# Configuration
CAROUSEL_INPUT_DIR = Path("assets/photos/carousel")
CAROUSEL_OUTPUT_DIR = Path("assets/photos/carousel_optimized")
PROFILE_INPUT = Path("assets/profile.png")
PROFILE_OUTPUT_DIR = Path("assets")
PROFILE_OUTPUT_NAME = "profile_optimized"

# Image optimization settings - Higher quality for better visual fidelity
CAROUSEL_SETTINGS = {
    'max_width': 1200,      # Increased from 800 for better detail
    'max_height': 900,      # Increased from 600 for better detail
    'jpeg_quality': 90,     # Increased from 85 for better quality
    'webp_quality': 90,     # Increased from 85 for better quality
    'png_optimize': True
}

PROFILE_SETTINGS = {
    'max_width': 1920,      # No size limit - keep original resolution
    'max_height': 1920,     # No size limit - keep original resolution  
    'jpeg_quality': 95,     # High quality for main profile image
    'webp_quality': 95,     # High quality WebP
    'png_optimize': True
}

def setup_directories():
    """Create output directories if they don't exist"""
    CAROUSEL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"✓ Output directory ready: {CAROUSEL_OUTPUT_DIR}")

def get_optimal_size(image, max_width, max_height):
    """Calculate optimal size maintaining aspect ratio"""
    width, height = image.size
    ratio = min(max_width / width, max_height / height)
    
    if ratio >= 1:
        return width, height  # Don't upscale
    
    new_width = int(width * ratio)
    new_height = int(height * ratio)
    return new_width, new_height

def optimize_image(input_path, output_path, max_width, max_height, size_info, jpeg_quality=90, webp_quality=90):
    """Optimize a single image with specified dimensions and quality settings"""
    try:
        with Image.open(input_path) as img:
            # Auto-rotate based on EXIF data if present
            img = ImageOps.exif_transpose(img)
            original_size = input_path.stat().st_size
            
            # Calculate new size maintaining aspect ratio
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            
            # Convert to RGB if necessary for JPEG
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background for transparency
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            
            # Ensure RGB mode for JPEG
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save optimized JPEG
            jpeg_path = output_path.with_suffix('.jpg')
            img.save(jpeg_path, 'JPEG', quality=jpeg_quality, optimize=True)
            
            # Get file sizes
            jpeg_size = jpeg_path.stat().st_size
            jpeg_reduction = (1 - jpeg_size / original_size) * 100
            
            print(f"  JPEG: {input_path.name} {size_info} → {jpeg_size//1024}KB ({jpeg_reduction:.1f}% reduction)")
            
            # Create WebP version
            try:
                webp_path = output_path.with_suffix('.webp')
                img.save(webp_path, 'WEBP', quality=webp_quality, optimize=True)
                webp_size = webp_path.stat().st_size
                webp_reduction = (1 - webp_size / original_size) * 100
                print(f"  WebP: {input_path.name} {size_info} → {webp_size//1024}KB ({webp_reduction:.1f}% reduction)")
            except Exception as e:
                print(f"  ⚠️ WebP creation failed for {input_path.name}: {e}")
                webp_path = None
                
            return jpeg_path, webp_path
            
    except Exception as e:
        print(f"  ❌ Error optimizing {input_path.name}: {e}")
        return None, None

def optimize_carousel_images():
    """Optimize all carousel images"""
    print("\n📸 Optimizing Carousel Images")
    print("=" * 50)
    
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
    image_files = [f for f in CAROUSEL_INPUT_DIR.iterdir() 
                   if f.is_file() and f.suffix in image_extensions]
    
    if not image_files:
        print("❌ No image files found in carousel directory")
        return {}
    
    optimized_files = {}
    total_original = 0
    total_optimized = 0
    
    for img_path in sorted(image_files):
        output_path = CAROUSEL_OUTPUT_DIR / img_path.stem
        
        print(f"🖼️  Optimizing: {img_path.name} ({img_path.stat().st_size // 1024}KB)")
        
        jpeg_path, webp_path = optimize_image(
            img_path, output_path, 
            CAROUSEL_SETTINGS['max_width'], CAROUSEL_SETTINGS['max_height'],
            f"({img_path.stat().st_size // 1024}KB)",
            jpeg_quality=CAROUSEL_SETTINGS['jpeg_quality'],
            webp_quality=CAROUSEL_SETTINGS['webp_quality']
        )
        
        if jpeg_path:
            optimized_files[img_path.name] = {
                'original': str(img_path),
                'jpeg': str(jpeg_path.relative_to(Path('.'))),
                'webp': str(webp_path.relative_to(Path('.'))) if webp_path else None
            }
            
            total_original += img_path.stat().st_size
            total_optimized += jpeg_path.stat().st_size
    
    total_reduction = (1 - total_optimized / total_original) * 100 if total_original > 0 else 0
    print(f"\n📊 Carousel Summary: {total_original//1024}KB → {total_optimized//1024}KB ({total_reduction:.1f}% reduction)")
    
    return optimized_files

def optimize_profile_image():
    """Optimize the profile image"""
    print("\n👤 Optimizing Profile Image")
    print("=" * 50)
    
    if not PROFILE_INPUT.exists():
        print(f"❌ Profile image not found: {PROFILE_INPUT}")
        return None
    
    print(f"\n📷 Optimizing profile image: {PROFILE_INPUT.name} ({PROFILE_INPUT.stat().st_size // (1024*1024)}MB)")
    
    output_path = PROFILE_OUTPUT_DIR / PROFILE_OUTPUT_NAME
    
    jpeg_path, webp_path = optimize_image(
        PROFILE_INPUT, output_path,
        PROFILE_SETTINGS['max_width'], PROFILE_SETTINGS['max_height'],
        f"({PROFILE_INPUT.stat().st_size // (1024*1024)}MB)",
        jpeg_quality=PROFILE_SETTINGS['jpeg_quality'],
        webp_quality=PROFILE_SETTINGS['webp_quality']
    )
    
    if jpeg_path:
        return {
            'original': str(PROFILE_INPUT),
            'jpeg': str(jpeg_path.relative_to(Path('.'))),
            'webp': str(webp_path.relative_to(Path('.'))) if webp_path else None
        }
    
    return None

def update_html_references(carousel_mapping, profile_mapping):
    """Update HTML files to use optimized images"""
    print("\n🔄 Updating HTML References")
    print("=" * 50)
    
    html_files = ['index.html', 'binaural-externalization/index.html']
    
    for html_file in html_files:
        if not Path(html_file).exists():
            continue
            
        print(f"📝 Updating {html_file}")
        
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = 0
        
        # Update carousel image references
        for original_name, mapping in carousel_mapping.items():
            old_path = mapping['original']
            new_path = mapping['jpeg']
            
            # Replace src attributes
            old_pattern = f'src="{old_path}"'
            new_pattern = f'src="{new_path}"'
            
            if old_pattern in content:
                content = content.replace(old_pattern, new_pattern)
                changes_made += 1
                print(f"   ✓ Updated: {original_name} → {Path(new_path).name}")
        
        # Update profile image reference
        if profile_mapping:
            old_profile = profile_mapping['original']
            new_profile = profile_mapping['jpeg']
            
            old_pattern = f'src="{old_profile}"'
            new_pattern = f'src="{new_profile}"'
            
            if old_pattern in content:
                content = content.replace(old_pattern, new_pattern)
                changes_made += 1
                print(f"   ✓ Updated profile: {Path(old_profile).name} → {Path(new_profile).name}")
        
        # Save updated file
        if changes_made > 0:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"   📁 Saved {html_file} with {changes_made} updates")
        else:
            print(f"   ℹ️  No references found in {html_file}")

def main():
    """Main optimization process"""
    print("🚀 Image Optimization for Web Performance")
    print("=" * 60)
    
    # Check dependencies
    try:
        from PIL import Image
        print("✓ Pillow library found")
    except ImportError:
        print("❌ Pillow library not found. Install with: pip install Pillow")
        sys.exit(1)
    
    # Setup
    setup_directories()
    
    # Optimize images
    carousel_mapping = optimize_carousel_images()
    profile_mapping = optimize_profile_image()
    
    # Update HTML references
    if carousel_mapping or profile_mapping:
        update_html_references(carousel_mapping, profile_mapping)
    
    # Final summary
    print("\n🎉 Optimization Complete!")
    print("=" * 60)
    print("📁 Optimized images saved to:")
    print(f"   • Carousel: {CAROUSEL_OUTPUT_DIR}")
    if profile_mapping:
        print(f"   • Profile: {profile_mapping['jpeg']}")
    print("\n💡 Benefits:")
    print("   • Faster page load times")
    print("   • Better mobile experience") 
    print("   • Reduced bandwidth usage")
    print("   • Maintained image quality")
    
    print(f"\n📋 Next Steps:")
    print("   1. Test your website to ensure images look good")
    print("   2. Consider adding WebP support with <picture> elements")
    print("   3. Monitor performance improvements")

if __name__ == "__main__":
    main() 