import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/** Noor-ul-Nikah (vocals only) — played through YouTube's official embed. */
export const MUSIC_VIDEO_ID = '3rSHpD88s9k'
/** Start at 2:14. */
export const MUSIC_START_SECONDS = 134

type YTPlayer = {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  setVolume(volume: number): void
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: Record<string, unknown>) => YTPlayer
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<void> | null = null

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)
  })
  return apiPromise
}

/**
 * A hidden YouTube player, created on page load so it is ready by the time the
 * guest taps the seal. `play()` must be called directly from that tap: browsers
 * only allow sound to start from a user gesture.
 */
export function useBackgroundMusic() {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const readyRef = useRef(false)
  const wantPlayRef = useRef(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadYouTubeApi().then(() => {
      if (cancelled || !hostRef.current || !window.YT) return
      const mount = document.createElement('div')
      hostRef.current.appendChild(mount)
      playerRef.current = new window.YT.Player(mount, {
        videoId: MUSIC_VIDEO_ID,
        width: 1,
        height: 1,
        playerVars: {
          start: MUSIC_START_SECONDS,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            readyRef.current = true
            playerRef.current?.setVolume(80)
            if (wantPlayRef.current) playerRef.current?.playVideo()
          },
          onStateChange: (event: { data: number }) => {
            const state = window.YT!.PlayerState
            if (event.data === state.PLAYING) setPlaying(true)
            if (event.data === state.PAUSED) setPlaying(false)
            // Loop from 2:14 rather than from the very beginning
            if (event.data === state.ENDED) {
              playerRef.current?.seekTo(MUSIC_START_SECONDS, true)
              playerRef.current?.playVideo()
            }
          },
        },
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const play = useCallback(() => {
    wantPlayRef.current = true
    if (readyRef.current) playerRef.current?.playVideo()
  }, [])

  const toggle = useCallback(() => {
    if (!readyRef.current) return
    if (playing) {
      wantPlayRef.current = false
      playerRef.current?.pauseVideo()
    } else {
      play()
    }
  }, [playing, play])

  /** Kept on the page (not display:none) but out of sight, so mobile browsers still play it. */
  const host = (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 size-px overflow-hidden opacity-0"
    />
  )

  return { host, play, toggle, playing }
}

export function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className="fixed bottom-5 right-5 z-40 flex size-11 items-center justify-center rounded-full border border-champagne/70 bg-ivory/90 text-gold-ink shadow-[0_8px_24px_-10px_rgba(90,70,40,0.45)] backdrop-blur-sm transition-transform duration-150 ease-out hover:scale-105 active:scale-95 sm:bottom-7 sm:right-7"
    >
      {playing ? <Volume2 className="size-[18px]" strokeWidth={1.6} /> : <VolumeX className="size-[18px]" strokeWidth={1.6} />}
    </button>
  )
}
