import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const AppointmentFormModal = ({ setShowFormModal, reload, setReload }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [patientName, setPatientName] = useState()
    const [patientCountryCode, setPatientCountryCode] = useState(20)
    const [patientPhone, setPatientPhone] = useState()
    const [reservationDate, setReservationDate] = useState()

    const [patientNameError, setPatientNameError] = useState()
    const [patientCountryCodeError, setPatientCountryCodeError] = useState()
    const [patientPhoneError, setPatientPhoneError] = useState()
    const [reservationDateError, setReservationDateError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!patientName) return setPatientNameError('Patient name is required')

        if(!patientCountryCode) return setPatientCountryCodeError('Patient country code is required')
        
        if(!patientPhone) return setPatientPhoneError('Patient phone is required')

        if(!reservationDate) return setReservationDateError('Reservation date is required')

        const appointment = {
            doctorId: user._id,
            patientName,
            patientCountryCode: Number.parseInt(patientCountryCode),
            patientPhone: Number.parseInt(patientPhone),
            reservationTime: reservationDate,
            status: 'UPCOMING'
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/appointments`, appointment)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            resetForm()
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload+1) : navigate('/appointments')
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'patientName') return setPatientNameError(errorResponse.message)

                if(errorResponse.field === 'patientCountryCode') return setPatientCountryCodeError(errorResponse.message)

                if(errorResponse.field === 'patientPhone') return setPatientPhoneError(errorResponse.message)

                if(errorResponse.field === 'reservationTime') return setReservationDateError(errorResponse.message)


                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const resetForm  = () => {

        setPatientName('')
        setPatientCountryCode(20)
        setPatientPhone('')
        setReservationDate('')

        setPatientNameError('')
        setPatientCountryCodeError()
        setPatientPhoneError()
        setReservationDateError()

        document.querySelector("#appointment-form").reset()

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Create Appointment</h2>
            </div>
            <div className="modal-body-container">
                <form id="appointment-form" className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>Patient Name</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        onClick={e => setPatientNameError()}
                        />
                        <span className="red">{patientNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Patient Country Code</label>
                        <input 
                        type="number" 
                        className="form-input" 
                        placeholder=""
                        value={patientCountryCode}
                        onChange={e => setPatientCountryCode(e.target.value)}
                        onClick={e => setPatientCountryCodeError()}
                        />
                        <span className="red">{patientCountryCodeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Patient Phone</label>
                        <input 
                        type="tel" 
                        className="form-input" 
                        placeholder=""
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        onClick={e => setPatientPhoneError()}
                        />
                        <span className="red">{patientPhoneError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Reservation Date</label>
                        <input 
                        type="datetime-local" 
                        className="form-input" 
                        value={reservationDate}
                        onChange={e => setReservationDate(e.target.value)}
                        onClick={e => setReservationDateError()}
                        />
                        <span className="red">{reservationDateError}</span>
                    </div>
                    <div className="modal-form-btn-container">
                        <div>   
                            { 
                                isSubmit ?
                                <TailSpin
                                height="25"
                                width="25"
                                color="#4c83ee"
                                />
                                :
                                <button className="normal-button white-text action-color-bg">Create</button>
                            } 
                        </div>
                        <div>
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                e.preventDefault()
                                setShowFormModal(false)
                            }}
                            >Close</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default AppointmentFormModal