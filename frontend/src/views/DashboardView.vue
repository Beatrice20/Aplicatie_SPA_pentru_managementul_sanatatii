<template>
  <div class="pagina">
    <h1 class="titluPagina">DASHBOARD</h1>
    <Sidebar></Sidebar>

    <!-- Sectiunea pentru medici -->
    <v-container v-if="showMedici">
      <h1 class="subtitlu">Medici</h1>
      <v-container class="containerFunctiiMedici">
        <v-btn class="btnAdaugaMedic" @click="openAddDoctorDialog">
          <v-icon left>mdi-plus</v-icon>
          Adauga medic
        </v-btn>
        <v-select class="dropdownSortare" :items="criteriiSortare" item-title="text" item-value="value"
          label="Selecteaza criteriul de sortare" v-model="criteriuSelectat"></v-select>
      </v-container>
      <AddDoctor v-model="showAddDoctorDialog" @medicAdaugat="actualizeazaListaMediciDupaAdaugare" />
      <v-row class="carduri">
        <MedicCard v-for="medic in medici" :key="medic.id" :nume="medic.nume" :programLucru="medic.programLucru"
          :medicId="medic.id" @afiseazaDetalii="handleShowMedicDetails" @editeazaMedic="handleEditMedic"
          @stergeMedic="handleDeleteMedic" />
      </v-row>
      <v-dialog v-model="isDetailsDialogOpen" max-width="500px">
        <DoctorDetails :doctorId="selectedDoctorId" :modelValue="isOpenForDetails" />
      </v-dialog>
      <v-dialog v-model="isEditDialogOpen" max-width="500px">
        <EditDoctor :doctorId="selectedDoctorId" :modelValue="isOpenForEdit"
          @medicEditat="actualizeazaListaMediciDupaModificare" />
      </v-dialog>
      <v-dialog v-model="isDeleteDialogOpen" max-width="500px">
        <DeleteDoctor :doctorId="selectedDoctorId" :modelValue="isOpenForDelete"
          @medicSters="actualizeazaListaMediciDupaModificare" />
      </v-dialog>
    </v-container>

    <!-- Sectiunea pentru pacienti -->
    <v-container v-if="showPacienti">
      <h1 class="subtitlu">Pacienti</h1>
      <DropdownDoctor @doctorSelected="handleDoctorSelection" />
      <v-btn class="btnAdaugaPacient" @click="openAddPacientDialog">
        <v-icon left>mdi-plus</v-icon>
        Adauga pacient
      </v-btn>
      <AddPatient v-model="showAddPacientDialog" :doctorId="selectedDoctorId"
        @pacientAdaugat="actualizeazaPacientDupaModificare" />
      <v-row class="carduri">
        <PacientCard v-for="pacient in pacienti" :key="pacient.id" :nume="pacient.nume" :telefon="pacient.telefon"
          :pacientId="pacient.id" @afiseazaDetaliiPacient="handleShowPacientDetails" @editeazaPacient="handleEditPacient"
          @stergePacient="handleDeletePacient" />
      </v-row>
      <v-dialog v-model="isPacientDetailsDialogOpen" max-width="500px">
        <PacientDetails :doctorId="selectedDoctorId" :pacientId="selectedPacientId"
          :modelValue="isPacientDetailsDialogComputed" />
      </v-dialog>
      <v-dialog v-model="isEditPacientDialogOpen" max-width="500px">
        <EditPacient :doctorId="selectedDoctorId" :pacientId="selectedPacientId" :modelValue="isEditPacientDialogComputed"
          @pacientEditat="actualizeazaPacientDupaModificare" />
      </v-dialog>
      <v-dialog v-model="isDeletePacientDialogOpen" max-width="500px">
        <DeletePacient :doctorId="selectedDoctorId" :pacientId="selectedPacientId"
          :modelValue="isDeletePacientDialogComputed" @pacientSters="actualizeazaPacientDupaModificare" />
      </v-dialog>
    </v-container>
  </div>
  <v-snackbar class="snackbar" v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import MedicCard from '@/components/MedicCard.vue'
