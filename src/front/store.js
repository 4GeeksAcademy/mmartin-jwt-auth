

export const initialStore = () => {
  const localToken = localStorage.getItem('token');
  return {
    signup_status: false,
    signup_alert: 500,
    login: false,
    token: localToken,
    secrets: 'No secrets in the vault',
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'signup_request':
      return { ...store, signup_status: false }
    case 'signup_success':
      return { ...store, signup_status: true, signup_alert: 200 }
    case 'signup_bad':
      return { ...store, signup_status: false, signup_alert: 400 }
    case 'signup_fail':
      return { ...store, signup_status: false, signup_alert: 500 }
    case 'login_request':
      return { ...store }
    case 'login_success':
      localStorage.setItem('token', action.payload.auth)
      return { ...store, login: true, token: action.payload.auth }
    case 'login_fail':
      return { ...store, login: false, token: '' }
    case 'secret_request':
      return { ...store, login: true }
    case 'secret_success':
      return { ...store, login: true, secrets: [...action.payload.data] }
    case 'secret_fail':
      return { ...store }
    case 'logout_request':
      localStorage.clear()
      return { signup_alert: 500, login: false, token: '', secrets: null, }
    case 'add_secret_request':
      return { ...store }
    case 'add_secret_success':
      if (typeof (store.secrets === 'string')) {
        return { ...store, secrets: [action.payload.data] }
      }
      return { ...store, secrets: [...store.secrets, action.payload.data] }
    case 'add_secret_fail':
      return { ...store }
    case 'delete_secret_request':
      return { ...store }
    case 'delete_secret_success':
      const filter_id = store.secrets.filter((msg) => msg.id !== action.payload.data)
      if (filter_id.length == 0) {
        return { ...store, secrets: 'No secrets in the vault' }
      }
      return { ...store, secrets: filter_id }
    case 'delete_secret_fail':
      return { ...store }
    default:
      throw Error('Unknown action.');
  }
}
