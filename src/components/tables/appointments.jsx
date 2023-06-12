import { useState, useEffect } from 'react'
import './table.css'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { format } from 'date-fns'
import { getTime } from '../../utils/time'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'


const AppointmentsTable = ({ appointments, setAppointments, reload, setReload, setStatsQuery, statsQuery }) => {

    const [searchedRows, setSearchedRows] = useState(appointments)
    const [viewStatus, setViewStatus] = useState('ALL')

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    useEffect(() => setSearchedRows(appointments), [appointments])

    const searchRows = (appointment, value) => {

        const patientName = appointment.patientName.toLowerCase()
        const patientPhone = `${appointment.patientCountryCode}${appointment.patientPhone}`
        const doctorName = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`.toLowerCase()
        const doctorPhone = `${appointment.doctor.countryCode}${appointment.doctor.phone}`

        if(patientName.includes(value)) {
            return true
        } else if(patientPhone.includes(value)) {
            return true
        } else if(doctorName.includes(value)) {
            return true
        } else if(doctorPhone.includes(value)) {
            return true
        }

        return false
    }

    const updateAppointmentStatus = (appointmentId, status) => {

        serverRequest.patch(`/v1/appointments/${appointmentId}/status`, { status })
        .then(response => {
            const data = response.data
            const updatedAppointment = data.appointment

            setAppointments(appointments.map(appointment => {
                if(appointment._id === updatedAppointment._id) {
                    appointment.status = updatedAppointment.status
                }

                return appointment
            }))
            setViewStatus('ALL')
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const deleteAppointment = (appointmentId) => {

        serverRequest.delete(`/v1/appointments/${appointmentId}`)
        .then(response => {
            const data = response.data
            const deletedAppointment = data.appointment
            setAppointments(appointments.filter(appointment => appointment._id !== deletedAppointment._id))
            setViewStatus('ALL')
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const renderAppointmentStatus = (status) => {

        if(status === 'DONE') {
            return <div>
                <span className="tag-green-text"><FiberManualRecordIcon /></span>
                {status}
            </div>
        } else if(status === 'CANCELLED') {
            return <div>
                    <span className="tag-red-text"><FiberManualRecordIcon /></span>
                    {status}
                </div>
        } else if(status === 'UPCOMING') {
            return <div>
                <span className="tag-purple-text"><FiberManualRecordIcon /></span>
                {status}
            </div>
        } else if(status === 'WAITING') {
            return <div>
                <span className="tag-orange-text"><FiberManualRecordIcon /></span>
                {status}
            </div>
        } else if(status === 'ACTIVE') {
            return <div>
                <span className="tag-light-blue-text"><FiberManualRecordIcon /></span>
                {status}
            </div>
        } else {
            return <div>
                <span className="tag-grey-text"><FiberManualRecordIcon /></span>
                {status}
            </div>
        }
    }

    return <div>
                <div className="table-columns-categories-container">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ALL')
                        setSearchedRows(appointments.filter(appointment => true))
                    }}>
                        All
                    </div>
                    <div style={ viewStatus === 'UPCOMING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('UPCOMING')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'UPCOMING'))
                    }}>
                        Upcoming
                    </div>
                    <div style={ viewStatus === 'WAITING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('WAITING')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'WAITING'))
                    }}>
                        Waiting
                    </div>
                    <div style={ viewStatus === 'ACTIVE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ACTIVE')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'ACTIVE'))
                    }}>
                        Active
                    </div>
                    <div style={ viewStatus === 'DONE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('DONE')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'DONE'))
                    }}>
                        Done
                    </div>
                    <div style={ viewStatus === 'CANCELLED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('CANCELLED')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'CANCELLED'))
                    }}>
                        Cancelled
                    </div>
                    <div style={ viewStatus === 'EXPIRED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('EXPIRED')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'EXPIRED'))
                    }}>
                        Expired
                    </div>
                </div>
            <div className="table-container body-text">
                <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Appointments</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search appointments..."
                        onChange={e => setSearchedRows(appointments.filter(row => searchRows(row, e.target.value)))}
                        />
                    </div>
                    <div className="refresh-button-container">
                        <button
                        onClick={e => setReload(reload+1)}
                        className="normal-button action-color-bg white-text icon-button">
                            <RefreshIcon />
                            Refresh
                        </button>
                    </div>
                </div>
            <table>
                <tr className="table-header-rows">
                    <th>Patient Name</th>
                    <th>Patient Phone</th>
                    <th>Doctor Name</th>
                    {/*<th>Doctor Phone</th>*/}
                    <th>Status</th>
                    <th>Visit Reason</th>
                    <th>Reservation Date</th>
                    <th>Actions</th>
                </tr>
                
                {searchedRows.slice(0, 40).map(appointment => <tr>
                    <td>
                        {appointment.patientName}
                    </td>
                    <td>
                        {`+${appointment.patientCountryCode}${appointment.patientPhone}`}
                    </td>
                    <td>
                        {appointment.doctor.firstName + ' ' + appointment.doctor.lastName}
                    </td>
                    {/*<td>
                        {`+${appointment.doctor.countryCode}${appointment.doctor.phone}`}
                    </td>*/}
                    <td className="icon-row">
                        {renderAppointmentStatus(appointment.status)}
                    </td>
                    <td>
                        { appointment.visitReason ? appointment.visitReason.name : 'Not Registered' }
                    </td>
                    <td>{`${format(new Date(appointment.reservationTime), 'dd MMM yyyy')} ${getTime(appointment.reservationTime)}`}</td>
                    <td className="actions-container">
                        <MoreHorizOutlinedIcon />
                        <div className="actions-dropdown-container">
                            <ul>
                                <li onClick={e => updateAppointmentStatus(appointment._id, 'UPCOMING')}>Upcoming</li>
                                <li onClick={e => updateAppointmentStatus(appointment._id, 'WAITING')}>Waiting</li>
                                <li onClick={e => updateAppointmentStatus(appointment._id, 'ACTIVE')}>Active</li>
                                <li onClick={e => updateAppointmentStatus(appointment._id, 'DONE')}>Done</li>
                                <li onClick={e => updateAppointmentStatus(appointment._id, 'CANCELLED')}>Cancelled</li>
                                <li onClick={e => deleteAppointment(appointment._id)}>Delete</li>
                            </ul>
                        </div>
                    </td>
                </tr>)}
            </table>
            <div className="table-footer grey-text">
                <p>{searchedRows.length} results found</p>
            </div>
        </div>
    </div>
}

export default AppointmentsTable