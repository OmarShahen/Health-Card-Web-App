import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import AppointmentFormModal from '../components/modals/appointment-form'
import NavigationBar from '../components/navigation/navigation-bar'
import AppointmentDeleteConfirmationModal from '../components/modals/confirmation/appointment-delete-confirmation-modal'
import AppointmentStatusConfirmationModal from '../components/modals/confirmation/appointment-status-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import { useNavigate, useSearchParams } from 'react-router-dom'
import translations from '../i18n'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import CircularLoading from '../components/loadings/circular'
import Calender from '../components/calenders/calender'
import FloatingButton from '../components/buttons/floating-button'


const AppointmentsPage = ({ roles }) => {

    const navigate = useNavigate()

    const localizer = momentLocalizer(moment)

    const [targetAppointment, setTargetAppointment] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)
    const [status, setStatus] = useState()

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
        const endpointURL = user.roles.includes('STAFF') ?
        `/v1/appointments/clinics/${user.clinicId}`
        :
        `/v1/appointments/doctors/${user._id}`
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            const appointments = response.data.appointments
            setAppointments(appointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        {
            user.roles.includes('STAFF') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setShowModalForm} />
            </div>
            :
            null
        }
        {
            showModalForm ?
            <AppointmentFormModal 
            reload={reload}
            setReload={setReload} 
            setShowFormModal={setShowModalForm}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            targetAppointment={targetAppointment}
            />
            :
            null
        }
        
         { 
            isShowDeleteModal ? 
            <AppointmentDeleteConfirmationModal 
            appointment={targetAppointment}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowDeleteModal}
            /> 
            : 
            null 
        }
        { 
            isShowUpdateModal ? 
            <AppointmentStatusConfirmationModal 
            appointment={targetAppointment}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowUpdateModal}
            status={status}
            setViewStatus={setViewStatus}
            /> 
            : 
            null 
        }
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Appointments"]} 
            setReload={setReload}
            reload={reload}
            addBtnText={user.roles.includes('STAFF') ? translations[lang]['Add Appointment'] : null}
            setShowModalForm={setShowModalForm}
            /> 
            <div className="margin-top-1"></div>
            {
                isLoading ?
                <CircularLoading />
                :
                <Calender
                appointments={appointments}
                setTargetAppointment={setTargetAppointment}
                setIsUpdate={setIsUpdate}
                setShowModalForm={setShowModalForm}
                />
            }
                
           {/*} <div className="cards-list-wrapper">
                <Card 
                icon={<CalendarMonthOutlinedIcon />}
                cardHeader={translations[lang]['All']}
                number={formatNumber(appointments.length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<UpcomingOutlinedIcon />}
                cardHeader={translations[lang]['Upcoming']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'UPCOMING').length)}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<HourglassEmptyOutlinedIcon />}
                cardHeader={translations[lang]['Waiting']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'WAITING').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<MeetingRoomOutlinedIcon />}
                cardHeader={translations[lang]['Active']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'ACTIVE').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<CheckCircleOutlineOutlinedIcon />}
                cardHeader={translations[lang]['Done']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'DONE').length)}
                iconColor={'#00D4FF'}
                />
                <Card 
                icon={<CancelOutlinedIcon />}
                cardHeader={translations[lang]['Cancelled']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'CANCELLED').length)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<TimerOffOutlinedIcon />}
                cardHeader={translations[lang]['Expired']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'EXPIRED').length)}
                iconColor={'#FF8C00'}
                />
            </div>
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={true}
            defaultValue={periodType === '1' ? '1' : '0'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={appointments} 
                setRows={setSearchedAppointments}
                searchRows={searchAppointments}
                isHideClinics={user.roles.includes('STAFF') ? true : false }
                />
            </div>
            <div className="appointments-categories-container">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ALL')
                        setSearchedAppointments(appointments.filter(appointment => true))
                    }}>
                        {translations[lang]['All']}
                    </div>
                    <div style={ viewStatus === 'UPCOMING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('UPCOMING')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'UPCOMING'))
                    }}>
                        {translations[lang]['Upcoming']}
                    </div>
                    <div style={ viewStatus === 'WAITING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('WAITING')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'WAITING'))
                    }}>
                        {translations[lang]['Waiting']}
                    </div>
                    <div style={ viewStatus === 'ACTIVE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ACTIVE')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'ACTIVE'))
                    }}>
                        {translations[lang]['Active']}
                    </div>
                    <div style={ viewStatus === 'DONE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('DONE')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'DONE'))
                    }}>
                        {translations[lang]['Done']}
                    </div>
                    <div style={ viewStatus === 'CANCELLED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('CANCELLED')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'CANCELLED'))
                    }}>
                        {translations[lang]['Cancelled']}
                    </div>
                    <div style={ viewStatus === 'EXPIRED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('EXPIRED')
                        setSearchedAppointments(appointments.filter(appointment => {
                            const todayDate = new Date()
                            const reservationDate = new Date(appointment.reservationTime)

                            if(todayDate > reservationDate) {
                                return true
                            }

                            return false
                        }))
                    }}>
                        {translations[lang]['Expired']}
                    </div>
                </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedAppointments.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedAppointments.map(appointment => <AppointmentCard 
                        appointment={appointment} 
                        reload={reload} 
                        setReload={setReload} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setIsShowStatusModal={setIsShowUpdateModal}
                        setTargetAppointment={setTargetAppointment}
                        setStatus={setStatus}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setShowModalForm} />
            }
        */}
        </div>
        
        
    </div>
}

export default AppointmentsPage