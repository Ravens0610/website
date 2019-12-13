<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          Register User
        </v-card-title>
        <v-form method="post">
          <v-card-text></v-card-text>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  middleware: 'user-guest',
  data() {
    return {
      username: '',
      password: '',
      email: ''
    }
  },
  methods: {
    async register() {
      try {
        await this.$axios.post('/api/v1/user/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })

        await this.$auth.loginWith('local', {
          email: this.email,
          password: this.password
        })

        this.$router.push('/user')
      } catch (ex) {}
    }
  }
}
</script>
