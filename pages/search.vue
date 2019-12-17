<template>
  <v-layout column justify-left align-left>
    <v-flex xs12 sm12 md12>
      <v-card v-for="(video, index) in videos" :key="index">
        <v-card-title>{{ video.title }}</v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  async asyncData({ $axios, query }) {
    if (!query.page) query.page = '0'
    const { data } = await $axios.get(
      '/api/v1/videos/search?query=' + query.query + '&page=' + query.page
    )
    return {
      videos: data,
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
