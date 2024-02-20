<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card color="#E4DCCF">
        <v-card-title class="headline titluFereastra">Adaugare medic</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nume" prepend-icon="mdi-account" v-model="medic.nume"
                    :rules="reguliValidare.nume"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Telefon" prepend-icon="mdi-phone" v-model="medic.telefon"
                    :rules="reguliValidare.telefon" maxlength="10" hint="Introduceți exact 10 cifre"
                    persistent-hint></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Email" prepend-icon="mdi-email" v-model="medic.email"
                    :rules="reguliValidare.email"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Adresa cabinet" prepend-icon="mdi-home" v-model="medic.adresaCabinet"
                    :rules="reguliValidare.adresaCabinet"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Program de Lucru" prepend-icon="mdi-clock" v-model="medic.programLucru"
                    :rules="reguliValidare.programLucru"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn class="btnActiune" text @click="adaugaMedic">Adauga</v-btn>
          <v-btn class="btnActiune" text @click="dialog = false">Anuleaza</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar class="snackbar" v-model="snackbar.show" :color="snackbar.color" :timeout="2000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, watch } from 'vue'
import { reguliValidare } from '@/utils/validationRules.js'
import { validateData } from '@/utils/validateData.js'
import { auth } from '@/firebase/config.js'
import { getHTTPErrorMessage } from '@/utils/httpErrors.js'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const dialog = ref(props.modelValue)
    const medic = ref({
      nume: '',
      telefon: '',
      email: '',
      adresaCabinet: '',
      programLucru: ''
    })
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    // Necesar pentru a asculta cand parintele incearca sa deschida fereastra de adaugare
    watch(() => props.modelValue, (newVal) => {
      dialog.value = newVal
    })

    // Comunica inapoi catre parinte cand dialogul a fost inchis
    watch(dialog, (newVal) => {
      if (newVal !== props.modelValue) {
        emit('update:modelValue', newVal)
      }
    })

    const adaugaMedic = async () => {
      try {
        if (!validateData(medic.value, reguliValidare)) {
          snackbar.value = {
            show: true,
            message: 'Validarea datelor a esuat!',
            color: 'error'
          }
          return
        }

        const user = auth.currentUser
        if (!user) {
          throw new Error('Autentificare necesara pe client')
        }
        const token = await user.getIdToken()

        const response = await fetch('http://localhost:8080/createMedic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(medic.value)
        })

        if (!response.ok) {
          const errorResponse = await response.json()
          const errorMessage = getHTTPErrorMessage(response.status, errorResponse.message)
          throw new Error(errorMessage)
        } else {
            const data = await response.json()
            dialog.value = false
            snackbar.value = {
              show: true,
              message: 'Medic adaugat cu succes!',
              color: 'success'
            }
            emit('medicAdaugat', data)
            resetForm()
        }
      } catch (error) {
          snackbar.value = {
            show: true,
            message: error.message,
            color: 'error'
          }
      }
    }

    const resetForm = () => {
      medic.value = {
        nume: '',
        telefon: '',
        email: '',
        adresaCabinet: '',
        programLucru: ''
      }
    }

    return { dialog, medic, adaugaMedic, reguliValidare, snackbar }
  },
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

.snackbar {
  font-family: "Domine", serif;
  font-optical-sizing: auto;
  font-weight: bold;
  font-style: normal;
  font-size: 1.5em;
  text-align: center;
  justify-content: center;
}
</style>

