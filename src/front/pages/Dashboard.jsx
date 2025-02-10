import React, { useState, useEffect } from "react";
import { getSecrets, addSecret, deleteSecret } from "../utils";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer()
    const [content, setContent] = useState('')
    const [text, setText] = useState('')

    const onRefresh = async () => {
        await getSecrets(dispatch)(store.token)
    }

    const handleSecretAdd = async () => {
        if (text) {
            await addSecret(dispatch)(store.token, text)
            await onRefresh()
            setText('')
        }
    }

    const handleSecretDel = async (id) => {
        await deleteSecret(dispatch)(store.token, id)
    }
    useEffect(() => {
        onRefresh()
    }, []);


    return (
        <div className="dashboard justify-content-center">
            <div className="secretlogger">
                <input type='text' value={text} placeholder="Write your secret here ..." onChange={(e) => { setText(e.target.value) }}></input>
                <button onClick={handleSecretAdd}>Add Secret</button>
                <div className="content list-group">
                    {store.secrets === 'No secrets in the vault' || (!store.secrets.length) ? <div>{store.secrets}</div> :
                        store.secrets?.map((secret) => {
                            return (
                                <li className="list-group-item py-3 d-flex justify-content-between align-items-center" key={secret.id}>
                                    {secret.message}
                                    <div className="d-flex icons"><FontAwesomeIcon className='mx-2' icon={faEdit}></FontAwesomeIcon><FontAwesomeIcon className='mx-2' onClick={() => handleSecretDel(secret.id)} icon={faTrashCan} /></div>
                                </li>
                            )
                        })}

                </div>
            </div>

            <div>

            </div>
        </div>
    )
}

export default Dashboard