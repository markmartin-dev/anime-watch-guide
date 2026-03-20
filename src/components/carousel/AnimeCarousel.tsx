import React, { useEffect, useId, useRef, useState } from 'react'
import AnimeCarouselSlide from './AnimeCarouselSlide'
import styles from './AnimeCarousel.module.css'

type Slide = {
  id: string
  title: string
  synopsis?: string | null
  images?: Parameters<typeof AnimeCarouselSlide>[0]['images']
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReduced(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return reduced
}

export const AnimeCarousel: React.FC<{
  label?: string
  slides: Slide[]
  autoMs?: string | number
}> = ({ label = 'Featured', slides, autoMs = 8000 }) => {
  const prefersReducedMotion = useReducedMotion()
  const carouselId = useId()

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isSuspended, setIsSuspended] = useState(false)
  const liveRef = useRef<HTMLDivElement | null>(null)

  const count = slides.length
  const active = slides[index]

  const effectiveIsPlaying = isPlaying && !prefersReducedMotion
  const canAutoPlay = effectiveIsPlaying && !isSuspended && count > 1

  const goTo = (next: number) => {
    const wrapped = (next + count) % count
    setIndex(wrapped)
  }

  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  useEffect(() => {
    if (!canAutoPlay) return
    const intervalMs = typeof autoMs === 'string' ? parseInt(autoMs, 10) : autoMs
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => window.clearInterval(t)
  }, [canAutoPlay, autoMs, count])

  useEffect(() => {
    if (!liveRef.current) return
    liveRef.current.textContent = `Slide ${index + 1} of ${count}: ${active?.title ?? ''}`
  }, [index, count, active?.title])

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setIsSuspended(true)}
      onMouseLeave={() => setIsSuspended(false)}
      onFocusCapture={() => setIsSuspended(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsSuspended(false)
        }
      }}
    >
      <div ref={liveRef} role="status" aria-live="polite" className={styles.srOnly} />

      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>{label}</p>
          <h2 className={styles.heading}>Featured signal</h2>
        </div>

        <div className={styles.controls} aria-label="Carousel controls">
          <button
            className={styles.controlButton}
            type="button"
            onClick={prev}
            aria-controls={`${carouselId}-viewport`}
          >
            Prev
          </button>
          <button
            className={styles.controlButton}
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-pressed={effectiveIsPlaying}
            aria-controls={`${carouselId}-viewport`}
            disabled={prefersReducedMotion || count <= 1}
          >
            {effectiveIsPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            className={styles.controlButton}
            type="button"
            onClick={next}
            aria-controls={`${carouselId}-viewport`}
          >
            Next
          </button>
        </div>
      </div>

      <div id={`${carouselId}-viewport`} className={styles.viewport} aria-live="off">
        {slides.map((s, i) => (
          <div
            key={`${s.id}-${i}`}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.title}`}
            hidden={i !== index}
          >
            <AnimeCarouselSlide
              id={s.id.toString()}
              title={s.title}
              synopsis={s.synopsis}
              images={s.images}
            />
          </div>
        ))}
      </div>

      <div className={styles.pagination} role="group" aria-label="Choose slide">
        {slides.map((s, i) => (
          <button
            key={`${s.id}-${i}`}
            className={
              i === index
                ? `${styles.paginationDot} ${styles.paginationDotActive}`
                : styles.paginationDot
            }
            type="button"
            onClick={() => goTo(i)}
            aria-controls={`${carouselId}-viewport`}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            aria-current={i === index ? 'true' : undefined}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
    </section>
  )
}
