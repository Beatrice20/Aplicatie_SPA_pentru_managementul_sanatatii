<template>
    <v-container>
        <v-dialog v-model="isDeletePacientDialogOpen" persistent max-width="500px" max-height="500px">
            <v-card color="#E4DCCF">
                <v-card-title class="titluFereastra">Stergere pacient</v-card-title>
                <v-card-text class="mesaj text-center">
                    Sunteti sigur ca doriti sa eliminati pacientul
                    <strong>{{ pacient.nume }}</strong>?<br><br>
                    <span class="avertizare">ACEASTA ACTIUNE NU POATE FI ANULATA.</span>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn class="btnActiune" @click="confirmaStergere">Da</v-btn>
                    <v-btn class="btnActiune" @click="isDeletePacientDialogOpen = false">Nu</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar class="snackbar" v-model="snackbar.show" :color="snackbar.color" :timeout="1000">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>
  
<script>
import { onMounted, ref } from 'vue'
import { auth } from '@/firebase/config.js'
import { getHTTPErrorMessage } from '@/utils/httpErrors.js'

export default {
    props: {
        modelValue: {
            type: Object,
            required: true
        },
        doctorId: {
            type: String,
            required: true
        },
        pacientId: {
            type: String,
            required: true
        },
    },
    setup(props, { emit }) {
        const isDeletePacientDialogOpen = props.modelValue
        const pacient = ref({})
        const snackbar = ref({
            show: false,
            message: '',
            color: 'success'
        })

        const fetchPacientDetails = async () => {
            if (props.doctorId && props.pacientId) {
                try {
                    const user = auth.currentUser
                    if (!user) {
                        throw new Error('Autentificare necesara pe client')
                    }
                    const token = await user.getIdToken()
                    const response = await fetch(`http://localhost:8080/readPacientById/mediciFamilie/${props.doctorId}/pacienti/${props.pacientId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    if (!response.ok) {
                        const errorResponse = await response.json()
                        const errorMessage = getHTTPErrorMessage(response.status, errorResponse.message)
                        throw new Error(errorMessage);
                    }
                    const data = await response.json()
                    pacient.value = data
                } catch (error) {
                    console.error("Eroare la incarcarea detaliilor pacientului: ", error)
                    snackbar.value = {
                        show: true,
                        message: error.message,
                        color: 'error'
                    }
                }
            }
        }

        onMounted(fetchPacientDetails)

        const confirmaStergere = async () => {
            if (props.doctorId && props.pacientId) {
                try {
                    const user = auth.currentUser
                    if (!user) {
                        throw new Error('Autentificare necesara pe client')
                    }
                    const token = await user.getIdToken()

                    const response = await fetch(`http://localhost:8080/deletePacient/mediciFamilie/${props.doctorId}/pacienti/${props.pacientId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if (!response.ok) {
                        const errorResponse = await response.json()
                        const errorMessage = getHTTPErrorMessage(response.status, errorResponse.message)
                        throw new Error(errorMessage)
                    }

                    snackbar.value = {
                        show: true,
                        message: 'Pacientul a fost sters cu succes.',
                        color: 'success'
                    }
                    setTimeout(() => {
                        emit('pacientSters')
                        isDeletePacientDialogOpen.value = false
                    }, 1000)
                } catch (error) {
                    console.error("Eroare la stergerea pacientului: ", error)
                    snackbar.value = {
                        show: true,
                        message: error.message,
                        color: 'error'
                    }
                }
            }
        }

        return {
            isDeletePacientDialogOpen,
            pacient,
            confirmaStergere,
            snackbar
        }
    }
}
</script>

<style scoped>
@import url('../assets/fonts.css');

.titluFereastra {
    color: #27374D;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    margin-top: 0.625rem;
}

.avertizare {
    color: red;
    font-weight: bold;
}

.btnActiune {
    width: 20%;
    background-color: #555843;
    color: #ffffff;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
}
</style>
  