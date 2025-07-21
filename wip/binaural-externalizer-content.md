# Colorless Binaural Externalization Processing Demonstration
###Authors: Christopher Landschoot, Jean-Marc Jot


# Abstract
In both entertainment and professional applications, conventionally produced stereo or multi-channel audio content is frequently delivered over headphones or earbuds. Use cases involving object-based binaural audio rendering include recently developed immersive multi-channel audio distribution formats, along with the accelerating deployment of virtual or augmented reality applications and head-mounted displays. The appreciation of these listening experiences by end users may be compromised by an unnatural perception of the localization of audio objects: commonly heard near or inside the listener’s head even when their specified position is distant. This artifact is particularly common for frontal object localization, and persists despite the provision of perceptual cues that have been known to partially mitigate it, including synthetic acoustic reflections or reverberation, head orientation compensation, personalized HRTF processing, or reinforcing visual information. In [this](https://www.aes.org/e-lib/browse.cfm?elib=21939) paper, we review previously reported methods for binaural audio externalization processing, and generalize a recently proposed approach to address object-based audio rendering.

In the following demonstration, examples are presented to demonstrate the differences between sample audio rendered with traditional stereo panning, binaural processing, and the proposed externalization algorithm. If you are already familiar with the issues of externalization and front-vs.-back confusion in binaural reproduction technology, please skip to the **‘Comparisons’** appendix included at the [bottom of this page](LINK-TO-COMPARISONS-SECTION).

This research was presented at:
[AES AVAR 2024 on Aug. 29, 2024](https://sched.co/1hpkD) [[*slides*]](https://drive.google.com/file/d/1X9EKfiKzPoVZ8LgH7NNEedysL8h6DjeZ/view?usp=drive_link)
[AES Fall 2023 on Oct. 27, 2023](https://sched.co/1RhwD) [[*slides*]](https://drive.google.com/file/d/1j2gr79RuLqp8TnEn1mbXXEj8bAY4nHsj)
[ASA Meeting #184 on May 9, 2023](https://acousticalsociety.org/chicago-il-8-12-may-2023/)
[ADC 2022 on Nov. 14-16, 2022](https://audio.dev/conference/)
[AES Fall 2022 on Oct. 26, 2022](https://sched.co/1CGVW) [[*paper*]](https://www.aes.org/e-lib/browse.cfm?elib=21939)
[AES Fall 2021 on Oct. 28, 2022](https://sched.co/mIiD)


# Please use headphones for the following demonstration.
Each section will simulate a single virtual source rotating around the head of the listener using different processing methods.
NOTE: The intended trajectory of the source (shown below) remains consistent for all examples, though perceptually it may vary according to the processing method used. It begins at 90° to your right and travels clockwise 1.5 times around your head in the horizontal plane (initially toward the back).

[INSERT VISUALIZATION HERE](wip/assets/binaural-externalization/06 - Circle - Transparent (Sun).webm)


# Traditional Stereo Panning
(RIGHT SIDE OF PAGE)
**Explanation:**
- Stereo audio is the most ubiquitous audio format found in the world today.
- However, without additional processing, traditional stereo playback has limited spatial positioning capabilities. It only allows for a single degree of directional freedom (left/right), ignoring the other two degrees (front/back and up/down).
- Because of this, if a sound source were to be rotated around the listener's head for stereo playback over headphones, it would simply sound like it was traveling side to side through the head.

**Demonstration:**
[AUDIO PLAYBACK BAR]
- Close your eyes and press play. Keep your head still, facing straight ahead.
- Does the source sound like it travels around your head or back and forth through your head as shown in the animation to the left?

(LEFT SIDE OF PAGE)
#### Perceptual Representation of Stereo Panning
[INSERT VISUALIZATION HERE](wip/assets/binaural-externalization/08 - Line - Transparent (Sun).webm)


# Binaural Processing
(LEFT SIDE OF PAGE)
**Explanation:**
- To overcome these shortcomings of traditional stereo panning, applying binaural processing to an audio file can help to account for the other degrees of directional freedom.
- Binaural processing can be achieved by applying filters and delays that simulate the physical characteristics of a human head and ears.
- Binaural Processing:
    - The cartilage around the ear canal (pinna) and the geometry of a human head combine to act as a filter that can help humans to distinguish directional information (i.e. front vs back, up vs down, left vs right).
    - This filter can be measured and approximated by a Head-Related Transfer Function (HRTF).
    - The spectrum of an HRTF changes based on where a sound source is located.
- Binaural Processing improves spatialization over stereo panning but still has some shortcomings.
- One specific issue is that as the source passes in front of the listener, the perceived trajectory often moves up and over the head rather than remaining in the horizontal plane as intended.​

**Demonstration:**
[AUDIO PLAYBACK BAR]
- Close your eyes and press play. Keep your head still, facing straight ahead.
- Does the source sound like it travels around your head? Does the source feel like it remains in the horizontal plane or does it elevate above your head as it passes in front as shown in the animation to the right?

(RIGHT SIDE OF PAGE)
**Spectrum of an HRTF (Neumann KU 100) as a source rotates clockwise around the listener.**
(Thanks to IRCAM Spat)
[INSERT VISUALIZATION HERE](wip/assets/binaural-externalization/07 - Circle Elevation - Transparent (Sun).webm)

#### Perceptual Representation of Binaural Rotation
[INSERT VISUALIZATION HERE](wip/assets/binaural-externalization/02 - HRTF Spectrum Plot (slow).mp4)


# Externalization Processing
(RIGHT SIDE OF PAGE)
**Explanation:**
- A common method to approximate spatialization and/or distance from the listener is introducing synthetic reverberation.
- Reverberation, however, also introduces timbral coloration of the sound, ultimately changing its characteristics (e.g. a singer in a bedroom vs a concert hall).
- The proposed processing method of this demonstration seeks to exploit the perceptual triggers of externalization produced by reverberation, while minimizing spectral coloration artifacts.
- This is achieved by processing the source signal through a 2-channel quasi-all-pass filter that has the effect of adding a brief diffuse reverberation-like decay tail.
- More detailed discussion and description of this method are available in [this paper](https://www.aes.org/e-lib/browse.cfm?elib=21939) and [these slides](https://drive.google.com/file/d/1X9EKfiKzPoVZ8LgH7NNEedysL8h6DjeZ/view?usp=drive_link).

**Demonstration:**
[AUDIO PLAYBACK BAR]
- Close your eyes and press play. Keep your head still, facing straight ahead.
- Does the source sound like it travels around your head? Does the source feel like it remains in the horizontal plane (as shown in the animation to the left) or does it elevate above your head as it passes in front similar to the previous section?

(LEFT SIDE OF PAGE)
#### Perceptual Representation of Externalized Binaural Rotation
[INSERT VISUALIZATION HERE](wip/assets/binaural-externalization/06 - Circle - Transparent (Sun).webm)


# Appendix - Comparisons
(CENTERED)
**Demonstration:**
- In addition to the rotation examples presented above, this section includes examples for a stationary sound source at various positions around the listener’s head in the horizontal plane.
- In particular, we recommend checking out lateral positions, comparing front (±30 or ±45 degrees) vs. back (±150 or ±135 degrees), with or without the Externalization enhancement.
- Does the position of the source sound more elevated or more “internalized” when you play the ‘Binaural’ version after playing the ‘Externalized’ version?
- As in the above examples, we recommend that you **close your eyes** before playing.

[360 DEG PLAYBACK GRID HERE]

Thanks to Alexey Lukin, Kurt Werner, and Evan Allen for previous work presented at the AES Show Fall 2021.
Thanks to Alexey Lukin and Roth Michaels for early investigations towards extending the prototype implementation and its evaluation in Max.


# Future Work
- Psychophysical investigations of the perception of concurrent free-field and diffuse-field components of a sound event.
- Producing binaural recordings that leverage familiar 2-channel stereo production techniques (such as stereo flanger or chorus effects), or apply externalization processing to selected tracks or stems in a stereo mix (e.g. a vocal track).
- Virtual meeting and augmented or virtual reality experiences, combining the proposed externalization processing scheme with head tracking and HRTF personalization.