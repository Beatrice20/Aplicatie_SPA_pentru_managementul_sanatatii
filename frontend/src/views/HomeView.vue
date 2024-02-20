<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h1 my-4 titlu-principal">Bine ați venit la Healthcare Management</div>
      </v-col>
    </v-row>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="8">
        <div class="text-subtitle-1 subtitlu">Centralizarea profesională a îngrijirii medicale</div>
        <br>
        <p class="text-body-1 paragraph">
          Platforma noastră este concepută pentru a simplifica organizarea și accesul la informațiile medicilor și
          pacienților, facilitând o gestionare eficace a îngrijirii de sănătate. Fiecare medic poate urmări cu ușurință
          pacienții săi, în timp ce menține o evidență clară și structurată.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="image-column">
        <v-img src="@/assets/images/medical2.jpg" alt="Medical Image" class="mx-auto my-image" contain></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex'
import AddPatient from '@/components/AddPatient.vue'

// Components
export default defineComponent({
  components: {
    AddPatient
  },
  setup() {
    const store = useStore()
    const showAddPatientDialog = ref(false)

    return {
      user: computed(() => store.state.user),
      showAddPatientDialog
    }

  }
});
</script>

<style scoped>
@import url('../assets/fonts.css');

.titlu-principal {
  font-family: "Domine", serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  color: #35a0ec;
  font-size: 5.5rem !important;
}

.subtitlu {
  color: #27374D;
  font-weight: bold;
  font-optical-sizing: auto;
  font-size: 1.5rem !important;
  font-style: italic;
}

.paragraph {
  font-optical-sizing: auto;
  font-size: 1.2rem !important;
  max-width: 45rem;
  text-align: justify;
  color: #656565;
  line-height: 2em;
}

.my-image {
  position: absolute;
  top: 65%;
  right: 2%;
  transform: translateY(-50%);
  width: 100vw;
  max-width: 35rem;
  height: auto; 
}
</style>
