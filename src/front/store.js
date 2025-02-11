

export const initialStore = () => {
  const localToken = localStorage.getItem('token');
  return {
    signup_status: 201,
    login_status: 200,
    dashboard_status: 200,
    login: false,
    dashboard: true,
    token: localToken,
    secrets: 'No secrets in the vault',

  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'signup_request':
      return { ...store, signup_status: 200 }
    case 'signup_success':
      return { ...store, signup_status: 201 }
    case 'signup_bad':
      return { ...store, signup_status: 400 }
    case 'signup_fail':
      return { ...store, signup_status: 500 }
    case 'login_request':
      return { ...store, signup_status: 200 }
    case 'login_success':
      localStorage.setItem('token', action.payload.auth)
      return { ...store, login: true, token: action.payload.auth, dashboard: true, login_status: 200 }
    case 'login_fail':
      return { ...store, login: false, token: '', login_status: 400, dashboard: false }
    case 'secret_request':
      return { ...store, login: true, dashboard_status: 200 }
    case 'secret_success':
      return { ...store, login: true, secrets: [...action.payload.data], dashboard_status: 200 }
    case 'secret_fail':
      return { ...store, dashboard_status: 400 }
    case 'logout_request':
      localStorage.clear()
      return { signup_alert: 500, login: false, token: '', secrets: null, dashboard: false, login_status: 200, signup_status: 200, dashboard_status: 200 }
    case 'add_secret_request':
      return { ...store }
    case 'add_secret_success':
      if (typeof (store.secrets === 'string')) {
        return { ...store, secrets: [action.payload.data] }
      }
      return { ...store, secrets: [...store.secrets, action.payload.data], dashboard_status: 200 }
    case 'add_secret_fail':
      return { ...store, dashboard_status: 400 }
    case 'delete_secret_request':
      return { ...store }
    case 'delete_secret_success':
      const filter_id = store.secrets.filter((msg) => msg.id !== action.payload.data)
      if (filter_id.length == 0) {
        return { ...store, secrets: 'No secrets in the vault', dashboard_status: 200 }
      }
      return { ...store, secrets: filter_id }
    case 'delete_secret_fail':
      return { ...store, dashboard_status: 400 }
    case 'edit_secret_request':
      return { ...store }
    case 'edit_secret_success':
      const edited = store.secrets.map((secret) => {
        if (secret.id === action.payload.data) {
          secret.message = action.payload.message
          return secret
        } else {
          return secret
        }
      })
      return { ...store, login: true, secrets: [...edited], dashboard_status: 200 }
    case 'edit_secret_fail':
      return { ...store, dashboard_status: 400 }
    case 'allowNav':
      return { ...store, dashboard: false }
    default:
      throw Error('Unknown action.');
  }
}
