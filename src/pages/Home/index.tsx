import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Anime Watch Guide</h1>
        <nav>
          <ul>
            <li><Link to="/anime">All Anime</Link></li>
            <li><Link to="/news">Anime News</Link></li>
          </ul>
        </nav>
      </main>
    </div>
  )
}

export default Home
