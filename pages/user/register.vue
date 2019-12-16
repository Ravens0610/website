<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          Register User
        </v-card-title>
        <v-form @submit.prevent="register">
          <v-card-text>
            <p>
              <b>Notice</b>: when registering, you adheer to our
              <NuxtLink to="/legal/tos">Term of Service</NuxtLink>
            </p>
            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>
            <v-text-field v-model="username" label="User Name" />
            <v-text-field v-model="email" label="E-Mail" type="email" />
            <v-text-field v-model="password" label="Password" type="password" />
            <v-menu
              ref="birthdayMenu"
              v-model="birthdayMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="birthday"
                  v-on="on"
                  label="Birthday"
                  prepend-icon="mdi-event"
                  readonly
                />
              </template>
              <v-date-picker
                ref="birthdayPicker"
                v-model="birthday"
                :max="new Date().toISOString().substr(0, 10)"
                @change="setBirthday"
                min="1950-01-01"
              />
            </v-menu>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="register" text>Register</v-btn>
          </v-card-actions>
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
      email: '',
      birthday: new Date().toISOString().substr(0, 10),
      error: null,
      birthdayMenu: false
    }
  },
  watch: {
    birthdayMenu(val) {
      val && setTimeout(() => (this.$refs.birthdayPicker.activePicker = 'YEAR'))
    }
  },
  methods: {
    async register() {
      try {
        await this.$axios.post('/api/v1/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          birthday: this.birthday
        })

        await this.$auth.loginWith('local', {
          email: this.email,
          password: this.password
        })

        this.$router.push('/user')
      } catch (ex) {
        this.error = ex.message
      }
    },
    setBirthday(date) {
      this.$refs.birthdayMenu.save(date)
    }
  }
}
</script>
