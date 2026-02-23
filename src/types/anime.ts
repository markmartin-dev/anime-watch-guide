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

export type AnimeTitle = {
    type: string
    title: string
}

export type Anime = {
    mal_id: number
    url?: string
    images?: AnimeImages
    title: string
    synopsis?: string
    genres?: AnimeGenre[]
}

export type TopAnimeResponse = {
    mal_id: number
    url?: string
    images?: AnimeImages
    titles: AnimeTitle[]
    type: string
    status: string
    genres?: AnimeGenre[]
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
