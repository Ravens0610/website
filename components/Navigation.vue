<template>
  <v-navigation-drawer
    v-model="value"
    :fixed="fixed"
    :permanent="permanent"
    :clipped="clipped"
    :mini-variant="miniVariant"
    :expand-on-hover="expandOnHover"
    app
  >
    <template v-slot:prepend>
      <v-list v-if="$store.$auth.loggedIn" :dense="miniVariant" nav>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="avatarLink" />
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item link two-line to="/user">
          <v-list-item-content>
            <v-list-item-title class="title">{{
              user.username
            }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
    <v-divider />
    <v-list :dense="miniVariant" nav>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" link>
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list v-if="!$store.$auth.loggedIn" :dense="miniVariant" nav>
      <v-list-item
        v-for="(item, i) in appendUserlessItems"
        :key="i"
        :to="item.to"
        link
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
</template>
<script>
export default {
  name: 'Navigation',
  props: {
    clipped: {
      type: Boolean,
      default() {
        return false
      }
    },
    miniVariant: {
      type: Boolean,
      default() {
        return false
      }
    },
    permanent: {
      type: Boolean,
      default() {
        return false
      }
    },
    fixed: {
      type: Boolean,
      default() {
        return false
      }
    },
    expandOnHover: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      value: null,
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
      appendUserlessItems: [
        {
          icon: 'mdi-account-plus',
          title: 'Register User',
          to: '/user/register'
        },
        {
          icon: 'mdi-login',
          title: 'Log In',
          to: '/user/login'
        }
      ]
    }
  },
  methods: {
    change_value(value) {
      this.$emit('update:value', value)
    }
  }
}
</script>
