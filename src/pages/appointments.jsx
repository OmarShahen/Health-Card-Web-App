import { useState, useEffect } from 'react'
import './prescriptions.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import AppointmentsTable from '../components/tables/appointments';
import Card from '../components/cards/card';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined'
import AppointmentFormModal from '../components/modals/appointment-form'
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import NavigationBar from '../components/navigation/navigation-bar';
import CircularLoading from '../components/loadings/circular';
import FiltersSection from '../components/sections/filters/filters'
import FloatingButton from '../components/buttons/floating-button'
import AppointmentCard from '../components/cards/appointment'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchAppointments } from '../utils/searches/search-appointments'
import { format } from 'date-fns'

const AppointmentsPage = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [searchedAppointments, setSearchedAppointments] = useState([])
    const user = useSelector(state => state.user.user)

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    useEffect(() => scroll(0,0), [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/appointments/doctors/${user._id}`, { params: statsQuery })
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
        <NavigationBar pageName={'Appointments'} />
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setShowModalForm} />
        </div>
        { 
            showModalForm ? 
            <AppointmentFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setShowModalForm} 
            />
            : 
            null 
         }
        <div className="padded-container">
            <PageHeader 
            pageName="Appointments" 
            setShowModalForm={setShowModalForm} 
            addBtnText={'Add Appointment'}
            setReload={setReload}
            reload={reload}
            /> 
            <div className="cards-list-wrapper">
                <Card 
                icon={<CalendarMonthOutlinedIcon />}
                cardHeader={'All'}
                number={appointments.length}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<UpcomingOutlinedIcon />}
                cardHeader={'Upcoming'}
                number={appointments.filter(appointment => appointment.status === 'UPCOMING').length}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<HourglassEmptyOutlinedIcon />}
                cardHeader={'Waiting'}
                number={appointments.filter(appointment => appointment.status === 'WAITING').length}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<MeetingRoomOutlinedIcon />}
                cardHeader={'Active'}
                number={appointments.filter(appointment => appointment.status === 'ACTIVE').length}
                iconColor={'#5C60F5'}
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
                <Card 
                icon={<TimerOffOutlinedIcon />}
                cardHeader={'Expired'}
                number={appointments.filter(appointment => appointment.status === 'EXPIRED').length}
                iconColor={'#FF8C00'}
                />
            </div>
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={true}
            defaultValue={'0'}
            />
            <div className="margin-top-1"></div>
            <div className="search-input-container show-mobile">
                <SearchInput 
                rows={appointments} 
                setRows={setSearchedAppointments}
                searchRows={searchAppointments}
                />
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedAppointments.length !== 0 ?
                <div>
                    <div className="page-list-container">
                        {searchedAppointments.map(appointment => <div className="cards-view-container">
                            <AppointmentCard appointment={appointment} />
                        </div>
                            )}
                    </div>
                    <div className="page-table-container">
                    <AppointmentsTable 
                    appointments={appointments} 
                    setAppointments={setAppointments}
                    reload={reload}
                    setReload={setReload}
                    setStatsQuery={setStatsQuery}
                    statsQuery={statsQuery}
                    />
                    </div>
                </div>
                :
                <EmptySection setIsShowForm={setShowModalForm} />
            }
        </div>
        
    </div>
}

export default AppointmentsPage