"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';

interface VoicePillProps {
  onTranscript: (text: string) => void;
  onFinal: (text: string) => void;
  disabled?: boolean;
}

export default function VoicePill({ onTranscript, onFinal, disabled }: VoicePillProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // eslint-disable-next-line
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Stop after phrase finishes
        recognitionRef.current.interimResults = true; // Send partial results
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
             onFinal(finalTranscript);
          } else if (interimTranscript) {
             onTranscript(interimTranscript);
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [onTranscript, onFinal]);

  if (!isSupported) return null;

  const toggleListen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={toggleListen}
      className={`relative p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      } ${
        isListening 
          ? 'bg-red-500/20 text-red-600 border border-red-500/30' 
          : 'bg-transparent hover:bg-black/5 text-earth-800'
      }`}
      title={isListening ? "Stop Listening" : "Speak to VEDA"}
    >
      {isListening ? (
         <>
           <div className="absolute inset-0 bg-red-500 rounded-lg animate-ping opacity-20" />
           <Mic className="w-4 h-4 animate-pulse" />
         </>
      ) : (
         <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
