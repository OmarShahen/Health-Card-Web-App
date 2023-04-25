import { NavLink } from 'react-router-dom'
import './side-bar.css'
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'

const SideBar = () => {

    return <div className="side-bar-container">
        <ul>
            <li>
                <NavLink to="/">
                    <SignalCellularAltOutlinedIcon />
                    Dashboard
                </NavLink>
            </li>
            <li>
                <NavLink to="/patients">
                    <HotelOutlinedIcon />
                    Patients
                </NavLink>
            </li>
            <li>
                <NavLink to="/appointments">
                    <CalendarMonthOutlinedIcon />
                    Appointments
                </NavLink>
            </li>
            <li>
                <NavLink to="/encounters">
                    <AssignmentOutlinedIcon />
                    Encounters
                </NavLink>
            </li>
            <li>
                <NavLink to="/prescriptions">
                    <MedicationOutlinedIcon />
                    Prescriptions
                </NavLink>
            </li>
            <li>
                <NavLink to="/">
                    <SettingsOutlinedIcon />
                    Settings
                </NavLink>
            </li>
            <li>
                <NavLink to="/">
                    <CreditCardOutlinedIcon />
                    Billings
                </NavLink>
            </li>
            <li>
                <NavLink to="/">
                    <LogoutOutlinedIcon />
                    Logout
                </NavLink>
            </li>
        </ul>
    </div>
}

export default SideBar