import AddDoctor from '@/components/AddDoctor.vue'
import DoctorDetails from '@/components/DoctorDetails.vue'
import DeleteDoctor from '@/components/DeleteDoctor.vue'
import EditDoctor from '@/components/EditDoctor.vue'
import DropdownDoctor from '@/components/DropdownDoctor.vue'
import PacientCard from '@/components/PacientCard.vue'
import AddPatient from '@/components/AddPatient.vue'
import PacientDetails from '@/components/PacientDetails.vue'
import EditPacient from '@/components/EditPacient.vue'
import DeletePacient from '@/components/DeletePacient.vue'
import { calculeazaOreLucrate } from '@/utils/calculOreLucrate.js'
import { ref, onMounted, provide, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    Sidebar,
    MedicCard,
    AddDoctor,
    DoctorDetails,
    EditDoctor,
    DeleteDoctor,
    DropdownDoctor,
    PacientCard,
    AddPatient,
    PacientDetails,
    EditPacient,
    DeletePacient
  },

  setup() {
    const store = useStore()
    const snackbar = ref({
      show: false,
      message: '',
      color: 'error'
    })

    const medici = ref([])
    const showAddDoctorDialog = ref(false)
    const showMedici = ref(false)
    const selectedDoctorId = ref(null)
    const isDetailsDialogOpen = ref(false)
    const isOpenForDetails = computed(() => isDetailsDialogOpen)
    const isEditDialogOpen = ref(false)
    const isOpenForEdit = computed(() => isEditDialogOpen)
    const isDeleteDialogOpen = ref(false)
    const isOpenForDelete = computed(() => isDeleteDialogOpen)

    const criteriuSelectat = ref(null)
    const criteriiSortare = ref([
      { text: 'Nume A-Z', value: 'numeAZ' },
      { text: 'Nume Z-A', value: 'numeZA' },
      { text: 'Numar ore lucrate crescator', value: 'nrOreLucrateCresc' },
      { text: 'Numar ore lucrate descrescator', value: 'nrOreLucrateDesc' }
    ])

    const showPacienti = ref(false)
    const pacienti = ref([])
    const selectedPacientId = ref(null)
    const isPacientDetailsDialogOpen = ref(false)
    const isPacientDetailsDialogComputed = computed(() => isPacientDetailsDialogOpen)
    const isEditPacientDialogOpen = ref(false)
    const isEditPacientDialogComputed = computed(() => isEditPacientDialogOpen)
    const isDeletePacientDialogOpen = ref(false)
    const isDeletePacientDialogComputed = computed(() => isDeletePacientDialogOpen)
    const showAddPacientDialog = ref(false)

    // Functie pentru a controla afisarea dinamica a containerului cu date despre medici/pacienti
    const toggleShowMedici = (value) => {
      showMedici.value = value
      showPacienti.value = !value
      //Daca am comutat la afisare medici, lista pacientilor se reseteaza
      if (value) {
        pacienti.value = []
        selectedDoctorId.value = null
        criteriuSelectat.value = null
        fetchMedici()
      }
    }
    provide('toggleShowMedici', toggleShowMedici)

    const toggleShowPacienti = (value) => {
      showPacienti.value = value
      showMedici.value = !value
    }
    provide('toggleShowPacienti', toggleShowPacienti)

    const fetchMedici = async () => {
      try {
        const response = await fetch('http://localhost:8080/read/mediciFamilieGeneral')
        if (!response.ok) {
          throw new Error('Eroare la fetch')
        }
        const mediciData = await response.json()
        medici.value = mediciData
      } catch (error) {
        console.error('Eroare la incarcarea medicilor:', error)
        snackbar.value = {
            show: true,
            message: 'A aparut o eroare la incarcarea medicilor.',
            color: 'error'
         }
      }
    }
    onMounted(fetchMedici)

    const actualizeazaListaMediciDupaAdaugare = (medicNou) => {
      console.log("Medic nou adăugat:", medicNou)
      medici.value.push({
        id: medicNou.id,
        nume: medicNou.medicData.nume,
        programLucru: medicNou.medicData.programLucru
      })
      criteriuSelectat.value = null
    }

    const openAddDoctorDialog = () => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Trebuie sa fii autentificat pentru a adauga un medic in colectie!',
          color: 'error'
        }
        return
      }
      showAddDoctorDialog.value = true
    };

    const handleShowMedicDetails = (id) => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Trebuie să fii autentificat pentru a vedea detaliile medicului!',
          color: 'error'
        }
        return
      }
      selectedDoctorId.value = id
      console.log("Deschide fereastra de detalii", selectedDoctorId.value)
      isDetailsDialogOpen.value = true
    }

    const handleEditMedic = (id) => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Pentru a edita informatiile unui medic trebuie sa fi autentificat!',
          color: 'error'
        }
        return
      }
      selectedDoctorId.value = id
      console.log("Deschide fereastra pentru editat", selectedDoctorId.value)
      isEditDialogOpen.value = true
    }

    const handleDeleteMedic = (id) => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Nu poti efectua stergerea daca nu esti autentificat!',
          color: 'error'
        }
        return
      }
      selectedDoctorId.value = id
      console.log("Deschide fereastra pentru comfirmare stergere", selectedDoctorId.value)
      isDeleteDialogOpen.value = true
    }

    const actualizeazaListaMediciDupaModificare = () => {
      fetchMedici()
    }

    //Pacienti
    const fetchPacienti = async (selectedDoctorId) => {
      try {
        const response = await fetch(`http://localhost:8080/readPacientiGeneral/mediciFamilie/${selectedDoctorId}/pacienti`);
        if (response.ok) {
          const pacientiData = await response.json()
          if (pacientiData.length === 0) {
            snackbar.value = {
              show: true,
              message: 'Nu există pacienți in evidenta.',
              color: 'error'
            }
          }
          pacienti.value = pacientiData
        } else {
            throw new Error('Eroare la fetch pentru pacienti')
        }
      } catch (error) {
          console.error('Eroare la incarcarea pacientilor:', error)
          snackbar.value = {
            show: true,
            message: 'A aparut o eroare la incarcarea pacientilor.',
            color: 'error'
         }
      }
    }

    //Dropdown cu medicii
    const handleDoctorSelection = (doctorId) => {
      console.log("Handler-ul a fost apelat pentru doctorul cu id: ", doctorId);
      selectedDoctorId.value = doctorId; // Actualizează referința selectedDoctorId cu noul ID
      fetchPacienti(doctorId);
    }

    const openAddPacientDialog = () => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Trebuie sa fii autentificat pentru a adauga un pacient in colectie!',
          color: 'error'
        }
        return
      }
      if (!selectedDoctorId.value) {
        snackbar.value = {
          show: true,
          message: 'Trebuie sa selectezi medicul pentru care vrei sa adaugi pacientul!',
          color: 'error'
        }
        return
      }
      showAddPacientDialog.value = true
    };

    const handleShowPacientDetails = (pacientId) => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Trebuie să fii autentificat pentru a vedea detaliile pacientului!',
          color: 'error'
        }
        return
      }
      selectedPacientId.value = pacientId
      isPacientDetailsDialogOpen.value = true
    }

    const handleEditPacient = (pacientId) => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Trebuie sa te autentifi pentru a putea edita datele unui pacient!',
          color: 'error'
        }
        return
      }
      selectedPacientId.value = pacientId
      console.log("Deschide fereastra pentru editat", selectedPacientId.value)
      isEditPacientDialogOpen.value = true
    }

    const handleDeletePacient = (pacientId) => {
      const user = store.state.user
      if (!user) {
        snackbar.value = {
          show: true,
          message: 'Trebuie sa te autentifi pentru a putea edita datele unui pacient!',
          color: 'error'
        }
        return
      }
      selectedPacientId.value = pacientId
      console.log("Deschide fereastra pentru comfirmare stergere", selectedPacientId.value)
      isDeletePacientDialogOpen.value = true
    }

    const actualizeazaPacientDupaModificare = () => {
      fetchPacienti(selectedDoctorId.value)
    }

    const sorteaza = () => {
      switch (criteriuSelectat.value) {
        case 'numeAZ':
          medici.value.sort((a, b) => a.nume.localeCompare(b.nume))
          break
        case 'numeZA':
          medici.value.sort((a, b) => b.nume.localeCompare(a.nume))
          break
        case 'nrOreLucrateCresc':
          medici.value.sort((a, b) => {
            const oreLucrateA = calculeazaOreLucrate(a.programLucru)
            const oreLucrateB = calculeazaOreLucrate(b.programLucru)
            return oreLucrateA - oreLucrateB
          })
          break
        case 'nrOreLucrateDesc':
          medici.value.sort((a, b) => {
            const oreLucrateA = calculeazaOreLucrate(a.programLucru)
            const oreLucrateB = calculeazaOreLucrate(b.programLucru)
            return oreLucrateB - oreLucrateA
          })
          break
      }
    }

    // Apeleaza sortarea ori de câte ori criteriuSelectat se schimbă
    watch(criteriuSelectat, () => {
      sorteaza()
    })

    return {
      store, snackbar, openAddDoctorDialog,
      medici,
      showMedici,
      showAddDoctorDialog,
      actualizeazaListaMediciDupaAdaugare,
      selectedDoctorId,
      isDetailsDialogOpen, handleShowMedicDetails, isOpenForDetails,
      isEditDialogOpen, handleEditMedic, isOpenForEdit,
      isDeleteDialogOpen, isOpenForDelete, handleDeleteMedic,
      actualizeazaListaMediciDupaModificare,
      showPacienti, openAddPacientDialog,
      handleDoctorSelection,
      pacienti,
      selectedPacientId,
      isPacientDetailsDialogOpen, isPacientDetailsDialogComputed, handleShowPacientDetails,
      isEditPacientDialogOpen, isEditPacientDialogComputed, handleEditPacient,
      actualizeazaPacientDupaModificare,
      isDeletePacientDialogOpen, isDeletePacientDialogComputed, handleDeletePacient,
      showAddPacientDialog,
      criteriiSortare,
      criteriuSelectat,
      sorteaza, calculeazaOreLucrate
    }
  },
};
</script>

