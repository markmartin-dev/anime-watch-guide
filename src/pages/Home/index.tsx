import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import AnimeImage from '../../components/anime/AnimeImage'
import FeatureHero from '../../components/feature/FeatureHero'
import { useTopAnime, useAnimeList } from '../../hooks/useAnime'
import { slugify } from '../../utils/slug'
import type { Anime } from '../../types/anime'

const filterChips = [
  { label: 'Trending', icon: 'trending_up' },
  { label: 'New', icon: 'verified' },
  { label: 'Hot', icon: 'local_fire_department' },
  { label: 'Must Watch', icon: 'animation' },
  { label: 'Recently Updated', icon: 'update' },
]

const newsItems = [
  {
    label: 'Production',
    title: 'Studio MAPPA announces new original project for Summer 2026',
    time: '2 hours ago',
  },
  {
    label: 'Event',
    title: 'Anime Expo 2026 schedules announced for main stage panels',
    time: '5 hours ago',
  },
  {
    label: 'Manga',
    title: '"Ghost in the Machine" manga reaches 10 million copies',
    time: 'Yesterday',
  },
]

const getAnimeHref = (anime?: Anime) =>
  anime ? `/anime/${anime.mal_id}/${slugify(anime.title)}` : '/anime'

const getGenreLabel = (anime?: Anime) =>
  anime?.genres?.slice(0, 2).map((genre) => genre.name).join(', ') || 'Curated watch guide'

const formatReleaseDate = (anime?: Anime) => {
  const releaseDate = anime?.aired?.from

  if (!releaseDate) {
    return 'Coming soon'
  }

  const parsedDate = new Date(releaseDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Coming soon'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(parsedDate)
}

const Home: React.FC = () => {
  const { data } = useTopAnime({ page: 1, limit: 10, sfw: true, filter: 'airing', type: 'tv' })
  const { data: animeList } = useAnimeList({
    page: 2,
    limit: 8,
    orderBy: 'popularity',
    sfw: true,
    type: 'tv',
    status: 'complete',
  })
  const { data: upcomingAnimeList } = useAnimeList({
    page: 1,
    limit: 3,
    orderBy: 'popularity',
    sfw: true,
    type: 'tv',
    status: 'upcoming',
  })

  const popularAnime = data?.data || []
  const libraryAnime = animeList?.data || []
  const upcomingAnime = upcomingAnimeList?.data || []
  const heroAnime = popularAnime[0] || libraryAnime[0]
  const trendingAnime = (libraryAnime.length ? libraryAnime : popularAnime).slice(0, 5)
  const topWeekAnime = popularAnime.slice(0, 3)
  const leadNewsAnime = trendingAnime[2] || heroAnime
  const releases = upcomingAnime

  return (
    <div className="page-shell">
      <Header />
      <main className="page-main homeDashboard">
        <FeatureHero
          badge="Spotlight"
          title={heroAnime?.title ?? 'Cyber Odyssey: Resurgence'}
          description={
            heroAnime?.synopsis ??
            'In a world where memories can be traded, a rogue technician discovers a sequence that could overwrite reality itself.'
          }
          image={heroAnime?.images}
          href={getAnimeHref(heroAnime)}
        />

        <section className="homeFilters">
          {filterChips.map((chip) => (
            <button key={chip.label} type="button" className="homeFilterChip">
              <span className="material-symbols-outlined">{chip.icon}</span>
              {chip.label}
            </button>
          ))}
        </section>

        <section className="homeSection">
          <div className="section-header">
            <div>
              <h2 className="homeSectionTitle">Trending Now</h2>
            </div>
            <Link to="/anime" className="homeSectionLink">
              View All
            </Link>
          </div>

          <div className="homeTrendingGrid">
            {trendingAnime.map((anime) => (
              <Link key={anime.mal_id} to={getAnimeHref(anime)} className="homeTrendCard">
                <div className="homeTrendMedia">
                  <AnimeImage
                    images={anime.images}
                    title={anime.title}
                    loading="lazy"
                    className="homeTrendImage"
                  />
                  <span className="homeTrendBadge">
                    EP {anime.episodes ? `/${anime.episodes}` : '/?'}
                  </span>
                </div>
                <div className="homeTrendBody">
                  <h3>{anime.title}</h3>
                  <p>{getGenreLabel(anime)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="homeColumns">
          <div className="homePanel">
            <h2 className="homeSectionTitle">Top This Week</h2>
            <div className="homeRankingList">
              {topWeekAnime.map((anime, index) => (
                <Link key={anime.mal_id} to={getAnimeHref(anime)} className="homeRankingItem">
                  <span className="homeRankingIndex">{String(index + 1).padStart(2, '0')}</span>
                  <div className="homeRankingThumb">
                    <AnimeImage
                      images={anime.images}
                      title={anime.title}
                      loading="lazy"
                      className="homeRankingImage"
                    />
                  </div>
                  <div className="homeRankingContent">
                    <h3>{anime.title}</h3>
                    <p>
                      {anime.studios?.[0]?.name ?? 'Top studio pick'} • {anime.score ?? 'N/A'} Rating
                    </p>
                  </div>
                  <div className="homeRankingTags">
                    {anime.genres?.slice(0, 2).map((genre) => (
                      <span key={genre.mal_id} className="homeTag">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="homePanel">
            <h2 className="homeSectionTitle">Latest News</h2>
            <div className="homeNewsLead">
              {leadNewsAnime ? (
                <AnimeImage
                  images={leadNewsAnime.images}
                  title={leadNewsAnime.title}
                  loading="lazy"
                  className="homeNewsLeadImage"
                />
              ) : null}
              <div className="homeNewsLeadBody">
                <span className="homeNewsLabel">{newsItems[0].label}</span>
                <h3>{newsItems[0].title}</h3>
                <p>{newsItems[0].time}</p>
              </div>
            </div>
            <div className="homeNewsList">
              {newsItems.slice(1).map((item) => (
                <article key={item.title} className="homeNewsItem">
                  <span className="homeNewsLabel">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.time}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="homeSection">
          <h2 className="homeSectionTitle">Upcoming Releases</h2>
          <div className="homeReleaseGrid">
            {releases.map((anime, index) => (
              <Link key={anime.mal_id} to={getAnimeHref(anime)} className="homeReleaseCard">
                <div className="homeReleaseThumb">
                  <AnimeImage
                    images={anime.images}
                    title={anime.title}
                    loading="lazy"
                    className="homeReleaseImage"
                  />
                </div>
                <div className="homeReleaseBody">
                  <span className="homeReleaseDate">{formatReleaseDate(anime)}</span>
                  <h3>{anime.title}</h3>
                  <p>
                    {anime.synopsis?.slice(0, 96) ??
                      'A fresh story update is approaching the watch queue.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

export default Home
