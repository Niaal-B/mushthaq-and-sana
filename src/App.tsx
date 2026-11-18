import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { Curtain } from './components/Curtain'

export const args = {
  curtain: 'closed',
  groomName: 'Sayyid Ahmed Mushthaq',
  brideName: 'Fathima Sana',
  showMapLink: true,
}

type Props = Partial<typeof args>

const ROSES_TOP = '/images/roses-top.jpg'
const ROSES_BOTTOM = '/images/roses-bottom.jpg'
const MAP_URL = 'https://maps.app.goo.gl/3vEgRAeFaBE8AWNc7?g_st=ic'

/** Content starts rising while the curtains are still mid-part. */
const AFTER_CURTAIN = 0.55

const RevealContext = React.createContext({ revealed: true, base: 0 })

export default function Invitation(props: Props) {
  const { curtain, groomName, brideName, showMapLink } = { ...args, ...props }
  const [curtainShown, setCurtainShown] = useState(curtain === 'closed')
  const [revealed, setRevealed] = useState(curtain !== 'closed')

  useEffect(() => {
    setCurtainShown(curtain === 'closed')
    setRevealed(curtain !== 'closed')
  }, [curtain])

  // No scrolling behind a closed curtain
  useEffect(() => {
    if (!curtainShown) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [curtainShown])

  return (
    <RevealContext.Provider value={{ revealed, base: curtain === 'closed' ? AFTER_CURTAIN : 0 }}>
      {curtainShown && (
        <Curtain onOpenStart={() => setRevealed(true)} onOpened={() => setCurtainShown(false)} />
      )}

      <main
        aria-hidden={curtainShown && !revealed}
        className="flex w-full justify-center overflow-hidden bg-paper px-4 py-12 font-serif text-ink sm:px-8 sm:py-20"
      >
        <div className="relative w-full max-w-[760px]">
          {/* Top-right rose cluster — sits over the arch and interrupts its line, as on the card */}
          <Flourish
            src={ROSES_TOP}
            className="right-[-3%] top-[-2.5%] w-[38%] sm:top-[-3%] sm:w-[34%]"
            aspect="aspect-[51/57]"
            imgStyle={{ width: '196%', left: '-49%', top: '-35%' }}
            rounded="rounded-[42%]"
          />

          {/* The arch */}
          <div className="relative mx-[5%] rounded-t-full border border-ink px-5 pb-[46%] pt-[24%] text-center sm:mx-[8%] sm:px-12 sm:pb-[40%] sm:pt-[22%] md:px-14 lg:pb-24">
            {/* Opening — Bismillah and the groom's family */}
            <Reveal immediate>
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic text-[22px] leading-relaxed text-ink sm:text-[28px]"
              >
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </Reveal>

            <Reveal immediate delay={0.08} className="mt-7 sm:mt-9">
              <p className="text-balance font-serif text-[12.5px] font-medium uppercase leading-[1.95] tracking-[0.16em] text-ink sm:text-[15px] sm:tracking-[0.2em]">
                Mr. Sayyid Zainudheen Al&nbsp;Bukhari
                <br />
                &amp; Mrs. Rahmath Beevi
              </p>
              <p className="mt-2 font-serif text-[14px] italic text-graphite sm:text-[16.5px]">
                Kamaliyya House, Kaipamangalam, Thrissur
              </p>
            </Reveal>

            <Reveal immediate delay={0.16} className="mx-auto mt-8 max-w-[30rem] sm:mt-10">
              <p className="text-pretty font-serif text-[15px] italic leading-[1.75] text-graphite sm:text-[17px]">
                With the blessings of the Almighty, we are delighted to invite you and your
                family to join us in celebrating a joyful milestone in our lives – the Wedding
                Reception of our beloved son
              </p>
            </Reveal>

            {/* The couple */}
            <Reveal immediate delay={0.26} className="mt-9 sm:mt-12">
              <h1 className="font-display font-medium leading-[1.08] tracking-[0.01em] text-ink">
                <span className="block text-balance text-[38px] sm:text-[50px] md:text-[56px]">
                  {groomName}
                </span>
                <span className="my-2 block font-display text-[28px] font-normal italic text-graphite sm:text-[36px]">
                  &amp;
                </span>
                <span className="block text-balance text-[38px] sm:text-[50px] md:text-[56px]">
                  {brideName}
                </span>
              </h1>
            </Reveal>

            {/* Bride's family */}
            <Reveal className="mt-8 sm:mt-10">
              <p className="text-balance font-serif text-[12.5px] font-medium uppercase leading-[1.95] tracking-[0.14em] text-graphite sm:text-[15px] sm:tracking-[0.18em]">
                D/o Mr. Ramees P. K. &amp; Mrs. Sajna P.
              </p>
              <p className="mt-1 font-serif text-[14px] italic text-graphite sm:text-[16.5px]">
                Peringalathil House, Kodaparamba, Kannur
              </p>
            </Reveal>

            {/* Date & time */}
            <Reveal className="mt-12 sm:mt-14">
              <p className="font-serif text-[17px] uppercase tracking-[0.34em] text-graphite sm:text-[21px] sm:tracking-[0.38em]">
                January
              </p>
              <div className="mx-auto mt-3 grid max-w-[30rem] grid-cols-[1fr_auto_1fr] items-center gap-2.5 sm:mt-4 sm:gap-6">
                <div className="flex min-h-[4.25rem] items-center justify-center border-y border-rule sm:min-h-[5rem]">
                  <span className="font-serif text-[12px] uppercase tracking-[0.22em] text-graphite sm:text-[15px] sm:tracking-[0.3em]">
                    Sunday
                  </span>
                </div>
                <span className="px-1 font-display text-[54px] font-medium leading-none text-graphite sm:text-[76px]">
                  03
                </span>
                <div className="flex min-h-[4.25rem] flex-col items-center justify-center border-y border-rule py-1.5 font-serif text-[11.5px] uppercase leading-[1.5] tracking-[0.14em] text-graphite sm:min-h-[5rem] sm:text-[14px] sm:tracking-[0.22em]">
                  <span className="whitespace-nowrap">12:00 AM</span>
                  <span className="text-[11px] normal-case italic tracking-[0.08em] sm:text-[13px]">to</span>
                  <span className="whitespace-nowrap">06:00 PM</span>
                </div>
              </div>
              <p className="mt-5 font-serif text-[17px] tracking-[0.34em] text-graphite sm:mt-6 sm:text-[20px]">
                2027
              </p>
            </Reveal>

            {/* Venue */}
            <Reveal className="mt-7 sm:mt-9">
              <p className="text-balance font-serif text-[14px] uppercase italic leading-[1.8] tracking-[0.12em] text-graphite sm:text-[17px] sm:tracking-[0.14em]">
                Kamaliyya Nagar,
                <br />
                Kaipamngalam, Thrissur
              </p>
              {showMapLink && (
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block border-b border-rule/50 pb-0.5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-graphite transition-colors duration-150 ease-out hover:border-ink hover:text-ink sm:text-[12px]"
                >
                  View location
                </a>
              )}
            </Reveal>

            {/* Closing — the Nikah */}
            <Reveal className="mt-10 sm:mt-14">
              <p className="font-display text-[34px] font-medium italic leading-none text-graphite sm:text-[42px]">
                Nikah
              </p>
              <p className="mx-auto mt-3 max-w-[26rem] text-balance font-serif text-[14px] italic leading-relaxed text-graphite sm:text-[16.5px]">
                on Sunday, 27 December 2026, at 4:00 p.m.
                <br />
                at Kannur City Juma Masjid.
              </p>
            </Reveal>
          </div>

          {/* Bottom-left rose cluster with trailing leaves */}
          <Flourish
            src={ROSES_BOTTOM}
            className="bottom-[-1.5%] left-[-3%] w-[27%] sm:left-[-1%] sm:w-[25%]"
            aspect="aspect-[53/88]"
            imgStyle={{ width: '160%', left: '-34%', top: '-18.5%' }}
            rounded="rounded-[45%]"
          />
        </div>
      </main>
    </RevealContext.Provider>
  )
}

function Flourish({
  src,
  className,
  aspect,
  imgStyle,
  rounded,
}: {
  src: string
  className: string
  aspect: string
  imgStyle: React.CSSProperties
  rounded: string
}) {
  const reduce = useReducedMotion()
  const { revealed, base } = React.useContext(RevealContext)
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { opacity: 0 }}
      animate={revealed ? { opacity: 1 } : { opacity: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, delay: base + 0.1, ease: [0.23, 1, 0.32, 1] }}
      className={`pointer-events-none absolute z-10 ${className}`}
    >
      {/* Paper-coloured backing hides the arch line beneath the flowers; multiply drops the image's white */}
      <div className={`relative ${aspect} ${rounded} overflow-hidden bg-paper`}>
        <img
          src={src}
          alt=""
          className="absolute max-w-none mix-blend-multiply"
          style={imgStyle}
        />
      </div>
    </motion.div>
  )
}

function Reveal({
  children,
  className = '',
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  immediate?: boolean
}) {
  const reduce = useReducedMotion()
  const { revealed, base } = React.useContext(RevealContext)
  const hidden = { opacity: 0, y: 10 }
  const visible = { opacity: 1, y: 0 }

  const motionProps = !revealed
    ? { animate: hidden }
    : immediate
      ? { animate: visible }
      : { whileInView: visible, viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <motion.div
      className={className}
      initial={reduce ? false : hidden}
      {...motionProps}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.28, delay: (immediate ? base : 0) + delay, ease: [0.23, 1, 0.32, 1] }
      }
    >
      {children}
    </motion.div>
  )
}
