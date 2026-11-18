import React, { useEffect, useRef, useState } from 'react'

const FABRIC = '/images/curtain-fabric.jpg'

/** Curtain travel. Long on purpose: the guest asked for a slow, cinematic part. */
const OPEN_MS = 1300
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

type Props = {
  onOpenStart?: () => void
  onOpened?: () => void
}

/**
 * Two silk panels cut from one continuous image. On open, each gathers toward its
 * own edge — compressing, turning slightly away in perspective and sliding off —
 * the way a hung curtain bunches when drawn.
 */
export function Curtain({ onOpenStart, onOpened }: Props) {
  const [opening, setOpening] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  const open = () => {
    if (opening) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    onOpenStart?.()
    if (reduce) {
      onOpened?.()
      return
    }
    setOpening(true)
    window.setTimeout(() => onOpened?.(), OPEN_MS + 80)
  }

  return (
    <div
      role="dialog"
      aria-label="Wedding invitation"
      className="fixed inset-0 z-50 overflow-hidden [perspective:1800px]"
    >
      <Panel side="left" opening={opening} />
      <Panel side="right" opening={opening} />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <button
          ref={buttonRef}
          type="button"
          onClick={open}
          style={{
            opacity: opening ? 0 : 1,
            transform: opening ? 'scale(0.96)' : 'scale(1)',
            transition: 'opacity 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1), background-color 160ms ease-out, color 160ms ease-out',
          }}
          className="pointer-events-auto relative border border-champagne bg-ivory/90 px-9 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.34em] whitespace-nowrap text-gold-ink shadow-[0_10px_40px_-12px_rgba(90,70,40,0.35)] backdrop-blur-[2px] hover:bg-gold-ink hover:text-ivory focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:px-11 sm:py-[18px] sm:text-[13px]"
        >
          <span className="pointer-events-none absolute inset-[3px] border border-champagne/45" />
          Open Invitation
        </button>
      </div>
    </div>
  )
}

function Panel({ side, opening }: { side: 'left' | 'right'; opening: boolean }) {
  const left = side === 'left'
  const closed = 'translateX(0%) rotateY(0deg) scaleX(1)'
  const drawn = left
    ? 'translateX(-100%) rotateY(18deg) scaleX(0.32)'
    : 'translateX(100%) rotateY(-18deg) scaleX(0.32)'

  return (
    <div
      className={`absolute inset-y-0 w-1/2 overflow-hidden ${left ? 'left-0' : 'right-0'}`}
      style={{
        transformOrigin: left ? 'left center' : 'right center',
        transform: opening ? drawn : closed,
        transition: `transform ${OPEN_MS}ms ${EASE}, box-shadow ${OPEN_MS}ms ${EASE}`,
        boxShadow: opening
          ? `${left ? '' : '-'}30px 0 60px -10px rgba(40,30,15,0.28)`
          : `${left ? '' : '-'}6px 0 18px -8px rgba(40,30,15,0.18)`,
        willChange: 'transform',
      }}
    >
      {/* One image spanning both panels, so the pattern meets cleanly at the seam */}
      <div
        className="absolute inset-y-0 w-[200%] bg-cover bg-center"
        style={{ backgroundImage: `url(${FABRIC})`, left: left ? '0' : '-100%' }}
      />

      {/* Fold shading: soft vertical light and shadow, deepening as the silk gathers */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(120,100,70,0) 0px, rgba(120,100,70,0.10) 26px, rgba(120,100,70,0) 58px, rgba(255,255,255,0) 90px)',
          opacity: opening ? 1 : 0.35,
          transition: `opacity ${OPEN_MS}ms ${EASE}`,
        }}
      />

      {/* Highlight on the crest of the folds */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.22) 44px, rgba(255,255,255,0) 72px, rgba(255,255,255,0) 90px)',
          opacity: opening ? 0.9 : 0.5,
          transition: `opacity ${OPEN_MS}ms ${EASE}`,
        }}
      />

      {/* Depth where the two panels meet, and a hint of weight toward the hem */}
      <div
        className="absolute inset-y-0 w-10"
        style={{
          [left ? 'right' : 'left']: 0,
          backgroundImage: `linear-gradient(${left ? '270deg' : '90deg'}, rgba(60,45,20,0.16), rgba(60,45,20,0))`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/4"
        style={{ backgroundImage: 'linear-gradient(0deg, rgba(60,45,20,0.08), rgba(60,45,20,0))' }}
      />
    </div>
  )
}
