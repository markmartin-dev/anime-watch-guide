import React from 'react'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'

const newsSignals = [
  {
    label: 'Release radar',
    title: 'Seasonal lineups can slot cleanly into this system.',
    body: 'Story cards now have room for tags, timestamps, and ranked importance once a feed is connected.',
  },
  {
    label: 'Watchlist sync',
    title: 'News modules can point viewers back to active guides.',
    body: 'A premiere story, delay notice, or recap warning can route straight into the relevant anime detail page.',
  },
  {
    label: 'Editorial layer',
    title: 'The interface is ready for richer curation.',
    body: 'Featured stories, creator notes, and seasonal breakdowns can all reuse the same deep-space components.',
  },
]

const News: React.FC = () => {
  return (
    <div className="page-shell">
      <Header />
      <main className="page-main">
        <section className="panel page-intro">
          <p className="eyebrow">Signal feed</p>
          <h1>Anime news, release notes, and industry pulse.</h1>
          <p className="section-copy">
            This feed is still a prototype, so the layout below establishes the presentation system
            for future RSS or API-driven stories.
          </p>
        </section>

        <section className="news-grid">
          {newsSignals.map((signal) => (
            <article className="news-card" key={signal.title}>
              <p className="eyebrow">{signal.label}</p>
              <h3>{signal.title}</h3>
              <p>{signal.body}</p>
            </article>
          ))}
        </section>

        <section className="panel section-stack">
          <div className="section-header">
            <div>
              <p className="eyebrow">Future modules</p>
              <h2>Connected system outputs.</h2>
            </div>
            <span className="status-chip">feed pending</span>
          </div>
          <div className="panel-grid">
            <article className="mini-card">
              <h3>Headline stack</h3>
              <p>Compact lead stories with publish times, source badges, and CTA links.</p>
            </article>
            <article className="mini-card">
              <h3>Seasonal dispatches</h3>
              <p>Weekly editorial summaries that sit naturally beside the catalog and guide pages.</p>
            </article>
            <article className="mini-card">
              <h3>Update relays</h3>
              <p>Production delays, dub announcements, and watch-order changes can all live here.</p>
            </article>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

export default News
