<template>
  <v-app-bar app>
    <img id="my-icon" src="/patient.ico">
    <v-toolbar-title id="my-title">Healthcare Management</v-toolbar-title>
    <template v-if="authIsReady">
      <v-btn to="/">
        <v-icon left>mdi-home</v-icon>
        Home
      </v-btn>
      <v-btn to="/dashboard">
        <v-icon left>mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <template v-if="user">
        <v-btn @click="handleClick">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </template>
      <template v-else>
        <v-btn @click="showSignup = true">
          <v-icon left>mdi-account-plus</v-icon>
          Sign up
        </v-btn>
        <v-btn @click="showLogin = true">
          <v-icon left>mdi-login</v-icon>
          Log In
        </v-btn>
      </template>
    </template>
  </v-app-bar>
  <Login v-model="showLogin" @showSignup="openSignupDialog" />
  <Signup v-model="showSignup" @showLogin="openLoginDialog" />
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'

export default {
  components: {
    Login,
    Signup,
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const showLogin = ref(false)
    const showSignup = ref(false)

    const openLoginDialog = () => {
      showSignup.value = false;
      showLogin.value = true;
    }

    const openSignupDialog = () => {
      showLogin.value = false;
      showSignup.value = true;
    }

    const handleClick = () => {
      // Este declansata actiunea de logout
      store.dispatch('logout')
      router.push('/')
    }

    return {
      handleClick,
      user: computed(() => store.state.user),
      authIsReady: computed(() => store.state.authIsReady),
      showLogin,
      showSignup,
      openLoginDialog,
      openSignupDialog
    }
  }
}
</script>

<!-- scoped - stilurile puse de mine au prioritate fata de stilurile Vuetify-->
<style scoped>
@import url('../assets/fonts.css');

.v-app-bar {
  background-color: #DFD7BF;
  float: right;
  border-bottom: 0.25rem solid #E4DCCF;
}

#my-icon {
  padding-left: 0.3rem;
  height: 2.5rem;
  width: 2.5rem;
  margin-left: 0.8rem;
}

#my-title {
  font-size: 1.5rem;
  color: #35a0ec;
  font-family: "Salsa", cursive;
  font-weight: 500;
}

.v-btn {
  color: #35a0ec;
  font-family: "Domine", serif;
  font-optical-sizing: auto;
  font-weight: bold;
}
</style>