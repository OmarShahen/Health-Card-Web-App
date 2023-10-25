import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import AppointmentFormModal from '../../components/modals/appointment-form'
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import Calender from '../../components/calenders/calender'


const PatientAppointmentsPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

    const navigate = useNavigate()

    const [targetAppointment, setTargetAppointment] = useState({})
    const [isUpdate, setIsUpdate] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [appointments, setAppointments] = useState([])

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)


    useEffect(() => { 
        scroll(0,0) 
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const endpointURL = `/v1/appointments/clinics/${clinicId}/patients/${patientId}`
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            setAppointments(response.data.appointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        {
            user.roles.includes('STAFF') || user.roles.includes('DOCTOR') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setShowModalForm} />
            </div>
            :
            null
        }
        
        { 
            showModalForm && (user.roles.includes('STAFF') || user.roles.includes('DOCTOR')) ? 
            <AppointmentFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setShowModalForm} 
            isUpdate={isUpdate}
            targetAppointment={targetAppointment}
            />
            : 
            null 
         }
         
        <div className="padded-container margin-top-1">
            {
                isLoading ?
                <CircularLoading />
                :
                <Calender 
                appointments={appointments} 
                setTargetAppointment={setTargetAppointment}
                setShowModalForm={setShowModalForm}
                setIsUpdate={setIsUpdate}
                />
            }
        </div>
        
    </div>
}

export default PatientAppointmentsPage