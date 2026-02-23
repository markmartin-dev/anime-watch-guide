import React from 'react'
import Header from '../../components/layout/Header'
import { AnimeCarousel } from '../../components/carousel/AnimeCarousel'
import { useTopAnime } from '../../hooks/useAnime'

const Home: React.FC = () => {
    const { data } = useTopAnime({ page: 1, limit: 10, sfw: true, filter: 'airing', type: 'tv' })
    const popularAnime = data?.data || []
  return (
    <div>
      <Header />
      <main>
        <div>
            <h1>Anime Watch Guide</h1>
            <AnimeCarousel slides={popularAnime.map(a => ({id: a.mal_id.toString(), title: a.title, synopsis: a.synopsis, images: a.images}))}/>
        </div>
        <div>
            <h2>News</h2>
            <span>anime news goes here</span>
        </div>
        <div>
            <h2>Top Anime</h2>
        </div>
        <div>
            <h2>Recommendations</h2>
        </div>
        <div>
            <h2>Anime Reviews</h2>
        </div>
      </main>
    </div>
  )
}

export default Home
