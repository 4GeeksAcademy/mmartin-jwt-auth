import React, { useState, useEffect } from "react";
import { getSecrets, addSecret, deleteSecret, editSecret, allowNav } from "../utils";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer()
    const [text, setText] = useState('')
    const [edit, setEdit] = useState({ message: '', id: '' })
    const [result, setResult] = useState('')
    let modalInstance = null;
    const goTo = useNavigate()
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

    const handleSecretEdit = async (id, msg) => {
        await editSecret(dispatch)(store.token, id, msg)
        setEdit(prev => ({ ...prev, message: '', id: '' }))
    }

    const handleEdit = (msg) => {
        setEdit(msg)
        showModal()
    }

    const editChange = (e) => {
        setEdit(prev => ({ ...prev, message: e.target.value }))
    }

    const showModal = () => {
        const modal = document.getElementById('editModal');
        if (!modalInstance) { // Create only once
            modalInstance = new window.bootstrap.Modal(modal, {});
        }
        modalInstance.show();
    };

    const hideModal = () => {
        setEdit(prev => ({ ...prev, message: '', id: '' }))
        if (modalInstance) { // Check if instance exists
            modalInstance.hide();
        }
    }

    useEffect(() => {
        onRefresh()
        allowNav(dispatch)()
        if (store.dashboard_status == 400) {
            setResult('Something went wrong, login again')
            goTo('/')
        }
    }, [store.dashboard_status]);


    return (
        <div className="dashboard justify-content-center">
            <div>{result}</div>
            <div className="secretlogger">
                <input type='text' value={text} placeholder="Write your secret here ..." onChange={(e) => { setText(e.target.value) }}></input>
                <button onClick={handleSecretAdd}>Add Secret</button>
                <div className="content list-group">
                    {store.secrets === 'No secrets in the vault' || (!store.secrets.length) ? <div>{store.secrets}</div> :
                        store.secrets?.map((secret) => {
                            return (
                                <li className="list-group-item py-3 d-flex justify-content-between align-items-center" key={secret.id}>
                                    {secret.message}
                                    <div className="d-flex icons"><FontAwesomeIcon className='mx-2' icon={faEdit} onClick={() => handleEdit(secret)}></FontAwesomeIcon><FontAwesomeIcon className='mx-2' onClick={() => handleSecretDel(secret.id)} icon={faTrashCan} /></div>
                                </li>
                            )
                        })}

                </div>
            </div>

            <div>

            </div>

            <div className="modal" tabIndex="-1" id="editModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit your secret</h5>
                        </div>
                        <div className="modal-body">
                            <input className='w-100 p-2' type='text' value={edit.message} onChange={(e) => editChange(e)}></input>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={hideModal}>Discard</button>
                            <button type="button" className="btn btn-primary darkpurple" data-bs-dismiss="modal" onClick={() => handleSecretEdit(edit.id, edit.message)}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard