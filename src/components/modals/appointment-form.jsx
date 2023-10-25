import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import { formatMoney } from '../../utils/numbers'
import { setIsShowModal, setIsShowRenewModal } from '../../redux/slices/modalSlice'
import translations from '../../i18n'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { capitalizeFirstLetter, formatPatientName } from '../../utils/formatString'
import SearchPatientInputField from '../inputs/patients-search'
import { format } from 'date-fns'

const AppointmentFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, targetAppointment }) => {

    const pagePath = window.location.pathname
    const clinicId = pagePath.split('/')[4]

    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const servicesList = useSelector(state => state.services.services)
    const doctors = useSelector(state => state.doctors.doctors)

    const appointmentsStatus = ['WAITING', 'UPCOMING', 'ACTIVE', 'DONE', 'CANCELLED']

    const [isSubmit, setIsSubmit] = useState(false)

    const [updateStatus, setUpdateStatus] = useState()
    const [targetPatient, setTargetPatient] = useState()
    const [status, setStatus] = useState('WAITING')
    const [reservationDate, setReservationDate] = useState(isUpdate ? format(new Date(targetAppointment.reservationTime), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))
    const [reservationTime, setReservationTime] = useState(isUpdate ? format(new Date(targetAppointment.reservationTime), 'HH:mm') : format(new Date(), 'HH:mm'))
    const [service, setService] = useState()
    const [doctor, setDoctor] = useState()

    const [isSendMail, setIsSendMail] = useState(false)

    const [targetPatientError, setTargetPatientError] = useState()
    const [statusError, setStatusError] = useState()
    const [reservationDateError, setReservationDateError] = useState()
    const [reservationTimeError, setReservationTimeError] = useState()
    const [serviceError, setServiceError] = useState()
    const [doctorError, setDoctorError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!targetPatient) return setTargetPatientError(translations[lang]['patient is required'])
        
        if(!reservationDate) return setReservationDateError(translations[lang]['reservation date is required'])

        if(!reservationTime) return setReservationTimeError(translations[lang]['reservation time is required'])

        //if(!service && user.roles.includes('STAFF')) return setServiceError(translations[lang]['service is required'])

        if(!doctor && user.roles.includes('STAFF')) return setDoctorError(translations[lang]['doctor is required'])

        const [year, month, day] = reservationDate.split('-').map(Number)
        const [hours, minutes] = reservationTime.split(':').map(Number)
        const seconds = 0

        const bookDate = new Date(year, month - 1, day, hours, minutes, seconds)

        const appointment = {
            patientId: targetPatient?.patientId,
            clinicId: user.roles.includes('DOCTOR') ? clinicId : user.clinicId,
            doctorId: user.roles.includes('STAFF') ? doctor : user._id,
            reservationTime: bookDate,
            status,
            serviceId: user.roles.includes('STAFF') ? service : null,
            isSendMail
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/appointments`, appointment)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'reservationTime') return setReservationDateError(errorResponse.message)

                if(errorResponse.field === 'serviceId') return setServiceError(errorResponse.message)

                if(errorResponse.field === 'doctorId') return setDoctorError(errorResponse.message)

                if(errorResponse.field === 'status') return setStatusError(errorResponse.message)

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

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!updateStatus) return setStatusError('status is required')

        setIsSubmit(true)
        serverRequest.patch(`/v1/appointments/${targetAppointment._id}/status`, { status: updateStatus })
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowFormModal(false)
            setIsUpdate(false)
            toast.success(response.data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }

    const deleteAppointment = () => {
        setIsSubmit(true)
        serverRequest.delete(`/v1/appointments/${targetAppointment._id}`)
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowFormModal(false)
            setIsUpdate(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(e => {
            setIsSubmit(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? translations[lang]['Update Appointment'] : translations[lang]['Create Appointment']}</h2>
                {
                    isUpdate ?
                    <span className="hover" onClick={e => deleteAppointment()}>
                        <DeleteOutlineOutlinedIcon />
                    </span>
                    :
                    null
                }
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="appointment-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}
                    >
                        {
                            !isUpdate ?
                            <SearchPatientInputField 
                            setTargetPatient={setTargetPatient} 
                            setTargetPatientError={setTargetPatientError}
                            targetPatientError={targetPatientError}
                            />
                            :
                            <div className="form-input-container">
                                <label>{translations[lang]['Patient Name']}</label>
                                <input
                                disabled
                                type="text"
                                value={formatPatientName(targetAppointment)} 
                                className="form-input"
                                />
                            </div>
                        }
                        <div className="form-input-container">
                            <label>{translations[lang]['Reservation Date']}  {translations[lang]['(month/day/year)']}</label>
                            <input 
                            disabled={isUpdate}
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
                            disabled={isUpdate}
                            type="time" 
                            className="form-input" 
                            value={reservationTime}
                            onChange={e => setReservationTime(e.target.value)}
                            onClick={e => setReservationTimeError()}
                            />
                            <span className="red">{reservationTimeError}</span>
                        </div> 
                        {
                            user.roles.includes('STAFF') ?
                            <div className="form-input-container">
                                <label>{translations[lang]['Service']}</label>
                                <select
                                disabled={isUpdate}
                                className="form-input"
                                onChange={e => setService(e.target.value)}
                                onClick={e => setServiceError()}
                                >
                                    <option selected disabled>{translations[lang]['Select Service']}</option>
                                    {servicesList.map(service => {
                                        if(isUpdate && targetAppointment.serviceId === service._id) {
                                            return <option value={service._id} selected>{service.name}</option>
                                        }   
                                        return <option value={service._id}>
                                        {service.name}
                                    </option>
                                    })}
                                </select>
                                <span className="red">{serviceError}</span>
                            </div>
                            :
                            null
                        }
                        <div className="form-input-container">
                            <label>{translations[lang]['Status']}</label>
                            <select
                            className="form-input"
                            onClick={e => setStatusError()}
                            onChange={e => isUpdate ? setUpdateStatus(e.target.value) : setStatus(e.target.value)}
                            >
                                {appointmentsStatus.map(status => {
                                    if(isUpdate && targetAppointment.status === status) {
                                        return <option selected value={status}>{translations[lang][capitalizeFirstLetter(status)]}</option>
                                    }

                                    return <option value={status}>{translations[lang][capitalizeFirstLetter(status)]}</option>
                                })}
                            </select>
                        </div>
                        {
                            user.roles.includes('STAFF') ?
                            <div className="form-input-container">
                                <label>{translations[lang]['Doctor']}</label>
                                <select
                                disabled={isUpdate}
                                className="form-input"
                                onChange={e => setDoctor(e.target.value)}
                                onClick={e => setDoctorError()}
                                >
                                    <option selected disabled>{translations[lang]['Select Doctor']}</option>
                                    {doctors.map(doctor => {
                                        if(isUpdate && targetAppointment?.doctorId === doctor.doctorId) {
                                            return <option value={doctor?.doctor?._id} selected>
                                            {`${doctor?.doctor?.firstName} ${doctor?.doctor?.lastName}`}
                                        </option>
                                        }
                                        return <option value={doctor?.doctor?._id}>
                                        {`${doctor?.doctor?.firstName} ${doctor?.doctor?.lastName}`}
                                    </option>
                                    })}
                                </select>
                                <span className="red">{doctorError}</span>
                            </div>
                            :
                            null
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
                            >{isUpdate ? translations[lang]['Update'] : translations[lang]['Create']}</button>
                        } 
                    </div>
                    <div>
                        <button 
                        className="normal-button cancel-button"
                        onClick={e => {
                            e.preventDefault()
                            isUpdate ? setIsUpdate(false) : null
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
}

export default AppointmentFormModal