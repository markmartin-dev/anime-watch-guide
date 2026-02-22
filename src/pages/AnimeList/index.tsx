import React from 'react'
import Header from '../../components/layout/Header'
import { useSearchParams } from 'react-router-dom'
import { useAnimeList } from '../../hooks/useAnime'
import AnimeCard from '../../components/anime/AnimeCard'

const AnimeList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = Number(searchParams.get('page') || '1')

  const { data, isLoading, error, isFetching } = useAnimeList(pageParam)

  const goToPage = (p: number) => {
    if (p <= 0) return
    setSearchParams({ page: String(p) })
  }

  const pagination = data?.pagination

  return (
    <div>
      <Header />
      <main>
        <h1>All Anime</h1>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading anime</div>}
        <section>
          {data?.data?.map((a: any) => (
            <AnimeCard key={a.mal_id} anime={a} />
          ))}
        </section>

        <footer style={{ marginTop: 20 }}>
          <button onClick={() => goToPage(pageParam - 1)} disabled={pageParam <= 1 || !pagination}>
            Previous
          </button>
          <span style={{ margin: '0 8px' }}>
            Page {pagination?.current_page ?? pageParam} of {pagination?.last_visible_page ?? '—'}
          </span>
          <button
            onClick={() => goToPage(pageParam + 1)}
            disabled={pagination ? !pagination.has_next_page : false}
          >
            Next
          </button>
          {isFetching && <span style={{ marginLeft: 8 }}>Updating…</span>}
        </footer>
      </main>
    </div>
  )
}

export default AnimeList
