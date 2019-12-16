<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          Legal Information
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <nuxt-link to="/legal/privacy">Privacy Policy</nuxt-link>
            </v-list-item>
            <v-list-item>
              <nuxt-link to="/legal/tos">Terms of Service</nuxt-link>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  head: () => ({
    title: 'Legal Information'
  })
}
</script>
