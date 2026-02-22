export type Anime = {
  mal_id: number
  url?: string
  images?: any
  title: string
  synopsis?: string
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
