<template>
    <v-card class="pacient-card" outlined>
        <v-card-title class="text-center text-truncate titlu">{{ nume }}</v-card-title>
        <v-card-subtitle class="text-center">Telefon</v-card-subtitle>
        <v-card-text class="text-center">{{ telefon }}</v-card-text>
        <v-card-actions class="d-flex justify-center">
            <v-btn class="btnAfiseaza" @click="$emit('afiseazaDetaliiPacient', pacientId)">Detalii</v-btn>
            <v-btn class="btnEditeaza" @click="$emit('editeazaPacient', pacientId)">Editeaza</v-btn>
            <v-btn class="btnSterge" @click="$emit('stergePacient', pacientId)">Sterge</v-btn>
        </v-card-actions>
    </v-card>
</template>
  
<script>

export default ({
    props: {
        nume: String,
        telefon: String,
        pacientId: {
            type: String,
            required: true
        },
    },

    setup(props) {

    },
});
</script>

<style scoped>
.pacient-card {
    border: 0.5rem solid #dddddd;
    padding: 1.25rem;
    margin: 0.625rem;
    border-radius: 0.5rem;
    max-width: 22rem;
    min-width: 22rem;
    background-color: #F2EAD3;
}

.titlu {
    color: #0A1D56;
}

.btnAfiseaza {
    background-color: #5588A3;
    color: #FFFFFF;
}

.btnEditeaza {
    background-color: #145374;
    color: #FFFFFF;
}

.btnSterge {
    background-color: #00334E;
    color: #FFFFFF;
}
</style>

  