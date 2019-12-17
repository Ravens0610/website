<template>
  <v-card>
    <v-card-title class="headline">
      User Log In
    </v-card-title>
    <v-form @submit.prevent="login">
      <v-card-text>
        <v-alert v-if="error" type="error">
          {{ error }}
        </v-alert>
        <v-text-field v-model="email" label="E-Mail" type="email" />
        <v-text-field v-model="password" label="Password" type="password" />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="login" text>Log In</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
export default {
  middleware: 'user-guest',
  head: () => ({
    title: 'User Log In'
  }),
  data() {
    return {
      password: '',
      email: '',
      error: null
    }
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })

        this.$router.push('/user')
      } catch (ex) {
        this.error = ex.message
      }
    }
  }
}
</script>
