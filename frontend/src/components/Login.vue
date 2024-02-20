<template>
    <v-container>
        <v-dialog v-model="dialog" max-width="400px">
            <v-card color="#FFF2D8">
                <v-card-actions class="d-flex justify-center title">
                    <v-card-title>Log in</v-card-title>
                </v-card-actions>
                <v-form @submit.prevent="handleLogin">
                    <v-card-text>
                        <v-label class="my-label">Email</v-label>
                        <v-text-field class='my-text-field' type="email" name="email" v-model="email"
                            :rules="[rules.required]" prepend-icon="mdi-email"></v-text-field>
                        <v-label class="my-label">Password</v-label>
                        <v-text-field class='my-text-field' :type="showPassword ? 'text' : 'password'" name="password"
                            v-model="password" :rules="[rules.required]" prepend-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append-inner="togglePasswordVisibility"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-center">
                        <v-btn class="button-login" type="submit">Log in</v-btn>
                    </v-card-actions>
                </v-form>
                <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-center">
                    <v-label>Don't have an account yet?
                        <span @click="$emit('showSignup')">Sign up</span>
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
import { useRouter } from 'vue-router'

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const email = ref('')
        const password = ref('')

        const showPassword = ref(false)
        const error = ref(null)
        const dialog = ref(props.modelValue)
        const snackbar = ref({
            show: false,
            message: '',
            color: 'success'
        })

        const store = useStore()
        const router = useRouter()

        const rules = {
            required: value => !!value || 'Obligatoriu'
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

        const handleLogin = async () => {
            error.value = ''
            if (email.value && password.value) {
                try {
                    await store.dispatch('login', {
                        email: email.value,
                        password: password.value
                    });
                    snackbar.value = {
                        show: true,
                        message: 'Autentificare realizata cu succes. Vei fi redirectionat in dashboard!',
                        color: 'success'
                    }
                    setTimeout(() => {
                        dialog.value = false
                        snackbar.value.show = false
                        router.push('/dashboard')
                    }, 1000)
                } catch (err) {
                    error.value = err.message
                    setTimeout(() => {
                        error.value = null;
                    }, 3000)
                }
            } else {
                error.value = "Completeaza toate campurile."
                setTimeout(() => {
                    error.value = null;
                }, 3000)
            }
        }

        const togglePasswordVisibility = () => {
            showPassword.value = true
            setTimeout(() => {
                showPassword.value = false
            }, 2000)
        }

        const resetForm = () => {
            email.value = ''
            password.value = ''
            error.value = null
        }

        return {
            dialog,
            email, password, rules,
            showPassword, togglePasswordVisibility,
            handleLogin,
            error, snackbar
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

.title {
    text-align: center;
    color: #27374D;
    font-family: "Domine", serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    background-color: #DED0B6;
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