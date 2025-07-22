/**
 * iOS Video Fallback System
 * Automatically detects iOS devices and switches transparent videos
 * to versions with solid backgrounds for compatibility.
 */

(function() {
    'use strict';

    // iOS Detection
    function isiOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    // Video mapping configuration
    const VIDEO_MAPPINGS = {
        // Main site
        'assets/binaural-externalization/06 - Circle - Transparent (Sun).webm': 
            'assets/binaural-externalization/06 - Circle - Gray-BG.webm',
        
        // Binaural site - context-aware mapping
        '../assets/binaural-externalization/06 - Circle - Transparent (Sun).webm': {
            'introduction': '../assets/binaural-externalization/06 - Circle - Blue-BG.webm',
            'externalized': '../assets/binaural-externalization/06 - Circle - White-BG.webm'
        },
        '../assets/binaural-externalization/07 - Circle Elevation - Transparent (Sun).webm': 
            '../assets/binaural-externalization/07 - Circle Elevation - Gray-BG.webm',
        '../assets/binaural-externalization/08 - Line - Transparent (Sun).webm': 
            '../assets/binaural-externalization/08 - Line - White-BG.webm'
    };

    // MOV fallback mappings (replace .webm with .mov)
    const MOV_MAPPINGS = {};
    Object.keys(VIDEO_MAPPINGS).forEach(key => {
        const mapping = VIDEO_MAPPINGS[key];
        if (typeof mapping === 'string') {
            MOV_MAPPINGS[key.replace('.webm', '.mov')] = mapping.replace('.webm', '.mov');
        } else {
            MOV_MAPPINGS[key.replace('.webm', '.mov')] = {};
            Object.keys(mapping).forEach(context => {
                MOV_MAPPINGS[key.replace('.webm', '.mov')][context] = mapping[context].replace('.webm', '.mov');
            });
        }
    });

    function getVideoReplacement(originalSrc, sectionId) {
        // Try WebM mapping first
        let mapping = VIDEO_MAPPINGS[originalSrc];
        
        // If not found, try MOV mapping
        if (!mapping) {
            mapping = MOV_MAPPINGS[originalSrc];
        }

        // If mapping is context-aware (object), use section ID
        if (mapping && typeof mapping === 'object') {
            return mapping[sectionId] || null;
        }

        // Return direct mapping or null
        return mapping || null;
    }

    async function checkVideoExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.log(`iOS fallback: Video not found - ${url}`);
            return false;
        }
    }

    async function replaceVideoSource(video) {
        const sources = video.querySelectorAll('source');
        if (sources.length === 0) return;

        // Get section context
        const section = video.closest('section');
        const sectionId = section ? section.id : null;

        // Process each source
        for (const source of sources) {
            const originalSrc = source.getAttribute('src');
            const replacement = getVideoReplacement(originalSrc, sectionId);

            if (replacement) {
                // Check if replacement video exists
                if (await checkVideoExists(replacement)) {
                    console.log(`iOS fallback: ${originalSrc} → ${replacement}`);
                    source.setAttribute('src', replacement);
                    
                    // Update data attributes for debugging
                    video.setAttribute('data-ios-fallback', 'true');
                    video.setAttribute('data-original-src', originalSrc);
                    video.setAttribute('data-fallback-src', replacement);
                } else {
                    console.log(`iOS fallback: Replacement not found for ${originalSrc}`);
                }
            }
        }

        // Reload video with new sources
        video.load();
    }

    function setupiOSVideoFallbacks() {
        if (!isiOS()) {
            console.log('iOS fallback: Not an iOS device, skipping video replacements');
            return;
        }

        console.log('iOS fallback: iOS device detected, checking for video replacements...');

        // Find all videos with transparent backgrounds
        const videos = document.querySelectorAll('video');
        const transparentVideos = Array.from(videos).filter(video => {
            const sources = video.querySelectorAll('source');
            return Array.from(sources).some(source => 
                source.getAttribute('src')?.includes('Transparent')
            );
        });

        console.log(`iOS fallback: Found ${transparentVideos.length} transparent videos`);

        // Replace each video's sources
        transparentVideos.forEach(video => {
            replaceVideoSource(video).catch(error => {
                console.error('iOS fallback: Error replacing video sources:', error);
            });
        });

        // Add CSS class to body for potential styling hooks
        document.body.classList.add('ios-video-fallback');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupiOSVideoFallbacks);
    } else {
        setupiOSVideoFallbacks();
    }

    // Export for manual triggering if needed
    window.setupiOSVideoFallbacks = setupiOSVideoFallbacks;

})(); 