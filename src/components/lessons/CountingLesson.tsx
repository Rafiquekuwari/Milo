'use client'
/**
 * CountingLesson — Full animated lesson for Counting chapter
 * 10 steps: 3 WATCH (1-10 intro) + 4 concept + 3 practice
 * Designed for 3-5 year olds
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { speak, stopSpeech } from '@/lib/useMiloSpeaker'

interface Props {
  childName:        string
  onLessonComplete: () => void
}

// ─── Constants ────────────────────────────────────────────────
const EMOJIS = {
  firefly:    '✨',
  apple:      '🍎',
  star:       '⭐',
  frog:       '🐸',
  butterfly:  '🦋',
  mushroom:   '🍄',
  balloon:    '🎈',
  flower:     '🌸',
}

const NUM_COLORS = [
  '#E64545','#F26B2C','#FFC933','#6FBE3F','#5BC3F0',
  '#9362D8','#E64545','#F26B2C','#FFC933','#6FBE3F',
]

const TOTAL_STEPS = 10

// ─── Shared lesson shell ──────────────────────────────────────
function LessonShell({
  step, totalSteps, miloMood, bubble, children, onNext, nextReady,
}: {
  step: number
  totalSteps: number
  miloMood: 'happy' | 'thinking' | 'celebrate'
  bubble: string
  children: React.ReactNode
  onNext: () => void
  nextReady: boolean
}) {
  const miloSrc = miloMood === 'thinking'
    ? '/assets/characters/milo-thinking.png'
    : '/assets/characters/milo-happy.png'

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', background: 'var(--bg-page)',
      padding: '16px 16px 32px', gap: 16, position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, paddingTop: 8 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 10, height: 10,
            borderRadius: 5, transition: 'all 0.3s ease',
            background: i < step
              ? 'var(--garden-green)'
              : i === step
                ? 'var(--milo-orange)'
                : 'rgba(61,37,22,0.15)',
          }} />
        ))}
      </div>

      {/* Milo + bubble */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        gap: 12, width: '100%', maxWidth: 500,
      }}>
        <img
          src={miloSrc}
          alt="Milo"
          style={{
            width: 72, height: 72, objectFit: 'contain', flexShrink: 0,
            filter: 'drop-shadow(0 4px 8px rgba(61,37,22,.2))',
            animation: miloMood === 'celebrate'
              ? 'miloCelebrate 0.6s ease-in-out infinite alternate'
              : 'miloIdle 3s ease-in-out infinite',
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div style={{
          background: '#fff', border: '3px solid var(--outline)',
          borderRadius: '20px 20px 20px 4px',
          padding: '12px 16px', flex: 1,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 16, color: 'var(--ink)', lineHeight: 1.4,
          boxShadow: '0 4px 0 rgba(61,37,22,.1)',
        }}>
          {bubble}
        </div>
      </div>

      {/* Visual area */}
      <div style={{
        flex: 1, width: '100%', maxWidth: 500,
        background: 'rgba(255,255,255,0.7)',
        border: '3px solid var(--outline)',
        borderRadius: 24,
        boxShadow: '0 6px 0 rgba(61,37,22,.08)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 20, minHeight: 280,
        position: 'relative', overflow: 'hidden',
      }}>
        {children}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!nextReady}
        style={{
          width: '100%', maxWidth: 500, padding: '16px',
          background: nextReady
            ? 'linear-gradient(135deg, var(--milo-orange) 0%, var(--milo-orange-deep) 100%)'
            : 'rgba(61,37,22,0.12)',
          color: nextReady ? '#fff' : 'rgba(61,37,22,0.3)',
          border: 'none', borderRadius: 50,
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 18, cursor: nextReady ? 'pointer' : 'not-allowed',
          boxShadow: nextReady ? '0 4px 20px rgba(242,107,44,0.35)' : 'none',
          transition: 'all 0.3s ease',
          transform: nextReady ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        {nextReady ? 'Next →' : '🎧 Listen to Milo...'}
      </button>

      <style>{`
        @keyframes miloIdle {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes miloCelebrate {
          from { transform: translateY(0) rotate(-8deg) scale(1); }
          to   { transform: translateY(-16px) rotate(8deg) scale(1.1); }
        }
        @keyframes bounceIn {
          0%   { transform: scale(0) translateY(40px); opacity: 0; }
          70%  { transform: scale(1.2) translateY(-8px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes hopUp {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-24px) scaleX(0.85); }
        }
        @keyframes glow {
          0%,100% { filter: drop-shadow(0 0 4px rgba(255,200,0,0.4)); }
          50%      { filter: drop-shadow(0 0 16px rgba(255,200,0,0.9)); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.12); }
        }
        @keyframes sparkle {
          0%   { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(2) rotate(180deg); opacity: 0; }
        }
        @keyframes flipIn {
          0%   { transform: rotateY(90deg) scale(0.5); opacity: 0; }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; }
        }
        @keyframes floatUp {
          from { transform: translateY(0); opacity: 1; }
          to   { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Step 1: WATCH — Numbers 1-10 introduction ───────────────
function Step1Watch({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<number[]>([])
  const [done,  setDone]  = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const words = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten']
    speak("Let's learn to count! Watch carefully!")

    // Use fixed timeouts per number — avoids async setState race condition
    words.forEach((word, i) => {
      const delay = 1200 + i * 950
      window.setTimeout(() => {
        setShown(prev => [...prev, i + 1])
        window.setTimeout(() => speak(word), 100) // small offset so render happens first
      }, delay)
    })

    // After all 10 shown
    window.setTimeout(() => {
      speak('One, two, three, four, five, six, seven, eight, nine, ten! Amazing!')
      setDone(true)
      window.setTimeout(onDone, 3500)
    }, 1200 + 10 * 950)
  }, [onDone])

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap',
      gap: 8, justifyContent: 'center', alignItems: 'center',
    }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const n = i + 1
        const visible = shown.includes(n)
        return (
          <div key={n} style={{
            width: 64, height: 72,
            background: visible ? NUM_COLORS[i] : 'transparent',
            border: `3px solid ${visible ? NUM_COLORS[i] : 'transparent'}`,
            borderRadius: 16,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: visible ? 1 : 0,
            animation: visible ? 'bounceIn 0.5s cubic-bezier(.34,1.56,.64,1) both' : 'none',
            boxShadow: visible ? '0 4px 0 rgba(61,37,22,.2)' : 'none',
          }}>
            {visible && (
              <>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 28, color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,.2)',
                }}>{n}</span>
                <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 48 }}>
                  {Array.from({ length: Math.min(n, 5) }).map((_, j) => (
                    <div key={j} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.8)',
                    }} />
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}
      {done && (
        <div style={{
          position: 'absolute', fontSize: 32,
          animation: 'sparkle 1s ease-out both',
        }}>🌟</div>
      )}
    </div>
  )
}

// ─── Step 2: WATCH — Frog hopping 1-10 ───────────────────────
function Step2Watch({ onDone }: { onDone: () => void }) {
  const [frogPos,  setFrogPos]  = useState(0) // 0 = start, 1-10 = on number
  const [active,   setActive]   = useState(0)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const words = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten']
    speak('Watch the frog jump! One, two, three...')

    let i = 1
    function hop() {
      if (i > 10) {
        speak('Ten! The frog made it! Amazing counting!')
        window.setTimeout(onDone, 2500)
        return
      }
      setFrogPos(i)
      setActive(i)
      speak(words[i - 1])
      i++
      window.setTimeout(hop, 850)
    }
    window.setTimeout(hop, 1500)
  }, [onDone])

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      {/* Frog — aligned to number cells, each cell is 36px + 4px gap = 40px */}
      <div style={{
        width: '100%', position: 'relative', height: 60,
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute',
          left: frogPos > 0 ? `${(frogPos - 1) * 40 + 4}px` : '4px',
          bottom: 0,
          fontSize: 40,
          transition: 'left 0.35s cubic-bezier(.34,1.56,.64,1)',
          animation: frogPos > 0 ? 'hopUp 0.4s ease' : 'none',
        }}>
          🐸
        </div>
      </div>

      {/* Number line */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const n = i + 1
          const isActive = active === n
          const isPast   = active > n
          return (
            <div key={n} style={{
              width: 36, height: 36,
              background: isActive
                ? NUM_COLORS[i]
                : isPast
                  ? 'var(--garden-green-soft)'
                  : 'var(--cream)',
              border: `3px solid ${isActive ? NUM_COLORS[i] : 'var(--outline)'}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: isActive ? 20 : 16,
              color: isActive ? '#fff' : 'var(--ink)',
              transform: isActive ? 'scale(1.3)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
              boxShadow: isActive ? `0 4px 12px ${NUM_COLORS[i]}80` : '0 2px 0 rgba(61,37,22,.1)',
            }}>
              {n}
            </div>
          )
        })}
      </div>

      {/* Lily pads */}
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width: 36, textAlign: 'center', fontSize: 18 }}>🍃</div>
        ))}
      </div>
    </div>
  )
}

