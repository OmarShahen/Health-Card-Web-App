import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'

const PatientCardJoinFormModal = ({ reload, setReload, setShowModalForm }) => {

    const [cardId, setCardId] = useState()

    const [cardIdError, setCardIdError] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!cardId) return setCardIdError('Card number is required')

        serverRequest.patch(`/v1/patients/cardsId/${cardId}/doctors`, { doctorId: '63efbbe147537b9ccb47e9d6' })
        .then(response => {
            const data = response.data
            resetForm()
            setReload(reload+1)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setShowModalForm(false)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }

    const resetForm  = () => {

        setCardId()
        setCardIdError()
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Add Patient With Card</h2>
            </div>
            <div className="modal-body-container">
                <form className="modal-form-container body-text" onSubmit={handleSubmit}>
                    <div>
                        <label>Card Number</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={cardId}
                        onChange={e => setCardId(e.target.value)}
                        onClick={e => setCardIdError()}
                        />
                        <span className="red">{cardIdError}</span>
                    </div>
                    <div></div>
                    <div className="modal-form-btn-container">
                        <div>
                            <button className="normal-button white-text purple-bg">Add Patient</button>
                        </div>
                        <div>
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                e.preventDefault()
                                setShowModalForm(false)
                            }}
                            >Close</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default PatientCardJoinFormModal