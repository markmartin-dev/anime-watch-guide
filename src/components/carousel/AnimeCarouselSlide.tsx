import React from 'react';
import AnimeImage from "../anime/AnimeImage";
import styles from "./AnimeCarouselSlide.module.css";
import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slug';


type AnimeCarouselSlideProps = {
    id: string
    title: string
    images?: Parameters<typeof AnimeImage>[0]['images']
}

const AnimeCarouselSlide: React.FC<AnimeCarouselSlideProps> = ({ id, title, images }) => {
    const slug = slugify(title);
    return (
        <Link to={`/anime/${id}/${slug}`} className={styles.linkOverlay} aria-label={`View details for ${title}`}>
            <div className={styles.card}>
                    <div className={styles.textContent}>
                        <h3 className={styles.title}>{title}</h3>
                    </div>
                    <AnimeImage
                        images={images}
                        title={title}
                        loading="lazy"
                        className={styles.image}
                        preferredSize='large'
                    />
            </div>
        </Link>
    )
}   

export default AnimeCarouselSlide
