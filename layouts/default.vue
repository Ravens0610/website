<template>
  <v-app dark>
    <!-- Desktop -->
    <v-card>
      <navigation
        v-model="desktopDrawer"
        class="nav-desktop"
        permanent
        expand-on-hover
        mini-variant
        fixed
      />
    </v-card>
    <!-- Mobile -->
    <navigation v-model="mobileDrawer" />
    <v-app-bar class="nav-mobile" fixed app>
      <v-app-bar-nav-icon @click.stop="mobileDrawer = !mobileDrawer" />
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
    <v-footer app>
      <span>&copy; 2019 NeroVi Teams</span>
    </v-footer>
  </v-app>
</template>
<script>
import Navigation from '@/components/Navigation.vue'

export default {
  components: {
    Navigation
  },
  data() {
    return {
      desktopDrawer: null,
      mobileDrawer: false,
      searchbox: ''
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
<style>
@media only screen and (max-width: 959px) {
  .nav-mobile {
    display: block;
  }

  .nav-desktop {
    display: none !important;
  }
}

@media only screen and (min-width: 960px) {
  .nav-mobile {
    display: none !important;
  }

  .nav-desktop {
    display: block;
  }
}
</style>
