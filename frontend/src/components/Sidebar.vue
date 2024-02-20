<template>
    <v-navigation-drawer app permanent>
        <v-list-item class="py-8">
            <div class="d-flex justify-center">
                <v-list-item-title class="headline mb-1 mesaj">
                    Bine ai venit{{ authIsReady && user ? ', ' + user.username : '' }}
                </v-list-item-title>
            </div>
        </v-list-item>
        <v-list-item link class="my-2 elementLista" @click="toggleShowMedici(true)">
            <div class="d-flex align-center">
                <v-icon class="white--text mr-2">mdi-account-search</v-icon>
                <v-list-item-title class="white--text">Vizualizează medici</v-list-item-title>
            </div>
        </v-list-item>
        <v-list-item link class="my-2 elementLista" @click="toggleShowPacienti(true)">
            <div class="d-flex align-center">
                <v-icon class="white--text mr-2">mdi-account-search</v-icon>
                <v-list-item-title class="white--text">Vizualizează pacienti</v-list-item-title>
            </div>
        </v-list-item>
    </v-navigation-drawer>
</template>

<script>
import { useStore } from 'vuex';
import { computed, inject } from 'vue'

export default {
    setup() {
        const store = useStore()
        const toggleShowMedici = inject('toggleShowMedici')
        const toggleShowPacienti = inject('toggleShowPacienti')

        const user = computed(() => store.state.user)
        const authIsReady = computed(() => store.state.authIsReady)

        return {
            user,
            authIsReady,
            toggleShowMedici,
            toggleShowPacienti
        };
    }
};
</script>
  
<style scoped>
@import url('../assets/fonts.css');

.v-navigation-drawer {
    background-color: #35a0ec;
}

.mesaj {
    white-space: normal;
    word-wrap: break-word;
    align-items: center;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-size: 1.2rem;
    line-height: 1.5em;
    color:#FFFFFF;
}

.v-icon {
    color: #FFFFFF;
}

.v-list-item-title {
    color: #FFFFFF;
}

.elementLista:hover {
  background-color: #286997; 
  color: #ffffff; 
}

</style>
  