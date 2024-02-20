<template>
    <v-container>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card color="#E4DCCF">
                <v-card-title class="headline titluFereastra">Adaugare pacient</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nume" prepend-icon="mdi-account" v-model="pacient.nume"
                                    :rules="reguliValidare.nume"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Telefon" prepend-icon="mdi-phone" v-model="pacient.telefon"
                                    :rules="reguliValidare.telefon"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select :items="['Masculin', 'Feminin']" label="Gen" prepend-icon="mdi-gender-male-female"
                                    v-model="pacient.gen"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Data nasterii" prepend-icon="mdi-calendar"
                                    v-model="pacient.dataNasterii" :rules="reguliValidare.data"
                                    placeholder="yyyy-mm-dd"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Adresa" prepend-icon="mdi-home" v-model="pacient.adresa"
                                    :rules="reguliValidare.adresa"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Istoric medical" prepend-icon="mdi-heart-pulse"
                                    v-model="pacient.istoricMedical" :rules="reguliValidare.istoricMedical"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn class="btnActiune" text @click="adaugaPacient">Adauga</v-btn>
                    <v-btn class="btnActiune" text @click="dialog = false">Anuleaza</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar class="snackbar" v-model="snackbar.show" :color="snackbar.color" :timeout="1500">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import { ref, watch } from 'vue'
import { reguliValidare } from '@/utils/validationRulesPacient'
import { validateData } from '@/utils/validateData'
import { getHTTPErrorMessage } from '@/utils/httpErrors'
import { auth } from '@/firebase/config.js'

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        doctorId: {
            type: String,
            required: true
        }
    },
    setup(props, { emit }) {
        const dialog = ref(props.modelValue)
        const pacient = ref({
            nume: '',
            telefon: '',
            gen: '',
            dataNasterii: '',
            adresa: '',
            istoricMedical: '',
        })
        const snackbar = ref({
            show: false,
            message: '',
            color: 'success'
        })

        watch(() => props.modelValue, (newVal) => {
            dialog.value = newVal
        })

        watch(dialog, (newVal) => {
            if (newVal !== props.modelValue) {
                emit('update:modelValue', newVal)
            }
        })

        const adaugaPacient = async () => {
            try {
                if (!props.doctorId) {
                    throw new Error('ID-ul medicului lipseste sau este invalid')
                }

                const esteValid = validateData(pacient.value, reguliValidare)
                if (!esteValid) {
                    return
                }

                const user = auth.currentUser
                if (!user) {
                    throw new Error('Autentificare necesara pe client')
                }
                const token = await user.getIdToken()

                const response = await fetch(`http://localhost:8080/createPacient/mediciFamilie/${props.doctorId}/pacienti`, {
                    method: 'POST',
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

                const data = await response.json()
                pacient.value = data
                emit('pacientAdaugat', data)
                snackbar.value = {
                    show: true,
                    message: 'Pacientul a fost adaugat cu succes.',
                    color: 'success'
                }
                resetForm()
                dialog.value = false
                snackbar.value = {
                    show: true,
                    message: 'Pacientul a fost adaugat cu succes.',
                    color: 'success'
                }
            } catch (error) {
                console.error('Eroare la adaugarea pacientului:', error)
                snackbar.value = {
                    show: true,
                    message: error.message,
                    color: 'error'
                }
            }
        }

        const resetForm = () => {
            pacient.value = {
                nume: '',
                telefon: '',
                gen: '',
                dataNasterii: '',
                adresa: '',
                istoricMedical: '',
            }
        }

        return { dialog, pacient, adaugaPacient, reguliValidare, snackbar }
    }
}
</script>

<style scoped>
@import url('../assets/fonts.css');

.v-text-field {
  height: 3.7rem; 
}

.titluFereastra {
    color: #27374D;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
}

.btnActiune {
    width: 20%;
    background-color: #555843;
    color: #ffffff;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    align-items: center;
}
</style>