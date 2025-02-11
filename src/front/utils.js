export const signUp = (dispatch) => async (email, password) => {
  dispatch({ type: 'signup_request' });

  try {
    const response = await fetch('https://sturdy-space-carnival-4qjrgprwrp2p69-3001.app.github.dev' + '/api/signup',
      {
        method: "POST",
        headers: { 'content-type': "application/json" },
        body: JSON.stringify({ "email": email, "password": password })
      }
    )

    if (response.status == 201) {
      dispatch({ type: 'signup_success' })
    }
    else if (response.status == 409) {
      const errorData = await response.json();
      dispatch({ type: 'signup_bad', payload: { error: errorData } });
    }
  }
  catch {
    dispatch({ type: 'signup_fail', payload: { error: 'Server Error' } })
  }

}

export const logIn = (dispatch) => async (email, password) => {
  dispatch({ type: 'login_request' });

  try {
    const response = await fetch('https://sturdy-space-carnival-4qjrgprwrp2p69-3001.app.github.dev' + '/api/token',
      {
        method: "POST",
        headers: { 'content-type': "application/json" },
        body: JSON.stringify({ "email": email, "password": password })
      }
    )

    if (response.ok) {
      const token = await response.json()
      dispatch({ type: 'login_success', payload: { auth: token } })
      await getSecrets(dispatch)(token)
    }
    else {
      const errorData = await response.json();
      dispatch({ type: 'login_fail', payload: { error: errorData } });
    }
  } catch {
    dispatch({ type: 'login_fail', payload: { error: 'An error occurred during login' } })
  }

}


export const getSecrets = (dispatch) => async (auth) => {
  dispatch({ type: 'secret_request' });

  try {
    const response = await fetch('https://sturdy-space-carnival-4qjrgprwrp2p69-3001.app.github.dev' + '/api/private',
      {
        method: "GET",
        headers: { 'content-type': "application/json", 'Authorization': `Bearer ${auth}` },
      }
    )

    if (response.ok) {
      const secrets = await response.json()
      dispatch({ type: 'secret_success', payload: { data: secrets } })
    }
    else {
      const errorData = await response.json();
      dispatch({ type: 'secret_fail', payload: { error: errorData } });
    }
  }
  catch {
    dispatch({ type: 'secret_fail', payload: { error: 'An error occurred during login' } })
  }

}


export const logOut = (dispatch) => () => {
  dispatch({ type: 'logout_request' });
}

export const allowNav = (dispatch) => () => {
  dispatch({ type: 'allowNav' });
}


export const addSecret = (dispatch) => async (auth, message) => {
  dispatch({ type: 'add_secret_request' });
  try {
    const response = await fetch('https://sturdy-space-carnival-4qjrgprwrp2p69-3001.app.github.dev' + '/api/private',
      {
        method: "POST",
        headers: { 'content-type': "application/json", 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ "message": message })
      }
    )
    if (response.ok) {
      toAdd = await response.json()
      dispatch({ type: 'add_secret_success', payload: { data: toAdd } })
    }
    else {
      const errorData = await response.json();
      dispatch({ type: 'add_secret_fail', payload: { error: errorData } });
    }
  }
  catch {
    dispatch({ type: 'delete_secret_fail', payload: { error: 'An error occurred during login' } })
  }
}

export const deleteSecret = (dispatch) => async (auth, id) => {
  dispatch({ type: 'delete_secret_request' });
  try {
    const response = await fetch('https://sturdy-space-carnival-4qjrgprwrp2p69-3001.app.github.dev' + '/api/private',
      {
        method: "DELETE",
        headers: { 'content-type': "application/json", 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ "id": id })
      }
    )
    if (response.ok) {
      dispatch({ type: 'delete_secret_success', payload: { data: id } })
    }
    else {
      const errorData = await response.json();
      dispatch({ type: 'delete_secret_fail', payload: { error: errorData } });
    }
  }
  catch {
    dispatch({ type: 'delete_secret_fail', payload: { error: 'An error occurred during login' } })
  }
}

export const editSecret = (dispatch) => async (auth, id, message) => {
  dispatch({ type: 'edit_secret_request' });
  try {
    const response = await fetch('https://sturdy-space-carnival-4qjrgprwrp2p69-3001.app.github.dev' + '/api/private',
      {
        method: "PUT",
        headers: { 'content-type': "application/json", 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ "id": id, "message": message })
      }
    )
    if (response.ok) {
      dispatch({ type: 'edit_secret_success', payload: { data: id, message: message } })
    }
    else {
      const errorData = await response.json();
      dispatch({ type: 'edit_secret_fail', payload: { error: errorData } });
    }
  }
  catch {
    dispatch({ type: 'edit_secret_fail', payload: { error: 'An error occurred during editing' } })
  }

}