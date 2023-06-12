import { NavLink } from 'react-router-dom'
import './side-bar.css'
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined'
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { setIsLogged } from '../../redux/slices/userSlice'

const SideBar = () => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)

    return <div className="side-bar-container">
        <div className="side-bar-arrow-container show-mobile">
            <span onClick={e => dispatch(setIsShowSidebar(false))}>
                <ArrowBackIcon />
            </span>
        </div>
        <ul>
            {/*<li>
                <NavLink to="/">
                    <SignalCellularAltOutlinedIcon />
                    Dashboard
                </NavLink>
            </li>*/}
            {
                user.role === 'STAFF' ?
                null
                :
                <li>
                    <NavLink to="/clinics/accepted">
                        <StoreMallDirectoryOutlinedIcon />
                        Clinics
                    </NavLink>
                </li>
            }
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
                <NavLink to="/invoices">
                    <PaymentOutlinedIcon />
                    Invoices
                </NavLink>
            </li>
            {
                user.role === 'STAFF' ?
                null
                :
                <li>
                    <NavLink to="/encounters">
                        <AssignmentOutlinedIcon />
                        Encounters
                    </NavLink>
                </li>
            }
            {
                user.role === 'STAFF' ?
                null
                :
                <li>
                    <NavLink to="/prescriptions">
                        <MedicationOutlinedIcon />
                        Prescriptions
                    </NavLink>
                </li>
            }
            <li>
                <NavLink to="/settings/profile">
                    <SettingsOutlinedIcon />
                    Settings
                </NavLink>
            </li>
            {/*<li>
                <NavLink to="/">
                    <CreditCardOutlinedIcon />
                    Billings
                </NavLink>
            </li>*/}
            <li>
                <NavLink to="/support">
                    <HeadsetMicOutlinedIcon />
                    Support
                </NavLink>
            </li>
            <li>
                <NavLink to="/login" onClick={e => {
                    sessionStorage.setItem('user', null)
                    dispatch(setIsLogged(false))
                }}>
                    <LogoutOutlinedIcon />
                    Logout
                </NavLink>
            </li>
        </ul>
    </div>
}

export default SideBar