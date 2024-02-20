export const getHTTPErrorMessage = (status, defaultMessage) => {
    switch (status) {
      case 401: return 'Autentificare necesara pe server'
      case 403: return 'Acces neautorizat'
      case 400: return defaultMessage || 'Date invalide'
      case 500: return 'Eroare internă a serverului'
      default: return 'Eroare la trimiterea datelor'
    }
  }