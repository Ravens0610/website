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
            <v-list-item-title class="title">{{ user.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
    <v-list :dense="miniVariant" nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
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
    <template v-slot:append>
      <v-list v-if="!$store.$auth.loggedIn" :dense="miniVariant" nav>
        <v-list-item to="/user/login" link>
          <v-list-item-content>
            <v-list-item-title>Log In</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/user/register" link>
          <v-list-item-content>
            <v-list-item-title>Register Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'Navigation',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
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
