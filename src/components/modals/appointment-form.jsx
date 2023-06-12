import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import CircularLoading from '../loadings/circular'


const AppointmentFormModal = ({ setShowFormModal, reload, setReload }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)
    const [isVisitReasonsLoading, setIsVisitReasonsLoading] = useState(true)
    const [isDoctorsLoading, setIsDoctorsLoading] = useState(false)
    const [isClinicsLoading, setIsClinicsLoading] = useState(false)

    const [visitReasonsList, setVisitReasonsList] = useState([])
    const [doctors, setDoctors] = useState([])
    const [clinics, setClinics] = useState([])

    const [patientName, setPatientName] = useState()
    const [patientCountryCode, setPatientCountryCode] = useState(20)
    const [patientPhone, setPatientPhone] = useState()
    const [reservationDate, setReservationDate] = useState()
    const [reservationTime, setReservationTime] = useState()
    const [visitReason, setVisitReason] = useState()
    const [doctor, setDoctor] = useState()
    const [clinic, setClinic] = useState()


    const [patientNameError, setPatientNameError] = useState()
    const [patientCountryCodeError, setPatientCountryCodeError] = useState()
    const [patientPhoneError, setPatientPhoneError] = useState()
    const [reservationDateError, setReservationDateError] = useState()
    const [reservationTimeError, setReservationTimeError] = useState()
    const [visitReasonError, setVisitReasonError] = useState()
    const [doctorError, setDoctorError] = useState()
    const [clinicError, setClinicError] = useState()


    useEffect(() => {
        setIsVisitReasonsLoading(true)
        serverRequest.get('/v1/visit-reasons')
        .then(response => {
            setIsVisitReasonsLoading(false)
            const data = response.data
            setVisitReasonsList(data.visitReasons)
        })
        .catch(error => {
            setIsVisitReasonsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [])

    useEffect(() => {

        if(user.role === 'STAFF') {
            return
        }
        
        setIsClinicsLoading(true)
        serverRequest.get(`/v1/clinics/doctors/${user._id}`)
        .then(response => {
            setIsClinicsLoading(false)
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(erorr => {
            setIsClinicsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [])

    useEffect(() => {

        if(user.role === 'DOCTOR') {
            return
        }

        serverRequest.get(`/v1/doctors/clinics/${user.clinicId}`)
        .then(response => {
            setIsDoctorsLoading(false)
            const data = response.data
            setDoctors(data.doctors)
        })
        .catch(error => {
            setIsDoctorsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!patientName) return setPatientNameError('Patient name is required')

        if(!patientCountryCode) return setPatientCountryCodeError('Patient country code is required')
        
        if(!patientPhone) return setPatientPhoneError('Patient phone is required')

        if(!reservationDate) return setReservationDateError('Reservation date is required')

        if(!visitReason) return setVisitReasonError('Visit reason is required')

        if(user.role === 'STAFF' && !doctor) return setDoctorError('Doctor is required')

        if(user.role === 'DOCTOR' && !clinic) return setClinicError('Clinic is required')

        const doctorId = user.role === 'STAFF' ? doctor : user._id
        const clinicId = user.role === 'STAFF' ? user.clinicId : clinic

        const appointment = {
            clinicId,
            doctorId,
            patientName,
            patientCountryCode: Number.parseInt(patientCountryCode),
            patientPhone: Number.parseInt(patientPhone),
            reservationTime: format(new Date(`${reservationDate} ${reservationTime}`), 'yyyy-MM-dd HH:MM:ss'),
            status: 'UPCOMING',
            visitReasonId: visitReason
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/appointments`, appointment)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            //resetForm()
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : navigate('/appointments')
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

                if(errorResponse.field === 'visitReasonId') return setVisitReasonError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const resetForm  = () => {

        setPatientName('')
        setPatientCountryCode(20)
        setPatientPhone('')
        setReservationDate('')
        setReservationTime('')
        setVisitReason('')
        setDoctor('')
        setClinic('')

        setPatientNameError('')
        setPatientCountryCodeError('')
        setPatientPhoneError('')
        setReservationDateError('')
        setReservationTimeError('')
        setVisitReasonError('')
        setDoctorError('')
        setClinicError('')

        document.querySelector("#appointment-form").reset()

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Create Appointment</h2>
            </div>
            {
                isVisitReasonsLoading || isDoctorsLoading || isClinicsLoading ?
                <CircularLoading />
                :
                <div>
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
                            type="date" 
                            className="form-input" 
                            value={reservationDate}
                            onChange={e => setReservationDate(e.target.value)}
                            onClick={e => setReservationDateError()}
                            />
                            <span className="red">{reservationDateError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Reservation Time</label>
                            <input 
                            type="time" 
                            className="form-input" 
                            value={reservationTime}
                            onChange={e => setReservationTime(e.target.value)}
                            onClick={e => setReservationTimeError()}
                            />
                            <span className="red">{reservationTimeError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Visit Reason</label>
                            <select
                            onChange={e => setVisitReason(e.target.value)}
                            onClick={e => setVisitReasonError()}
                            >
                                <option selected disabled>select visit reason</option>
                                {visitReasonsList.map(reason => <option value={reason._id}>
                                    {reason.name}
                                </option>)}
                            </select>
                            <span className="red">{visitReasonError}</span>
                        </div>
                        {
                            user.role === 'STAFF' ?
                            <div className="form-input-container">
                                <label>Doctor</label>
                                <select
                                onChange={e => setDoctor(e.target.value)}
                                onClick={e => setDoctorError()}
                                >
                                    <option selected disabled>select doctor</option>
                                    {doctors.map(doctor => <option value={doctor.doctor._id}>
                                        {`${doctor.doctor.firstName} ${doctor.doctor.lastName}`}
                                    </option>)}
                                </select>
                                <span className="red">{doctorError}</span>
                            </div>
                            :
                            <div className="form-input-container">
                                <label>Clinic</label>
                                <select
                                onChange={e => setClinic(e.target.value)}
                                onClick={e => setClinicError()}
                                >
                                    <option selected disabled>select clinic</option>
                                    {clinics.map(clinic => <option value={clinic.clinic._id}>
                                        {clinic.clinic.name}
                                    </option>)}
                                </select>
                                <span className="red">{clinicError}</span>
                            </div>
                        }
                        
                    </form>
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
                                    <button
                                    form="appointment-form"
                                    className="normal-button white-text action-color-bg"
                                    >Create</button>
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
                </div>
            }
            
        </div>
    </div>
}

export default AppointmentFormModal