import React from 'react'
import Header from '../../components/layout/Header'

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Anime Watch Guide</h1>
        <div>Carousel from popular anime</div>
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
