import { useState, useEffect } from 'react'
import PrescriptionCard from "../components/cards/patient-prescriptions"
import './prescriptions.css'
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { useNavigate } from "react-router-dom"
import ScanButton from "../components/buttons/scan-button"
import DoctorsBottomBar from "../components/navigation/doctors-bottom-bar"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import QRCodeScanner from '../components/scanners/QR-code'
import TableFilters from '../components/tables/filters';
import PageHeader from '../components/sections/page-header'
import AppointmentsTable from '../components/tables/appointments';
import Card from '../components/cards/card';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined'
import AppointmentFormModal from '../components/modals/appointment-form';

const AppointmentsPage = () => {

    const navigate = useNavigate()

    const [reload, setReload] = useState(0)
    const [showModalForm, setShowModalForm] = useState(false)
    const [appointments, setAppointments] = useState([])
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        serverRequest.get(`/v1/appointments/doctors/${'63efbbe147537b9ccb47e9d6'}`)
        .then(response => {
            setAppointments(response.data.appointments)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    const searchPatient = (patient, value) => {

        const name = `${patient.firstName} ${patient.lastName}`.toLowerCase()
        const phone = `${patient.countryCode}${patient.phone}`

        if(name.includes(value)) {
            return true
        } else if(phone.includes(value)) {
            return true
        }

        return false
    }

    return <div className="page-container">
        { showModalForm ? <AppointmentFormModal reload={reload} setReload={setReload} setShowFormModal={setShowModalForm} /> : null }
        <div className="padded-container">
            <PageHeader 
            pageName="Appointments" 
            setShowModalForm={setShowModalForm} 
            addBtnText={'Create Appointment'} 
            /> 
            {/*<div className="cards-list-wrapper">
                <Card 
                icon={<HourglassEmptyOutlinedIcon />}
                cardHeader={'Waiting'}
                number={appointments.filter(appointment => appointment.status === 'WAITING').length}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<UpcomingOutlinedIcon />}
                cardHeader={'Upcoming'}
                number={appointments.filter(appointment => appointment.status === 'UPCOMING').length}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<CheckCircleOutlineOutlinedIcon />}
                cardHeader={'Done'}
                number={appointments.filter(appointment => appointment.status === 'DONE').length}
                iconColor={'#00D4FF'}
                />
                <Card 
                icon={<CancelOutlinedIcon />}
                cardHeader={'Cancelled'}
                number={appointments.filter(appointment => appointment.status === 'CANCELLED').length}
                iconColor={'#FF579A'}
                />
</div>*/}
            <AppointmentsTable 
            appointments={appointments} 
            setAppointments={setAppointments}
            reload={reload}
            setReload={setReload}
            />  
        </div>
        
    </div>
}

export default AppointmentsPage