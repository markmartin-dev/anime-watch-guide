import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    setQuery(params.get('q') ?? '')
  }, [location.search])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuery = query.trim()
    const params = new URLSearchParams()

    params.set('page', '1')
    if (nextQuery) {
      params.set('q', nextQuery)
    }

    navigate({
      pathname: '/anime',
      search: `?${params.toString()}`,
    })
  }

  const navLinkClass = (path: string) =>
    location.pathname === path ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <span className={styles.brandSparkPrimary}></span>
            <span className={styles.brandSparkSecondary}></span>
          </span>
          <span className={styles.brandText}>nofillers.moe</span>
        </Link>

        <div className={styles.controls}>
          <nav className={styles.nav} aria-label="Primary navigation">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/anime" className={navLinkClass('/anime')}>Anime</Link>
            <Link to="/news" className={navLinkClass('/news')}>News</Link>
          </nav>

          <form className={styles.searchForm} onSubmit={onSubmit} role="search" aria-label="Site search">
            <label htmlFor="header-anime-search" className={styles.searchLabel}>
              Search anime, movies, or studios
            </label>
            <span className={styles.searchIcon} aria-hidden="true"></span>
            <input
              id="header-anime-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search anime titles..."
              className={styles.searchInput}
              enterKeyHint="search"
              autoComplete="off"
            />
            <button type="submit" className={styles.searchSubmit}>
              Submit search
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Header