<style scoped>
@import url('../assets/fonts.css');

.titluPagina {
  font-size: 2rem;
  line-height: 1rem;
  font-weight: 800;
  color: #11468F;
  padding-left: 1.25rem;
  font-family: "Domine", serif;
  font-optical-sizing: auto;
}

.subtitlu {
  font-size: 1.5rem;
  line-height: 1rem;
  font-weight: 800;
  color: #11468F;
  margin-top: 1.5rem;
  margin-left: -2.2rem;
  font-family: "Domine", serif;
  font-optical-sizing: auto;
}

.btnAdaugaMedic {
  margin-top: 1.5rem;
  margin-left: -1.5rem;
  background-color: #39A2DB;
  color: #FFFFFF;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: center;
}

.btnAdaugaPacient {
  margin-top: 1rem;
  background-color: #39A2DB;
  color: #FFFFFF;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: center;
}

.carduri {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* padding-top: 1.25rem; */
}

.snackbar {
  font-size: 5rem;
  line-height: 1rem;
  font-weight: 800;
  font-family: "Domine", serif;
  font-optical-sizing: auto;
  text-align: center;
}

.dropdownSortare {
  max-width: 18.75rem;
  margin-top: 1.5rem;
}

.containerFunctiiMedici {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 42.5rem;
}
</style>