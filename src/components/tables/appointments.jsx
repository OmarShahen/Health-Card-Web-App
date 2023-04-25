import { useState, useEffect } from 'react'
import './table.css'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import CircleIcon from '@mui/icons-material/Circle'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { format } from 'date-fns'
import { getTime } from '../../utils/time'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'


const AppointmentsTable = ({ appointments, setAppointments, reload, setReload }) => {

    const [searchedRows, setSearchedRows] = useState(appointments)
    const [viewStatus, setViewStatus] = useState('ALL')

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
            return <div className="table-appointment-status green">
                    {status}
            </div>
        } else if(status === 'CANCELLED') {
            return <span className="red">{status}</span>
        } else if(status === 'UPCOMING') {
            return <span className="blue">{status}</span>
        } else if(status === 'WAITING') {
            return <span className="light-blue">{status}</span>
        } else if(status === 'ACTIVE') {
            return <span className="purple">{status}</span>
        } else {
            return <span className="grey">{status}</span>
        }
    }

    return <div>
                <div className="table-columns-categories-container">
                    <div style={ viewStatus === 'ALL' ? { border: '2px solid #5c60f5', color: '#5c60f5'} : null}onClick={e => {
                        setViewStatus('ALL')
                        setSearchedRows(appointments.filter(appointment => true))
                    }}>
                        All
                    </div>
                    <div style={ viewStatus === 'UPCOMING' ? { border: '2px solid #5c60f5', color: '#5c60f5'} : null}onClick={e => {
                        setViewStatus('UPCOMING')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'UPCOMING'))
                    }}>
                        Upcoming
                    </div>
                    <div style={ viewStatus === 'WAITING' ? { border: '2px solid #5c60f5', color: '#5c60f5'} : null}onClick={e => {
                        setViewStatus('WAITING')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'WAITING'))
                    }}>
                        Waiting
                    </div>
                    <div style={ viewStatus === 'ACTIVE' ? { border: '2px solid #5c60f5', color: '#5c60f5'} : null}onClick={e => {
                        setViewStatus('ACTIVE')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'ACTIVE'))
                    }}>
                        Active
                    </div>
                    <div style={ viewStatus === 'DONE' ? { border: '2px solid #5c60f5', color: '#5c60f5'} : null}onClick={e => {
                        setViewStatus('DONE')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'DONE'))
                    }}>
                        Done
                    </div>
                    <div style={ viewStatus === 'CANCELLED' ? { border: '2px solid #5c60f5', color: '#5c60f5'} : null}onClick={e => {
                        setViewStatus('CANCELLED')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'CANCELLED'))
                    }}>
                        Cancelled
                    </div>
                    <div style={ viewStatus === 'EXPIRED' ? { border: '2px solid #5c60f5', color: '#5c60f5'} : null}onClick={e => {
                        setViewStatus('EXPIRED')
                        setSearchedRows(appointments.filter(appointment => appointment.status === 'EXPIRED'))
                    }}>
                        Expired
                    </div>
                </div>
                <div className="table-columns-filters-container">
                    <div>
                        <span><AddCircleOutlinedIcon />Patient name</span>
                        <span><AddCircleOutlinedIcon />Patient phone</span>
                        <span><AddCircleOutlinedIcon /> Doctor name</span>
                        <span><AddCircleOutlinedIcon />Doctor phone</span>
                        <span><AddCircleOutlinedIcon />Reservation date</span>
                    </div>
                    <span>Clear Filters</span>
                </div>
            <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>PATIENT NAME</th>
                    <th>PATIENT PHONE</th>
                    <th>DOCTOR NAME</th>
                    <th>DOCTOR PHONE</th>
                    <th>STATUS</th>
                    <th>RESERVATION DATE</th>
                    <th></th>
                </tr>
                
                {searchedRows.map(appointment => <tr>
                    <td>
                        {appointment.patientName}
                    </td>
                    <td>
                        {`+${appointment.patientCountryCode}${appointment.patientPhone}`}
                    </td>
                    <td>
                        {appointment.doctor.firstName + ' ' + appointment.doctor.lastName}
                    </td>
                    <td>
                        {`+${appointment.doctor.countryCode}${appointment.doctor.phone}`}
                    </td>
                    <td>
                        {renderAppointmentStatus(appointment.status)}
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