<template>
    <v-select class="dropdown" :items="medici" item-title="nume" item-value="id" label="Selecteaza un medic"
        v-model="selectedDoctorId"></v-select>
</template>
  
<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';

export default {
    props: {
        
    },
    setup(props, { emit }) {
        const medici = ref([])
        const selectedDoctorId = ref(null)
        let isComponentMounted = true

        const fetchMedici = async () => {
            try {
                const response = await fetch('http://localhost:8080/read/mediciFamilieGeneral')
                if (!response.ok) {
                    throw new Error('Eroare la fetch')
                }
                const mediciData = await response.json()
                if (isComponentMounted) {
                    medici.value = mediciData || [] // Daca nu sunt date pun un array gol
                    await nextTick() // Pentru a asteapta actualizarile DOM
                }
            } catch (error) {
                console.error('Eroare la incarcarea medicilor:', error)
                if (isComponentMounted) {
                    medici.value = [];
                }
            }
        };

        onMounted(fetchMedici)
        onUnmounted(() => {
            isComponentMounted = false
        })

        watch(selectedDoctorId, (newId, oldId) => {
            if (newId !== oldId) {
                emit('doctorSelected', newId);
            }
        });

        return { medici, selectedDoctorId }
    }
};
</script>

<style scoped>
.dropdown {
    margin-top: 15px;
}
</style>
  