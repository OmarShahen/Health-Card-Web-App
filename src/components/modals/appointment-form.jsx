import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { format, getTime } from 'date-fns'
import CircularLoading from '../loadings/circular'
import { formatMoney } from '../../utils/numbers'
import { setIsShowModal, setIsShowRenewModal } from '../../redux/slices/modalSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import translations from '../../i18n'

const AppointmentFormModal = ({ setShowFormModal, reload, setReload }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)
    const [isServicesLoading, setIsServicesLoading] = useState(true)
    const [isDoctorsLoading, setIsDoctorsLoading] = useState(false)

    const [servicesList, setServicesList] = useState([])
    const [doctors, setDoctors] = useState([])

    const [patientName, setPatientName] = useState()
    const [patientCountryCode, setPatientCountryCode] = useState(20)
    const [patientPhone, setPatientPhone] = useState()
    const [reservationDate, setReservationDate] = useState()
    const [reservationTime, setReservationTime] = useState()
    const [service, setService] = useState()
    const [doctor, setDoctor] = useState()

    const [isSendMail, setIsSendMail] = useState(true)

    const [patientNameError, setPatientNameError] = useState()
    const [patientCountryCodeError, setPatientCountryCodeError] = useState()
    const [patientPhoneError, setPatientPhoneError] = useState()
    const [reservationDateError, setReservationDateError] = useState()
    const [reservationTimeError, setReservationTimeError] = useState()
    const [serviceError, setServiceError] = useState()
    const [doctorError, setDoctorError] = useState()


    useEffect(() => {
        setIsServicesLoading(true)
        serverRequest.get(`/v1/services/clinics/${user.clinicId}`)
        .then(response => {
            setIsServicesLoading(false)
            const data = response.data
            setServicesList(data.services)
        })
        .catch(error => {
            setIsServicesLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [])


    useEffect(() => {
        setIsDoctorsLoading(true)
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

        if(!patientName) return setPatientNameError(translations[lang]['patient name is required'])

        if(!patientCountryCode) return setPatientCountryCodeError(translations[lang]['patient country code is required'])
        
        if(!patientPhone) return setPatientPhoneError(translations[lang]['patient phone is required'])

        if(!reservationDate) return setReservationDateError(translations[lang]['reservation date is required'])

        if(!reservationTime) return setReservationTimeError(translations[lang]['reservation time is required'])

        if(!service) return setServiceError(translations[lang]['service is required'])

        if(!doctor) return setDoctorError(translations[lang]['doctor is required'])

        const [year, month, day] = reservationDate.split('-').map(Number)
        const [hours, minutes] = reservationTime.split(':').map(Number)
        const seconds = 0

        const bookDate = new Date(year, month - 1, day, hours, minutes, seconds)

        const appointment = {
            clinicId: user.clinicId,
            doctorId: doctor,
            patientName,
            patientCountryCode: 20,
            patientPhone: Number.parseInt(patientPhone),
            reservationTime: bookDate,
            status: 'UPCOMING',
            serviceId: service,
            isSendMail
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/appointments`, appointment)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
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

                if(errorResponse.field === 'serviceId') return setServiceError(errorResponse.message)

                if(errorResponse.field === 'doctorId') return setDoctorError(errorResponse.message)

                if(errorResponse.field === 'mode') {
                    setShowFormModal(false)
                    dispatch(setIsShowModal(true))
                    return
                }

                if(errorResponse.field === 'activeUntilDate') {
                    setShowFormModal(false)
                    dispatch(setIsShowRenewModal(true))
                    return
                }

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{translations[lang]['Create Appointment']}</h2>
            </div>
            {
                isServicesLoading || isDoctorsLoading ?
                <CircularLoading />
                :
                <div>
                <div className="modal-body-container">
                    <form id="appointment-form" className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                        <div className="form-input-container">
                            <label>{translations[lang]['Patient Name']}</label>
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
                            <label>{translations[lang]['Patient Phone']}</label>
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
                            <label>{translations[lang]['Reservation Date']}  {translations[lang]['(month/day/year)']}</label>
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
                            <label>{translations[lang]['Reservation Time']}</label>
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
                            <label>{translations[lang]['Service']}</label>
                            <select
                            className="form-input"
                            onChange={e => setService(e.target.value)}
                            onClick={e => setServiceError()}
                            >
                                <option selected disabled>{translations[lang]['Select Service']}</option>
                                {servicesList.map(service => <option value={service._id}>
                                    {service.name} - {formatMoney(service.cost)}
                                </option>)}
                            </select>
                            <span className="red">{serviceError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>{translations[lang]['Doctor']}</label>
                            <select
                            className="form-input"
                            onChange={e => setDoctor(e.target.value)}
                            onClick={e => setDoctorError()}
                            >
                                <option selected disabled>{translations[lang]['Select Doctor']}</option>
                                {doctors.map(doctor => <option value={doctor?.doctor?._id}>
                                    {`${doctor?.doctor?.firstName} ${doctor?.doctor?.lastName}`}
                                </option>)}
                            </select>
                            <span className="red">{doctorError}</span>
                        </div>
                        <div 
                        className="modal-send-email-container body-text"
                        onClick={e => setIsSendMail(!isSendMail)}
                        >
                            { isSendMail ? <CheckCircleIcon style={{ color: 'green' }} /> : <CircleOutlinedIcon /> }
                            <span>{translations[lang]['send E-mail to doctor']}</span>
                        </div>
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
                            >{translations[lang]['Create']}</button>
                        } 
                    </div>
                    <div>
                        <button 
                        className="normal-button cancel-button"
                        onClick={e => {
                            e.preventDefault()
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>
            }
            
        </div>
    </div>
}

export default AppointmentFormModal