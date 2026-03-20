export type AnimeImageVariant = {
    image_url?: string
    small_image_url?: string
    large_image_url?: string
}

export type AnimeImages = {
    jpg?: AnimeImageVariant
    webp?: AnimeImageVariant
}

export type AnimeGenre = {
    mal_id: number
    name: string
}

export type AnimeStudio = {
    mal_id: number
    name: string
}

export type AnimeTitle = {
    type: string
    title: string
}

export type Anime = {
    mal_id: number
    url?: string
    images?: AnimeImages
    title: string
    type?: string
    status?: Array<string> | string
    score?: number
    rank?: number
    popularity?: number
    year?: number
    episodes?: number
    synopsis?: string
    background?: string
    rating?: string
    duration?: string
    aired?: {
        from?: string
        to?: string
        string?: string
    }
    genres?: AnimeGenre[]
    studios?: AnimeStudio[]
}

export type TopAnimeResponse = {
    data: Anime[]
    pagination?: Pagination
}

export type PaginationItems = {
    count: number
    total: number
    per_page: number
}

export type Pagination = {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
    items: PaginationItems
}

export type AnimeListResponse = {
    data: Anime[]
    pagination?: Pagination
}

export type AnimeEpisode = {
    mal_id: number
    episode_id?: number
    title?: string
    aired?: string
    filler?: boolean
    recap?: boolean
}

export type AnimeEpisodesResponse = {
    data?: AnimeEpisode[]
    pagination?: {
        current_page?: number
        has_next_page?: boolean
    }
}

export type AnimePicturesResponse = {
    data: AnimeImages[]
}

export type AnimeRecommendationEntry = {
    mal_id: string
    entry: Anime[]
    content?: string
    user?: {
        username?: string
    }
}

export type AnimeRecommendationsResponse = {
    data: AnimeRecommendationEntry[]
    pagination?: Pagination
}
