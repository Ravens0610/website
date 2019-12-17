<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :mini-variant.sync="mini"
      :clipped="clipped"
      fixed
      app
    >
      <template v-slot:prepend>
        <v-list v-if="$store.$auth.loggedIn">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="avatarLink" />
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item link two-line>
            <v-list-item-content>
              <v-list-item-title class="title">{{
                user.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-text-field
        v-model="searchbox"
        @click:append="search"
        placeholder="Search"
        single-line
        append-icon="mdi-magnify"
        color="white"
        hide-details
      />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019 NeroVi Teams</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      searchbox: '',
      loggedIn: this.$store.$auth.loggedIn,
      user: this.$store.$auth.user,
      avatarLink: this.$store.$auth.loggedIn
        ? `/api/v1/auth/avatar?id=${this.$store.$auth.user.id}`
        : null,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        }
      ],
      miniVariant: false,
      mini: false
    }
  },
  methods: {
    search() {
      if (this.searchbox.length > 0)
        this.$router.push('/search?query=' + this.searchbox)
    }
  }
}
</script>
