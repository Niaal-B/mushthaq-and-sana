import React, { useEffect, useRef, useState } from 'react'

const FABRIC = '/images/curtain-fabric.jpg'
const SEAL = '/images/monogram-seal.jpg'

/** The seal lifts away first; the curtains start parting just after. */
const SEAL_MS = 320

/** Curtain travel. Long on purpose: the guest asked for a slow, cinematic part. */
const OPEN_MS = 1300
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

type Props = {
  /** Called synchronously inside the tap, so it can start audio. */
  onTap?: () => void
  onOpenStart?: () => void
  onOpened?: () => void
}

/**
 * Two silk panels cut from one continuous image. On open, each gathers toward its
 * own edge — compressing, turning slightly away in perspective and sliding off —
 * the way a hung curtain bunches when drawn.
 */
export function Curtain({ onTap, onOpenStart, onOpened }: Props) {
  const [opening, setOpening] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  const [sealing, setSealing] = useState(false)

  const open = () => {
    if (opening || sealing) return
    onTap?.()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onOpenStart?.()
      onOpened?.()
      return
    }
    setSealing(true)
    window.setTimeout(() => {
      onOpenStart?.()
      setOpening(true)
      window.setTimeout(() => onOpened?.(), OPEN_MS + 80)
    }, SEAL_MS)
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
          aria-label="Open invitation"
          style={{
            opacity: sealing ? 0 : 1,
            transform: sealing ? 'scale(1.08)' : 'scale(1)',
            filter: sealing ? 'blur(2px)' : 'none',
            transition: `opacity ${SEAL_MS + 120}ms ease-out, transform ${SEAL_MS + 120}ms cubic-bezier(0.23,1,0.32,1), filter ${SEAL_MS + 120}ms ease-out`,
          }}
          className="seal group pointer-events-auto flex flex-col items-center rounded-full outline-none"
        >
          <span className="relative block size-[min(42vw,170px)] sm:size-[190px]">
            {/* Warm glow behind the seal */}
            <span
              aria-hidden
              className="seal-glow absolute -inset-[12%] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,170,95,0.55) 0%, rgba(212,170,95,0.18) 45%, rgba(212,170,95,0) 70%)',
              }}
            />

            {/* Fine outer ring */}
            <span
              aria-hidden
              className="absolute -inset-[9%] rounded-full border border-champagne/50"
            />

            {/* Gold rim */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full p-[3px] shadow-[0_18px_50px_-14px_rgba(60,30,5,0.65),0_4px_14px_-6px_rgba(60,30,5,0.5)] transition-transform duration-300 ease-out group-hover:scale-[1.03] group-active:scale-[0.98]"
              style={{
                background:
                  'conic-gradient(from 210deg, #f3dca4, #a9824a, #f7e6b8, #8a6a3a, #e9cf91, #a9824a, #f3dca4)',
              }}
            >
              <span className="relative block size-full overflow-hidden rounded-full ring-1 ring-[#2a1204]">
                <img
                  src={SEAL}
                  alt=""
                  className="absolute inset-0 size-full scale-[1.06] object-cover"
                  draggable={false}
                />
                {/* Inner vignette so the edge reads as a pressed seal */}
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: 'inset 0 0 28px 6px rgba(20,8,1,0.75), inset 0 0 0 1px rgba(243,220,164,0.25)',
                  }}
                />
                {/* Light sweeping across the gold */}
                <span className="seal-shine absolute inset-0" />
              </span>
            </span>
          </span>

          <span className="mt-[min(12vw,48px)] flex items-center gap-3 font-sans text-[10.5px] font-medium uppercase tracking-[0.38em] text-gold-ink sm:text-[11.5px]">
            <span aria-hidden className="h-px w-7 bg-gradient-to-r from-transparent to-champagne" />
            Tap the seal to open
            <span aria-hidden className="h-px w-7 bg-gradient-to-l from-transparent to-champagne" />
          </span>
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
