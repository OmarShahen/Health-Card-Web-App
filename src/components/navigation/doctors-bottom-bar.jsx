import './navigation.css'
import { NavLink } from 'react-router-dom'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'

const DoctorsBottomBar = () => {

    return <div className="bottom-nav-bar-container">
        <ul className="prescriptions-bottom-nav-bar-list-container">
            <li>
                <NavLink to="/prescriptions">
                    <CalendarMonthOutlinedIcon />
                مواعيد  
                </NavLink>
            </li>
            <li>
                <NavLink to="/prescriptions">
                    <BadgeOutlinedIcon />
                المرضي  
                </NavLink>
            </li>
            <li>
                <NavLink to="/doctors/login">
                    <SettingsOutlinedIcon />
                الاعدادات  
                </NavLink>
            </li>
        </ul>
    </div>
}

export default DoctorsBottomBar