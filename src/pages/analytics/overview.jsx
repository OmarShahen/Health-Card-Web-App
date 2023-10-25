import { useState, useEffect } from 'react'
import '../prescriptions.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import Card from '../../components/cards/card';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined'
import AppointmentFormModal from '../../components/modals/appointment-form'
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import CircularLoading from '../../components/loadings/circular';
import FiltersSection from '../../components/sections/filters/filters'
import FloatingButton from '../../components/buttons/floating-button'
import AppointmentCard from '../../components/cards/appointment'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchAppointments } from '../../utils/searches/search-appointments'
import { format } from 'date-fns'
import { formatNumber } from '../../utils/numbers'
import AppointmentDeleteConfirmationModal from '../../components/modals/confirmation/appointment-delete-confirmation-modal'
import AppointmentStatusConfirmationModal from '../../components/modals/confirmation/appointment-status-confirmation-modal'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import NavigationBar from '../../components/navigation/navigation-bar'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import LineChart from '../../components/charts/line-chart'



const AnalyticsOverviewPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

    const navigate = useNavigate()

    const [targetAppointment, setTargetAppointment] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)
    const [status, setStatus] = useState()


    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [searchedAppointments, setSearchedAppointments] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    useEffect(() => { 
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const endpointURL = `/v1/appointments/clinics/${clinicId}/patients/${patientId}`
        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setAppointments(response.data.appointments)
            setSearchedAppointments(response.data.appointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


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
            />
            : 
            null 
         }
        
        
        <div className="padded-container">
            <NavigationBar pageName={'Overview'} />
            <PageHeader 
            pageName={'Dashboard'} 
            setShowModalForm={setShowModalForm}
            setReload={setReload}
            reload={reload}
            isHideBackButton={true}
            /> 
            <div className="cards-3-list-wrapper">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Patients'}
                number={formatNumber(appointments.length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Surveys'}
                number={formatNumber(appointments.length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Patients Surveys'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'UPCOMING').length)}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Treatment Surveys'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'WAITING').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Calls'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'ACTIVE').length)}
                iconColor={'#5C60F5'}
                />
                
            </div>
            <div className="margin-top-1">
            <LineChart 
            title={"Growth"} 
            data={[1, 2, 1, 4, 2, 1, 4, 2, 1, 4, 2, 1, 4]} 
            labels={['lab1', 'lab2', 'lab3', 'lab4', 'lab2', 'lab3', 'lab4', 'lab2', 'lab3', 'lab4', 'lab2', 'lab3', 'lab4']} 
            />
            </div>
        </div>
        
    </div>
}

export default AnalyticsOverviewPage