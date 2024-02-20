<template>
    <v-container>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card min-width="400px" min-height="400px" color="#FFF2D8">
                <v-card-actions class="d-flex justify-center titlu">
                    <v-card-title>Sign up</v-card-title>
                </v-card-actions>
                <v-form @submit.prevent="handleSubmit">
                    <v-card-text>
                        <v-label class="my-label">Username</v-label>
                        <v-text-field class='my-text-field' type="text" name="username" v-model="username"
                            :rules="validationRules.username" prepend-icon="mdi-account"></v-text-field>
                        <v-label class="my-label">Email</v-label>
                        <v-text-field class='my-text-field' type="email" name="email" v-model="email"
                            :rules="validationRules.email" prepend-icon="mdi-email"></v-text-field>
                        <v-label class="my-label">Password</v-label>
                        <v-text-field class='my-text-field' type="password" name="password" v-model="password"
                            :rules="validationRules.password" prepend-icon="mdi-lock"></v-text-field>
                        <v-label class="my-label">Confirm password</v-label>
                        <v-text-field class='my-text-field' type="password" name="passwordConfirm" v-model="passwordConfirm"
                            :rules="[validatePasswordConfirm]" prepend-icon="mdi-lock"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-center">
                        <v-btn class="button-login" type="submit">Sign up</v-btn>
                    </v-card-actions>
                </v-form>
                <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-center">
                    <v-label>Already have an account?
                        <span @click="$emit('showLogin')">Log in</span>
                    </v-label>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar class="snackbar" v-model="snackbar.show" :timeout="1500" :color="snackbar.color">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { validationRules } from '@/utils/validateRulesSignUp.js'

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },

    setup(props, { emit }) {
        const username = ref('')
        const email = ref('')
        const password = ref('')
        const passwordConfirm = ref('')

        const dialog = ref(props.modelValue)
        const error = ref(null)
        const snackbar = ref({
            show: false,
            message: '',
            color: 'success'
        })

        const store = useStore()

        const validatePasswordConfirm = value => {
            if (!value) {
                return 'Confirmarea parolei este obligatorie.'
            } else if (value !== password.value) {
                return 'Parola nu se potrivește cu cea anterioară!'
            }
            return true
        }

        // Urmaresc propietatea modelValue primita prin props
        watch(() => props.modelValue, (newVal) => {
            // Actualizez variabila locala dialog cu noua valoare a modelValue
            dialog.value = newVal
        })

        // Informez componenta parinte despre schimbare
        watch(dialog, (newVal) => {
            if (newVal === false) {
                resetForm()
            }
            // Verifica dacă diferit de props.modelValue
            if (newVal !== props.modelValue) {
                // Emit un eveniment pentru a sincroniza modelValue cu valoarea dialog
                emit('update:modelValue', newVal)
            }
        })

        const handleSubmit = async () => {
            if (email.value && password.value && username.value && password.value === passwordConfirm.value) {
                try {
                    const isUnique = await store.dispatch('isUsernameUniqueAction', username.value);
                    if (!isUnique) {
                        throw new Error('Numele de utilizator este deja folosit.');
                    }

                    await store.dispatch('signup', {
                        username: username.value,
                        email: email.value,
                        password: password.value
                    })
                    snackbar.value = {
                        show: true,
                        message: 'Inregistrarea a fost realizata cu succes!',
                        color: 'success'
                    }
                    setTimeout(() => {
                        dialog.value = false
                        snackbar.value.show = false
                    }, 1000)
                } catch (err) {
                    error.value = err.message;
                    setTimeout(() => {
                        error.value = null;
                    }, 2000);
                }
            } else {
                error.value = "Te rog sa completezi toate campurile si sa te asiguri ca parolele se potrivesc.";
            }
        }

        const resetForm = () => {
            username.value = ''
            email.value = ''
            password.value = ''
            passwordConfirm.value = ''
            error.value = null
        }

        return {
            username, email, password, passwordConfirm,
            error, validationRules, validatePasswordConfirm,
            handleSubmit, dialog, snackbar
        }
    }
}
</script>

<style scoped>
@import url('../assets/fonts.css');

.my-label {
    padding-left: 40px;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
}

.my-text-field {
    height: 80px;
}

.button-login {
    width: 40%;
    background-color: #555843;
    color: #ffffff;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
}

.titlu {
    text-align: center;
    color: #27374D;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    background-color: #DED0B6;
}
</style>