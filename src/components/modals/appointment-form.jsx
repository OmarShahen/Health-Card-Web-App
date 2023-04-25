import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'


const AppointmentFormModal = ({ setShowFormModal, reload, setReload }) => {

    const [isLoading, setIsLoading] = useState(false)

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
            doctorId: '63efbbe147537b9ccb47e9d6',
            patientName,
            patientCountryCode: Number.parseInt(patientCountryCode),
            patientPhone: Number.parseInt(patientPhone),
            reservationTime: reservationDate,
            status: 'UPCOMING'
        }

        setIsLoading(true)
        serverRequest.post(`/v1/appointments`, appointment)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setReload(reload+1)
            resetForm()
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
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
                <h2>Add Appointment</h2>
            </div>
            <div className="modal-body-container">
                <form id="appointment-form" className="modal-form-container body-text" onSubmit={handleSubmit}>
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
                        <label>Reservation Date</label>
                        <input 
                        type="datetime-local" 
                        className="form-input" 
                        placeholder=""
                        value={reservationDate}
                        onChange={e => setReservationDate(e.target.value)}
                        onClick={e => setReservationDateError()}
                        />
                        <span className="red">{reservationDateError}</span>
                    </div>
                    <div className="modal-form-btn-container">
                        <div>   
                            { 
                                isLoading ?
                                <TailSpin
                                height="30"
                                width="30"
                                color="dodgerblue"
                                />
                                :
                                <button className="normal-button white-text blue-bg">Add Appointment </button>
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