// ─── Step 3: WATCH — Firefly groups 1-5 ──────────────────────
function Step3Watch({ onDone }: { onDone: () => void }) {
  const [groupsShown, setGroupsShown] = useState(0)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const words = ['one','two','three','four','five']
    speak('Watch! One firefly... two fireflies...')

    // Fixed delays to avoid stale closure issue
    const delays = [1200, 2400, 3600, 4800, 6000]
    delays.forEach((delay, idx) => {
      window.setTimeout(() => {
        setGroupsShown(idx + 1)
        window.setTimeout(() => speak(`${words[idx]}!`), 150)
      }, delay)
    })
    window.setTimeout(() => {
      speak('One, two, three, four, five! Each number means this many!')
      window.setTimeout(onDone, 3000)
    }, 7400)
  }, [onDone])

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
      {Array.from({ length: 5 }).map((_, gi) => {
        const groupNum = gi + 1
        const visible  = groupsShown >= groupNum
        const isLatest = groupsShown === groupNum
        return (
          <div key={gi} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 6,
            opacity: visible ? 1 : 0.1,
            transition: 'opacity 0.3s ease',
          }}>
            {/* Number badge */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: NUM_COLORS[gi],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 16, color: '#fff',
              boxShadow: `0 3px 0 rgba(0,0,0,.2)`,
              transform: isLatest ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1)',
            }}>{groupNum}</div>

            {/* Fireflies */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', maxWidth: 60 }}>
              {Array.from({ length: groupNum }).map((_, fi) => (
                <span key={fi} style={{
                  fontSize: 20,
                  display: 'inline-block',
                  animation: visible && isLatest
                    ? `bounceIn 0.4s cubic-bezier(.34,1.56,.64,1) ${fi * 100}ms both`
                    : 'none',
                  filter: isLatest ? 'drop-shadow(0 0 6px #FFC933)' : 'none',
                }}>✨</span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 4: WATCH — 3 apples with counting ──────────────────
function Step4Watch({ onDone }: { onDone: () => void }) {
  const [shown,    setShown]    = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    speak('Watch me count! Touch each one...')
    window.setTimeout(() => {
      setShown(1); speak('One!')
      window.setTimeout(() => {
        setShown(2); speak('Two!')
        window.setTimeout(() => {
          setShown(3); speak('Three!')
          window.setTimeout(() => {
            setShowBadge(true)
            speak('Three apples! See how we count each one!')
            window.setTimeout(onDone, 2500)
          }, 600)
        }, 900)
      }, 900)
    }, 1000)
  }, [onDone])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        {[1,2,3].map(n => (
          <div key={n} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              fontSize: 56,
              display: 'block',
              opacity: shown >= n ? 1 : 0,
              animation: shown >= n ? 'bounceIn 0.5s cubic-bezier(.34,1.56,.64,1) both' : 'none',
              filter: shown === n ? 'drop-shadow(0 0 12px rgba(242,107,44,0.6))' : 'none',
            }}>🍎</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: shown >= n ? NUM_COLORS[n-1] : 'transparent',
              border: `3px solid ${shown >= n ? NUM_COLORS[n-1] : 'var(--outline)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 16, color: '#fff',
              transition: 'all 0.3s ease',
              opacity: shown >= n ? 1 : 0.2,
            }}>{n}</div>
          </div>
        ))}
      </div>

      {showBadge && (
        <div style={{
          background: 'var(--milo-orange)', color: '#fff',
          borderRadius: 20, padding: '12px 28px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28,
          boxShadow: '0 6px 0 rgba(61,37,22,.2)',
          animation: 'bounceIn 0.6s cubic-bezier(.34,1.56,.64,1) both',
        }}>
          3 Apples! 🍎🍎🍎
        </div>
      )}
    </div>
  )
}

// ─── Step 5: TAP_IT — 4 stars ────────────────────────────────
function Step5TapIt({ onDone }: { onDone: () => void }) {
  const [tapped,  setTapped]  = useState<number[]>([])
  const [done,    setDone]    = useState(false)
  const spoken = useRef(false)

  useEffect(() => {
    if (spoken.current) return
    spoken.current = true
    speak('Your turn! Tap each star to count them! Go!')
  }, [])

  function handleTap(i: number) {
    if (tapped.includes(i) || done) return
    const next = [...tapped, i]
    setTapped(next)
    speak(String(next.length))

    if (next.length === 4) {
      setDone(true)
      window.setTimeout(() => {
        speak('Four stars! You counted them all! Wonderful!')
        window.setTimeout(onDone, 2000)
      }, 400)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[0,1,2,3].map(i => {
          const isTapped = tapped.includes(i)
          return (
            <button key={i} onClick={() => handleTap(i)} style={{
              width: 80, height: 80, borderRadius: 20, border: 'none',
              background: isTapped ? 'var(--sun-yellow-soft)' : 'var(--cream)',
              outline: isTapped ? '4px solid var(--sun-yellow-deep)' : '3px solid var(--outline)',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              animation: !isTapped ? 'pulse 1.5s ease-in-out infinite' : 'none',
              transform: isTapped ? 'scale(0.9)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(.34,1.56,.64,1)',
              boxShadow: isTapped ? 'none' : '0 4px 0 rgba(61,37,22,.1)',
            }}>
              <span style={{
                fontSize: 40,
                filter: isTapped ? 'none' : 'grayscale(0.3)',
              }}>⭐</span>
              {isTapped && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 18, color: 'var(--sun-yellow-deep)',
                }}>{tapped.indexOf(i) + 1}</span>
              )}
            </button>
          )
        })}
      </div>

      {done && (
        <div style={{
          background: 'var(--garden-green)', color: '#fff',
          borderRadius: 50, padding: '10px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20,
          animation: 'bounceIn 0.5s cubic-bezier(.34,1.56,.64,1)',
        }}>⭐ 4 Stars! ⭐</div>
      )}

      {!done && (
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 14,
          color: 'var(--ink-muted)', margin: 0,
        }}>
          Tapped: {tapped.length} / 4
        </p>
      )}
    </div>
  )
}

// ─── Step 6: COUNT_IT — 2 frogs ──────────────────────────────
function Step6CountIt({ onDone }: { onDone: () => void }) {
  const [tapped, setTapped] = useState<number[]>([])
  const [done,   setDone]   = useState(false)
  const spoken = useRef(false)

  useEffect(() => {
    if (spoken.current) return
    spoken.current = true
    speak('Tap each frog to count! How many frogs are there?')
  }, [])

  function handleTap(i: number) {
    if (tapped.includes(i) || done) return
    const next = [...tapped, i]
    setTapped(next)
    speak(String(next.length))
    if (next.length === 2) {
      setDone(true)
      window.setTimeout(() => {
        speak('Two frogs! Well done! You counted them!')
        window.setTimeout(onDone, 2000)
      }, 400)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', gap: 32 }}>
        {[0,1].map(i => {
          const isTapped = tapped.includes(i)
          return (
            <button key={i} onClick={() => handleTap(i)} style={{
              width: 110, height: 110, borderRadius: 24,
              border: 'none', background: 'transparent',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <span style={{
                fontSize: 72, display: 'block',
                animation: !isTapped ? 'pulse 1.2s ease-in-out infinite' : 'none',
                filter: isTapped
                  ? 'drop-shadow(0 0 16px rgba(111,190,63,0.8))'
                  : 'drop-shadow(0 4px 8px rgba(0,0,0,.1))',
                transform: isTapped ? 'scale(0.9)' : 'scale(1)',
                transition: 'transform 0.2s ease',
              }}>🐸</span>
              {isTapped && (
                <div style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--garden-green)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16,
                  animation: 'bounceIn 0.3s cubic-bezier(.34,1.56,.64,1)',
                  border: '2px solid var(--outline)',
                }}>
                  {tapped.indexOf(i) + 1}
                </div>
              )}
              {/* Tap hint ring */}
              {!isTapped && (
                <div style={{
                  position: 'absolute', inset: -4,
                  borderRadius: 28, border: '3px dashed var(--milo-orange)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}
            </button>
          )
        })}
      </div>
      {done && (
        <div style={{
          background: 'var(--garden-green)', color: '#fff',
          borderRadius: 50, padding: '10px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20,
          animation: 'bounceIn 0.5s cubic-bezier(.34,1.56,.64,1)',
        }}>🐸 Two Frogs! 🐸</div>
      )}
    </div>
  )
}

// ─── Step 7: WATCH — Practice counting 6 to 10 ──────────────
function Step7Watch({ onDone }: { onDone: () => void }) {
  const [groupIdx,   setGroupIdx]   = useState(-1)  // which group is active (0-4 = 6-10)
  const [shownItems, setShownItems] = useState(0)   // how many items shown in current group
  const ran = useRef(false)

  const GROUPS = [
    { num: 6,  emoji: '🍎', label: 'Six apples' },
    { num: 7,  emoji: '⭐', label: 'Seven stars' },
    { num: 8,  emoji: '🐸', label: 'Eight frogs' },
    { num: 9,  emoji: '🌸', label: 'Nine flowers' },
    { num: 10, emoji: '🎈', label: 'Ten balloons' },
  ]

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    speak('Now let us practise six to ten! Watch carefully!')

    let gi = 0
    function showGroup() {
      if (gi >= GROUPS.length) {
        speak('Six, seven, eight, nine, ten! Amazing! You know all the numbers!')
        window.setTimeout(onDone, 3000)
        return
      }
      const group = GROUPS[gi]
      setGroupIdx(gi)
      setShownItems(0)
      window.setTimeout(() => speak(group.label), 200)

      // Show items one by one
      for (let item = 1; item <= group.num; item++) {
        window.setTimeout(() => {
          setShownItems(item)
        }, item * 180)
      }

      gi++
      window.setTimeout(showGroup, group.num * 180 + 1400)
    }
    window.setTimeout(showGroup, 1200)
  }, [onDone])

  const currentGroup = groupIdx >= 0 ? GROUPS[groupIdx] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

      {/* Number display row 6-10 */}
      <div style={{ display: 'flex', gap: 8 }}>
        {GROUPS.map((g, i) => (
          <div key={g.num} style={{
            width: 44, height: 52,
            background: i === groupIdx ? NUM_COLORS[i + 5 < 10 ? i : 4] : 'var(--cream)',
            border: `3px solid ${i === groupIdx ? NUM_COLORS[i + 5 < 10 ? i : 4] : 'var(--outline)'}`,
            borderRadius: 12,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            transform: i === groupIdx ? 'scale(1.25)' : i < groupIdx ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
            boxShadow: i === groupIdx ? `0 4px 12px ${NUM_COLORS[i]}60` : '0 2px 0 rgba(61,37,22,.1)',
            opacity: i > groupIdx ? 0.35 : 1,
          }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 22, color: i === groupIdx ? '#fff' : 'var(--ink)',
              lineHeight: 1,
            }}>{g.num}</span>
          </div>
        ))}
      </div>

      {/* Emoji items appearing one by one */}
      {currentGroup && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          justifyContent: 'center', maxWidth: 320,
          minHeight: 100,
          background: 'rgba(255,255,255,0.6)',
          border: '2px solid var(--outline)',
          borderRadius: 20, padding: '14px 16px',
        }}>
          {Array.from({ length: currentGroup.num }).map((_, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <span style={{
                fontSize: 36,
                display: 'inline-block',
                opacity: i < shownItems ? 1 : 0,
                transform: i < shownItems ? 'scale(1)' : 'scale(0)',
                transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
              }}>{currentGroup.emoji}</span>
              {i < shownItems && (
                <div style={{
                  position: 'absolute', top: -6, right: -4,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--milo-orange)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 10,
                  border: '1.5px solid var(--outline)',
                }}>{i + 1}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Label */}
      {currentGroup && (
        <div style={{
          background: NUM_COLORS[groupIdx >= 0 ? groupIdx : 0],
          color: '#fff', borderRadius: 50, padding: '8px 20px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20,
          boxShadow: '0 4px 0 rgba(61,37,22,.2)',
          animation: 'bounceIn 0.4s cubic-bezier(.34,1.56,.64,1)',
        }}>
          {currentGroup.num} — {currentGroup.label}
        </div>
      )}
    </div>
  )
}

// ─── Step 8: TAP_IT — 6 mushrooms ────────────────────────────
function Step8TapIt({ onDone }: { onDone: () => void }) {
  const [tapped, setTapped] = useState<number[]>([])
  const [done,   setDone]   = useState(false)
  const spoken = useRef(false)

  useEffect(() => {
    if (spoken.current) return
    spoken.current = true
    speak('Can you count all the mushrooms? Tap each one!')
  }, [])

  function handleTap(i: number) {
    if (tapped.includes(i) || done) return
    const next = [...tapped, i]
    setTapped(next)
    speak(String(next.length))
    if (next.length === 6) {
      setDone(true)
      window.setTimeout(() => {
        speak('Six mushrooms! You are so good at counting!')
        window.setTimeout(onDone, 2000)
      }, 400)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const isTapped = tapped.includes(i)
          return (
            <button key={i} onClick={() => handleTap(i)} style={{
              width: 80, height: 80, borderRadius: 20,
              border: 'none', background: 'transparent',
              cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 52,
                opacity: isTapped ? 0.4 : 1,
                animation: !isTapped ? 'pulse 1.8s ease-in-out infinite' : 'none',
                animationDelay: `${i * 0.2}s`,
                transition: 'opacity 0.2s',
              }}>🍄</span>
              {isTapped && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'var(--garden-green)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20,
                    animation: 'bounceIn 0.3s cubic-bezier(.34,1.56,.64,1)',
                    border: '2px solid var(--outline)',
                    boxShadow: '0 3px 0 rgba(0,0,0,.2)',
                  }}>{tapped.indexOf(i) + 1}</div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-muted)', margin: 0 }}>
        {done ? '🎉 6 mushrooms counted!' : `${tapped.length} of 6 tapped`}
      </p>
    </div>
  )
}

// ─── Step 9: COUNT_IT — 8 balloons ───────────────────────────
function Step9CountIt({ onDone }: { onDone: () => void }) {
  const [tapped, setTapped] = useState<number[]>([])
  const [done,   setDone]   = useState(false)
  const spoken = useRef(false)

  useEffect(() => {
    if (spoken.current) return
    spoken.current = true
    speak('Count these balloons! Tap every single one!')
  }, [])

  function handleTap(i: number) {
    if (tapped.includes(i) || done) return
    const next = [...tapped, i]
    setTapped(next)
    speak(String(next.length))
    if (next.length === 8) {
      setDone(true)
      window.setTimeout(() => {
        speak('Eight balloons! Incredible counting! You are a star!')
        window.setTimeout(onDone, 2000)
      }, 400)
    }
  }

  const COLORS = ['#E64545','#F26B2C','#FFC933','#6FBE3F','#5BC3F0','#9362D8','#E64545','#F26B2C']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
      }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const isTapped = tapped.includes(i)
          return (
            <button key={i} onClick={() => handleTap(i)} style={{
              width: 64, height: 80, border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Balloon */}
              <div style={{
                width: 48, height: 56, borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
                background: isTapped ? '#ccc' : COLORS[i],
                opacity: isTapped ? 0.4 : 1,
                transition: 'all 0.2s',
                animation: !isTapped ? `pulse 1.5s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.15}s`,
                boxShadow: isTapped ? 'none' : `0 4px 12px ${COLORS[i]}60`,
              }} />
              {/* String */}
              <div style={{
                width: 1, height: 12, background: '#888', opacity: isTapped ? 0.3 : 0.6,
              }} />
              {isTapped && (
                <div style={{
                  position: 'absolute', top: 8,
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--garden-green)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13,
                  animation: 'bounceIn 0.3s cubic-bezier(.34,1.56,.64,1)',
                  border: '2px solid var(--outline)',
                }}>
                  {tapped.indexOf(i) + 1}
                </div>
              )}
            </button>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-muted)', margin: 0 }}>
        {done ? '🎈 Eight balloons!' : `${tapped.length} of 8`}
      </p>
    </div>
  )
}

// ─── Step 10: REVEAL — 7 flowers ─────────────────────────────
function Step10Reveal({ onDone }: { onDone: () => void }) {
  const [countIdx,  setCountIdx]  = useState(-1)
  const [showAnswer, setShowAnswer] = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    speak('How many flowers? Count with me!')
    window.setTimeout(() => {
      let i = 0
      function countOne() {
        if (i >= 7) {
          window.setTimeout(() => {
            setShowAnswer(true)
            speak('Seven! The answer is seven flowers! You are amazing!')
            window.setTimeout(onDone, 3000)
          }, 600)
          return
        }
        setCountIdx(i)
        speak(String(i + 1))
        i++
        window.setTimeout(countOne, 700)
      }
      countOne()
    }, 1200)
  }, [onDone])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Question */}
      <div style={{
        background: 'var(--sun-yellow-soft)', border: '3px solid var(--sun-yellow-deep)',
        borderRadius: 16, padding: '8px 20px',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
        color: 'var(--ink)',
      }}>
        How many flowers? 🌸
      </div>

      {/* Flowers with count numbers */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              fontSize: 44,
              display: 'block', textAlign: 'center',
              filter: countIdx >= i
                ? 'drop-shadow(0 0 10px rgba(255,100,100,0.7))'
                : 'grayscale(0.5)',
              transform: countIdx === i ? 'scale(1.3)' : 'scale(1)',
              transition: 'all 0.2s ease',
              opacity: countIdx >= i ? 1 : 0.4,
            }}>🌸</span>
            {countIdx >= i && (
              <div style={{
                position: 'absolute', top: -6, right: -2,
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--milo-orange)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 12,
                border: '2px solid var(--outline)',
                animation: 'bounceIn 0.3s cubic-bezier(.34,1.56,.64,1)',
                boxShadow: '0 2px 0 rgba(0,0,0,.2)',
              }}>{i + 1}</div>
            )}
          </div>
        ))}
      </div>

      {/* Answer reveal */}
      {showAnswer && (
        <div style={{
          background: 'var(--milo-orange)', color: '#fff',
          borderRadius: 20, padding: '16px 32px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36,
          boxShadow: '0 6px 0 rgba(61,37,22,.2)',
          animation: 'flipIn 0.6s ease both',
        }}>
          7! 🌸🌸🌸🌸🌸🌸🌸
        </div>
      )}
    </div>
  )
}

// ─── Main CountingLesson ──────────────────────────────────────
export default function CountingLesson({ childName, onLessonComplete }: Props) {
  const [step, setStep] = useState(0)
  const [nextReady, setNextReady] = useState(false)
  const [mood, setMood] = useState<'happy'|'thinking'|'celebrate'>('happy')

  const BUBBLES = [
    `Hi ${childName}! Let's learn to count 1 to 10! Watch carefully! 🌟`,
    'Now watch the frog jump on each number! 🐸',
    'Each number means a group! Watch the fireflies! ✨',
    'Watch how I count — touch each one! 🍎',
    'Your turn! Tap every star! ⭐',
    'Tap each frog to count them! 🐸',
    'Now let\'s practise six to ten! Watch each group! 🎯',
    'Count all the mushrooms — tap each one! 🍄',
    'Count these balloons — tap every one! 🎈',
    'How many flowers? Let\'s count together! 🌸',
  ]

  const MOODS: Array<'happy'|'thinking'|'celebrate'> = [
    'happy','happy','happy',
    'happy','thinking','thinking',
    'happy','thinking','thinking','celebrate',
  ]

  function handleStepDone() {
    setNextReady(true)
    setMood(MOODS[step] === 'celebrate' ? 'celebrate' : 'happy')
  }

  function handleNext() {
    if (!nextReady) return
    stopSpeech()
    if (step >= TOTAL_STEPS - 1) {
      speak(`Amazing work, ${childName}! You learned to count! Now let's practise!`)
      window.setTimeout(onLessonComplete, 2500)
      return
    }
    setStep(s => s + 1)
    setNextReady(false)
    setMood(MOODS[step + 1])
  }

  const stepContent = [
    <Step1Watch  key={0} onDone={handleStepDone} />,
    <Step2Watch  key={1} onDone={handleStepDone} />,
    <Step3Watch  key={2} onDone={handleStepDone} />,
    <Step4Watch  key={3} onDone={handleStepDone} />,
    <Step5TapIt  key={4} onDone={handleStepDone} />,
    <Step6CountIt key={5} onDone={handleStepDone} />,
    <Step7Watch  key={6} onDone={handleStepDone} />,
    <Step8TapIt  key={7} onDone={handleStepDone} />,
    <Step9CountIt key={8} onDone={handleStepDone} />,
    <Step10Reveal key={9} onDone={handleStepDone} />,
  ]

  return (
    <LessonShell
      step={step}
      totalSteps={TOTAL_STEPS}
      miloMood={mood}
      bubble={BUBBLES[step]}
      onNext={handleNext}
      nextReady={nextReady}
    >
      {stepContent[step]}
    </LessonShell>
  )
}