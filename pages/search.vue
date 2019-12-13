<template>
  <v-layout column justify-left align-left>
    <v-flex xs12 sm12 md12>
      <v-card>
        <!-- TODO: search -->
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  async asyncData({ $axios, query }) {
    if (typeof query.page === 'undefined') query.page = 0
    const videos = await $axios.get(
      `/api/v1/videos/search?query=${query.query}&page=${query.page}`
    )
    return { videos }
  },
  validate({ query }) {
    return query.query != null
  }
}
</script>
