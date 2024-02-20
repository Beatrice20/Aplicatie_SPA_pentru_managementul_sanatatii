<template>
    <v-container>
        <v-dialog v-model="isEditDialogOpen" persistent max-width="600px">
            <v-card color="#E4DCCF">
                <v-card-title class="headline titluFereastra">Editare medic</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <label class="eticheta">Nume</label>
                                <v-text-field :value="medic.nume" prepend-icon="mdi-account" readonly
                                    disabled></v-text-field>
                                <label class="eticheta">Email</label>
                                <v-text-field v-model="medic.email" prepend-icon="mdi-email"
                                    :rules="reguliValidare.email"></v-text-field>
                                <label class="eticheta">Telefon</label>
                                <v-text-field v-model="medic.telefon" prepend-icon="mdi-phone"
                                    :rules="reguliValidare.telefon"></v-text-field>
                                <label class="eticheta">Adresa cabinet</label>
                                <v-text-field v-model="medic.adresaCabinet" prepend-icon="mdi-home"
                                    :rules="reguliValidare.adresaCabinet"></v-text-field>
                                <label class="eticheta">Program de lucru</label>
                                <v-text-field v-model="medic.programLucru" prepend-icon="mdi-clock"
                                    :rules="reguliValidare.programLucru"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn class="btnActiune" @click="updateMedic">Salveaza</v-btn>
                    <v-btn class="btnActiune" @click="isEditDialogOpen = false">Anuleaza</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar class="snackbar" v-model="snackbar.show" :color="snackbar.color" timeout="1000">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>
  

<script>
import { ref, onMounted } from "vue"
import { auth } from "@/firebase/config.js"
import { reguliValidare } from '@/utils/validationRules.js'
import { getHTTPErrorMessage } from "@/utils/httpErrors"

export default {
    props: {
        modelValue: {
            type: Object,
            default: false,
        },
        doctorId: {
            type: String,
            required: true
        },
    },
    setup(props, { emit }) {
        const isEditDialogOpen = props.modelValue
        const medic = ref({
            nume: '',
            telefon: '',
            email: '',
            adresaCabinet: '',
            programLucru: '',
        })
        const snackbar = ref({
            show: false,
            message: '',
            color: 'success'
        })

        const fetchDoctorDetails = async () => {
            try {
                const user = auth.currentUser
                if (!user) {
                    throw new Error('Autentificare necesara pe client')
                }
                const token = await user.getIdToken()

                const response = await fetch(`http://localhost:8080/read/mediciFamilie/${props.doctorId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    const errorResponse = await response.json()
                    const errorMessage = getHTTPErrorMessage(response.status, errorResponse.message)
                    throw new Error(errorMessage)
                }
                const data = await response.json()
                medic.value = data
            } catch (error) {
                snackbar.value = {
                    show: true,
                    message: error.message,
                    color: 'error'
                }
            }
        }

        onMounted(fetchDoctorDetails)

        const updateMedic = async () => {
            if (props.doctorId) {
                try {
                    const user = auth.currentUser
                    if (!user) {
                        snackbar.value = {
                            show: true,
                            message: 'Autentificare necesara pe client',
                            color: 'error'
                        }
                        return
                    }
                    const token = await user.getIdToken()

                    const response = await fetch(`http://localhost:8080/update/mediciFamilie/${props.doctorId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(medic.value)
                    })

                    if (!response.ok) {
                        const errorResponse = await response.json()
                        console.error("Eroare HTTP: ", response.status, response.statusText, errorResponse)
                        const errorMessage = getHTTPErrorMessage(response.status, errorResponse.message)
                        throw new Error(errorMessage)
                    }
                    snackbar.value = {
                        show: true,
                        message: 'Datele medicului au fost actualizate cu succes',
                        color: 'success'
                    }
                    setTimeout(() => {
                        emit('medicEditat', props.doctorId)
                        isEditDialogOpen.value = false
                    }, 1000)
                } catch (error) {
                    console.error("Eroare la actualizarea medicului: ", error)
                    snackbar.value = {
                        show: true,
                        message: error.message,
                        color: 'error'
                    }
                }
            }
        }

        return {
            medic,
            snackbar,
            isEditDialogOpen,
            reguliValidare,
            updateMedic
        }
    }
};
</script>

<style scoped>
@import url('../assets/fonts.css');

.eticheta {
    color: #665A48;
    font-weight: bold;
    font-size: 1em;
}

.titluFereastra {
    color: #27374D;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    margin-top: 0.625rem;
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