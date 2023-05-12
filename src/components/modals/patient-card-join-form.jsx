import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'

const PatientCardJoinFormModal = ({ reload, setReload, setShowModalForm }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)
    const [cardId, setCardId] = useState()

    const [cardIdError, setCardIdError] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!cardId) return setCardIdError('Card number is required')

        setIsSubmit(true)
        serverRequest.patch(`/v1/patients/cardsId/${cardId}/doctors`, { doctorId: user._id })
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload+1) : navigate('/patients')
            setShowModalForm(false)

        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'cardId') return setCardIdError(errorResponse.message)

                if(errorResponse.field === 'doctorId') return setCardIdError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const resetForm  = () => {

        setCardId('')
        setCardIdError()
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Add Patient With Card</h2>
            </div>
            <div className="modal-body-container">
                <form className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
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
                    <div className="modal-form-btn-container">
                        <div>
                            {
                                !isSubmit ?
                                <button 
                                className="normal-button white-text action-color-bg"
                                >
                                    Add
                                </button>
                                :
                                <TailSpin width="25" height="25" color="#4c83ee" />
                            }
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