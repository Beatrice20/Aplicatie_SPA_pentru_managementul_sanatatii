import { createStore } from 'vuex'
import { auth, db } from '../firebase/config.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

async function isUsernameUnique(username) {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where("username", "==", username))
  const querySnapshot = await getDocs(q)
  return querySnapshot.empty
}

async function getUsernameByUid(uid) {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where("uid", "==", uid))
  const querySnapshot = await getDocs(q)
  let username = null
  querySnapshot.forEach(doc => {
    username = doc.data().username
  })
  return username
}

const store = createStore({
  state: {
    user: null,
    authIsReady: false
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload
    }
  },
  actions: {
    async signup(context, { username, email, password }) {
      const isUnique = await isUsernameUnique(username)
      if (!isUnique) {
        throw new Error('Acest nume de utilizator este deja folosit!')
      }
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        if (res.user) {
          // Salvez username in Firestore
          await addDoc(collection(db, "users"), {
            uid: res.user.uid,
            username: username,
          })
          console.log('Signup realizat cu numele de utilizator:', username)
        }
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('Exista deja un cont asociat cu acest email!')
        } else {
          throw new Error('A aparut o eroare la inregistrare. Te rog sa incerci din nou.')
        }
      }
    },
    async login(context, { email, password }) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password)
        if (res.user) {
          const username = await getUsernameByUid(res.user.uid)

          const userWithUsername = {
            uid: res.user.uid,
            email: res.user.email,
            username: username
          }
          context.commit('setUser', userWithUsername)
        }
      } catch (error) {
        console.log(error.code)
        switch (error.code) {
          case 'auth/invalid-credential':
            throw new Error('Credentiale invalide. Verifica ca ai introdus corect emailul si parola!')
            break
          case 'auth/too-many-requests':
            throw new Error('Acces temporar restrictionat din cauza prea multor incercari. Te rugam sa incerci din nou peste cateva minute.')
            break
          default:
            throw new Error('Eroare la autentificare.')
        }
      }
    },
    async logout(context) {
      console.log('logout action')
      await signOut(auth)
      context.commit('setUser', null)
    },
    async isUsernameUniqueAction(context, username) {
      return await isUsernameUnique(username)
    }
  }
})

// Este apelata de fiecare data cand starea utilizatorului se schimba
const unsub = onAuthStateChanged(auth, async (user) => {
  if (user) {
    const username = await getUsernameByUid(user.uid)

    const userWithUsername = {
      uid: user.uid,
      email: user.email,
      username: username
    }
    // Starea utilizatorului autentificat este sincronizata cu starea aplicatiei
    store.commit('setUser', userWithUsername)
  } else {
      store.commit('setUser', null)
  }
  store.commit('setAuthIsReady', true)
  unsub()
})

export default store