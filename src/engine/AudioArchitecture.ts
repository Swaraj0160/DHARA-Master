import { useEffect, useRef, useState } from "react";

interface AudioConfig {
  ambientVolume?: number;
  foleyVolume?: number;
  muted?: boolean;
}

const DEFAULT_CONFIG: AudioConfig = {
  ambientVolume: 0.4,
  foleyVolume: 0.7,
  muted: false,
};

// Global audio state to prevent multiple scenes overlapping ambience
class AudioSystem {
  private static instance: AudioSystem;
  private ambientAudio: HTMLAudioElement | null = null;
  public config: AudioConfig = { ...DEFAULT_CONFIG };

  private constructor() {}

  public static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  public setConfig(newConfig: Partial<AudioConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.updateVolumes();
  }

  public playAmbience(src: string) {
    if (this.ambientAudio && this.ambientAudio.src.endsWith(src)) {
      // Already playing this track
      return;
    }

    this.stopAmbience();

    this.ambientAudio = new Audio(src);
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = this.config.muted ? 0 : (this.config.ambientVolume ?? 0.4);
    
    // Play with catch to handle browser autoplay policies gracefully
    this.ambientAudio.play().catch(e => {
      console.warn("Autoplay prevented for ambience. Will resume on interaction.", e);
      // We could attach a global interaction listener here to resume
      const resumeAudio = () => {
        this.ambientAudio?.play();
        document.removeEventListener('click', resumeAudio);
      };
      document.addEventListener('click', resumeAudio);
    });
  }

  public stopAmbience() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio = null;
    }
  }

  public playFoley(src: string) {
    if (this.config.muted) return;
    const foley = new Audio(src);
    foley.volume = this.config.foleyVolume ?? 0.7;
    foley.play().catch(e => console.warn("Foley play prevented", e));
  }

  private updateVolumes() {
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.config.muted ? 0 : (this.config.ambientVolume ?? 0.4);
    }
  }
}

export const audioSystem = AudioSystem.getInstance();

/**
 * Hook to manage scene-specific ambience
 */
export function useSceneAmbience(src?: string) {
  useEffect(() => {
    if (src) {
      audioSystem.playAmbience(src);
    }
    
    return () => {
      // We only stop on unmount if it's a hard unmount. 
      // Usually, the next scene will override it.
      // For cinematic transitions, we might want to crossfade (future enhancement).
    };
  }, [src]);
}
