<template>
    <v-dialog v-model="isDetailsDialogOpen" persistent max-width="600px">
        <v-card color="#E4DCCF">
            <v-card-title class="headline titluFereastra">Detalii medic</v-card-title>
            <v-card-text>
                <v-list dense class="continut">
                    <v-list-item class="subheader">DATE GENERALE</v-list-item>
                    <v-list-item class="element"><strong>Nume: </strong> {{ medic.nume }}</v-list-item>
                    <v-list-item class="element"><strong>Program lucru: </strong>{{ medic.programLucru }}</v-list-item>
                    <v-list-item class="subheader">DETALII SUPLIMENTARE</v-list-item>
                    <v-list-item class="element"><strong>Telefon: </strong>{{ medic.telefon }}</v-list-item>
                    <v-list-item class="element"><strong>Email: </strong>{{ medic.email }}</v-list-item>
                    <v-list-item class="element"><strong>Adresa cabinet: </strong>{{ medic.adresaCabinet
                    }}</v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
                <v-btn class="btnInchide" @click="isDetailsDialogOpen = false">Inchide</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-snackbar class="snackbar" v-model="snackbar.show" :color="snackbar.color" :timeout="2000">
        {{ snackbar.message }}
    </v-snackbar>
</template>
  
<script>
import { ref, onMounted } from "vue"
import { auth } from "@/firebase/config.js"

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
        const isDetailsDialogOpen = props.modelValue
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

        // Ma asigur ca functia fetchDoctorDetails este apelata dupa ce componenta 
        // este complet montata si gata de interactiune
        onMounted(fetchDoctorDetails)

        return {
            medic,
            isDetailsDialogOpen,
            snackbar
        }
    }
};
</script>
  
<style scoped>
@import url('../assets/fonts.css');

.continut {
    background-color: #F2EAD3;
}

.element {
    margin-left: 1.5rem;
}

.titluFereastra {
    color: #27374D;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    margin-top: 0.625rem;
}

.subheader {
    color: #0A1D56;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 0.625rem 0;
}

.btnInchide {
    width: 10rem;
    background-color: #555843;
    color: #ffffff;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
}
</style>
  