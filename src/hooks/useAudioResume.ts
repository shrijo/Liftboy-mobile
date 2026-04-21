import { useEffect } from 'react'
import { resumeAudio } from '../audio/AudioEngine'
import { usePatchStore } from '../store/patchStore'

/**
 * Attaches a one-time user gesture listener that resumes the AudioContext.
 * Required by all browsers; critical on iOS where audio is always suspended initially.
 */
export function useAudioResume() {
  const setAudioReady = usePatchStore((s) => s.setAudioReady)

  useEffect(() => {
    const events = ['touchend', 'mousedown', 'keydown'] as const

    async function handleGesture() {
      await resumeAudio()
      setAudioReady(true)
      for (const event of events) {
        document.removeEventListener(event, handleGesture)
      }
    }

    for (const event of events) {
      document.addEventListener(event, handleGesture, { once: true, passive: true })
    }

    return () => {
      for (const event of events) {
        document.removeEventListener(event, handleGesture)
      }
    }
  }, [setAudioReady])
}
