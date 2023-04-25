import './navigation.css'
import { NavLink } from 'react-router-dom'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined'
import { useSelector } from 'react-redux'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'

const TabBar = () => {

    const patientUUID = useSelector(state => state.patient.patientUUID)

    return <div className="tab-bar-container">
        <ul>
            <li>
                <NavLink to={`/patients`}>
                    <Person2OutlinedIcon />
                الحالات  
                </NavLink>
            </li>
            <li>
                <NavLink to={`/appointments`}>
                    <CalendarMonthOutlinedIcon />
                 الحجوزات
                </NavLink>
            </li>
            <li>
                <NavLink to={`/settings`}>
                    <MoreHorizOutlinedIcon />
                 المزيد
                </NavLink>
            </li>
        </ul>
    </div>
}

export default TabBar