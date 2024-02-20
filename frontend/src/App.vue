<template>
  <v-app class="background">
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: { Navbar }
}
</script>

<style scoped>
.background{
  background-color:#F5F5F5;
}
</style>
