import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import { useAnimeList } from '../../hooks/useAnime'
import AnimeCard from '../../components/anime/AnimeCard'
import type { Anime } from '../../types/anime'

const VALID_QUERY_STATUSES = new Set(['airing', 'complete', 'upcoming'])

const STATUS_LABELS: Record<string, string> = {
  airing: 'Currently Airing',
  complete: 'Finished Airing',
  upcoming: 'Upcoming',
}

const AnimeList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = Number(searchParams.get('page') || '1')
  const queryParam = searchParams.get('q')?.trim() ?? ''
  const statusParam = searchParams.get('status')?.trim().toLowerCase() ?? ''
  const normalizedStatus = VALID_QUERY_STATUSES.has(statusParam) ? statusParam : undefined

  const { data, isLoading, error, isFetching } = useAnimeList({
    page: pageParam,
    limit: 8,
    orderBy: 'title',
    q: queryParam || undefined,
    sfw: true,
    type: 'tv',
    status: normalizedStatus,
  })
  const animeItems = data?.data ?? []

  const goToPage = (p: number) => {
    if (p <= 0) return
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(p))
    setSearchParams(nextParams)
  }

  const pagination = data?.pagination
  const activeStatusLabel = normalizedStatus ? STATUS_LABELS[normalizedStatus] : 'All Statuses'

  return (
    <div className="page-shell">
      <Header />
      <main className="page-main">
        <section className="panel page-intro">
          <p className="eyebrow">Catalog // TV index</p>
          <h1>{queryParam ? `Results for "${queryParam}"` : 'Browse the no-filler catalog.'}</h1>
          <p className="section-copy">
            Search TV anime, inspect series metadata, and jump straight into a guide without
            losing the visual rhythm of the new system.
          </p>
          <div className="stats-grid">
            <div className="metric">
              <span className="metricValue">{animeItems.length}</span>
              <span className="metricLabel">titles on this page</span>
            </div>
            <div className="metric">
              <span className="metricValue">{pagination?.current_page ?? pageParam}</span>
              <span className="metricLabel">current page</span>
            </div>
            <div className="metric">
              <span className="metricValue">{activeStatusLabel}</span>
              <span className="metricLabel">catalog status filter</span>
            </div>
          </div>
        </section>

        {isLoading && <div className="loadingState">Loading catalog entries...</div>}
        {error && <div className="errorState">Error loading anime.</div>}

        <section className="card__wrapper">
          {animeItems.map((a: Anime, index: number) => (
            <AnimeCard key={`${a.mal_id}-${index}`} anime={a} />
          ))}
        </section>

        <footer className="panel pagination">
          <button
            className="button button--secondary"
            onClick={() => goToPage(pageParam - 1)}
            disabled={pageParam <= 1 || !pagination}
          >
            Previous
          </button>
          <span className="paginationInfo">
            Page {pagination?.current_page ?? pageParam} of {pagination?.last_visible_page ?? '-'}
          </span>
          <button
            className="button button--secondary"
            onClick={() => goToPage(pageParam + 1)}
            disabled={pagination ? !pagination.has_next_page : false}
          >
            Next
          </button>
          {isFetching && <span className="status-chip">Updating...</span>}
        </footer>
      </main>
    </div>
  )
}

export default AnimeList
