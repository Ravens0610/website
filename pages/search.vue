<template>
  <div>
    <v-card v-for="(video, index) in videos" :key="index">
      <v-card-title>{{ video.title }}</v-card-title>
    </v-card>
    <v-pagination v-model="pageNumber" :length="pageCount" circle />
  </div>
</template>
<script>
export default {
  async asyncData({ $axios, query }) {
    if (!query.page) query.page = '0'
    const { data } = await $axios.get(
      '/api/v1/videos/search?query=' + query.query + '&page=' + query.page
    )
    return {
      videos: data.videos,
      pageCount: data.pages,
      searchTerms: query.query,
      pageNumber: parseInt(query.page, 10)
    }
  },
  head() {
    return {
      title: `Search for "${this.searchTerms}" - Page ${this.pageNumber + 1}`
    }
  },
  validate({ query }) {
    if (!query.page) query.page = '0'
    return query.query != null && !isNaN(parseInt(query.page, 10))
  }
}
</script>
