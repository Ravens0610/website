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
      <v-spacer />
      <v-row align="center">
        <v-text-field
          v-model="searchbox"
          @click:append="search"
          placeholder="Search"
          single-line
          append-icon="mdi-magnify"
          color="white"
          hide-details
        />
      </v-row>
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
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        }
      ],
      miniVariant: false,
      mini: false,
      right: true,
      rightDrawer: false,
      title: 'Explore Videos'
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
