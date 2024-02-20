<template>
    <v-container>
        <v-dialog v-model="isEditPacientDialogOpen" persistent max-width="600px">
            <v-card color="#E4DCCF">
                <v-card-title class="headline titluFereastra">Editare pacient</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <label class="eticheta">Nume</label>
                                <v-text-field :value="pacient.nume" prepend-icon="mdi-account" readonly
                                    disabled></v-text-field>
                                <label class="eticheta">Gen</label>
                                <v-text-field v-model="pacient.gen" prepend-icon="mdi-gender-male-female" readonly
                                    disabled></v-text-field>
                                <label class="eticheta">Data nasterii</label>
                                <v-text-field v-model="pacient.dataNasterii" prepend-icon="mdi-calendar" readonly
                                    disabled></v-text-field>
                                <label class="eticheta">Telefon</label>
                                <v-text-field v-model="pacient.telefon" prepend-icon="mdi-phone"
                                    :rules="reguliValidare.telefon"></v-text-field>
                                <label class="eticheta">Adresa</label>
                                <v-text-field v-model="pacient.adresa" prepend-icon="mdi-home"
                                    :rules="reguliValidare.adresa"></v-text-field>
                                <label class="eticheta">Istoric medical</label>
                                <v-text-field v-model="pacient.istoricMedical" prepend-icon="mdi-heart-pulse"
                                    :rules="reguliValidare.istoricMedical"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn class="btnActiune" @click="updatePacient">Salvează</v-btn>
                    <v-btn class="btnActiune" @click="isEditPacientDialogOpen = false">Anulează</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar class="snackbar" v-model="snackbar.show" :color="snackbar.color" :timeout="1000">
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
        pacientId: {
            type: String,
            required: true
        },
    },
    setup(props, { emit }) {
        const isEditPacientDialogOpen = props.modelValue
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

        const updatePacient = async () => {
            if (props.doctorId && props.pacientId) {
                try {
                    const user = auth.currentUser
                    if (!user) {
                        throw new Error('Autentificare necesara pe client')
                    }
                    const token = await user.getIdToken()

                    const response = await fetch(`http://localhost:8080/updatePacient/mediciFamilie/${props.doctorId}/pacienti/${props.pacientId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(pacient.value)
                    })

                    if (!response.ok) {
                        const errorResponse = await response.json()
                        const errorMessage = getHTTPErrorMessage(response.status, errorResponse.message)
                        throw new Error(errorMessage)
                    }

                    snackbar.value = {
                        show: true,
                        message: 'Datele pacientului au fost actualizate cu succes.',
                        color: 'success'
                    }
                    setTimeout(() => {
                        emit('pacientEditat')
                        isEditPacientDialogOpen.value = false
                    }, 1000)
                } catch (error) {
                    console.error("Eroare la actualizarea datelor pacientului: ", error)
                    snackbar.value = {
                        show: true,
                        message: error.message,
                        color: 'error'
                    }
                }
            }
        }

        onMounted(fetchPacientDetails)

        return {
            pacient,
            isEditPacientDialogOpen,
            reguliValidare,
            updatePacient,
            snackbar
        }
    }
};
</script>

<style scoped>
@import url('../assets/fonts.css');
.v-text-field {
  height: 3.7rem; 
}

.eticheta {
    color: #665A48;
    font-weight: bold;
    font-size: 1rem;
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