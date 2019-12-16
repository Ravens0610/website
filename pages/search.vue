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
  validate({ query }) {
    return query.query != null
  }
}
</script>
