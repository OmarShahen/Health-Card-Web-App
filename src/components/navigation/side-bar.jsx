import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './side-bar.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
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
import { setIsLogged, setMode } from '../../redux/slices/userSlice'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import { serverRequest } from '../API/request'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { formatNumber } from '../../utils/numbers'
import { setNumberOfInvitations } from '../../redux/slices/invitationSlice'
import { toast } from 'react-hot-toast'
import { capitalizeFirstLetter } from '../../utils/formatString'
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined'
import { motion, AnimatePresence } from "framer-motion";
import logoImage from '../../assets/memories.png'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import format from 'date-fns/format'
import translations from '../../i18n'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'


const SideBar = ({ width, isHideText, setHideSideBar }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const numberOfInvitations = useSelector(state => state.invitation.numberOfInvitations)

    const [numberOfAppointments, setNumberOfAppointments] = useState(0)

    useEffect(() => {

        if(!user.roles.includes('OWNER')) {
            return
        }

        serverRequest.get(`/v1/users/${user._id}/mode`)
        .then(response => {
            dispatch(setMode(response.data.mode))
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics-requests/users/${user._id}/status/PENDING`)
        .then(response => {
            dispatch(setNumberOfInvitations(response.data.clinicsRequests.length))
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {

        if(!user.roles.includes('DOCTOR') && !user.roles.includes('STAFF')) {
            return
        }

        const todayDate = new Date()

        const statsQuery = { specific: format(todayDate, 'yyyy-MM-dd') }

        const endpointURL = user.roles.includes('DOCTOR') ? 
        `/v1/appointments/doctors/${user._id}/status/UPCOMING`
        :
        `/v1/appointments/clinics/${user.clinicId}/status/UPCOMING`

        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setNumberOfAppointments(response.data.appointments.length)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    return <div className="side-bar-container body-text" style={{ width }}>
        <AnimatePresence>
      <motion.div
        className="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
      >
        <div className="side-bar-arrow-container show-mobile">
            <span onClick={e => dispatch(setIsShowSidebar(false))}>
                <ArrowBackIcon />
            </span>
        </div>
        <div className="center side-bar-logo-container">
            <img src={logoImage} />
        </div>
        {
            user?.roles?.includes('OWNER') && user.mode ?
            <div className="center margin-vertical-1">
                {
                    user.mode === 'TEST' ?
                    <span className="status-btn tag-green-bg white-text box-shadow span-text bold-text">
                        {capitalizeFirstLetter(user?.mode)} mode
                    </span>
                    :
                    <span className="status-btn tag-red-bg white-text box-shadow span-text bold-text">
                        {capitalizeFirstLetter(user?.mode)} mode
                    </span>
                }
                
            </div>
            :
            null
        }
        
        <ul>
            {
                user?.roles?.includes('STAFF') ?
                null
                :
                <li>
                    <NavLink to="/clinics/owned">
                        <span>
                            <StoreMallDirectoryOutlinedIcon />
                            {isHideText ? null : translations[lang]['Clinics'] }
                        </span>
                    </NavLink>
                    
                </li>
            }
            {
                user.roles.includes('OWNER') ?
                <li>
                    <NavLink to="/insurance-companies">
                        <span>
                            <HomeWorkOutlinedIcon />
                            { isHideText ? null : 'Insurance Companies' }
                        </span>
                    </NavLink>
                </li>
                :
                null
            }
            {
                user?.roles?.includes('STAFF') ?
                null
                :
                <li>
                    <NavLink to="/clinics/invitations">
                        <span>
                            <EmailOutlinedIcon />
                            { isHideText ? null : translations[lang]['Invitations'] }
                        </span>
                        <span className="side-bar-number-container span-text">{formatNumber(numberOfInvitations)}</span>
                    </NavLink>
                </li>
            }
            <li>
                <NavLink to="/patients">
                    <span>
                        <HotelOutlinedIcon />
                        {isHideText ? null : translations[lang]['Patients'] }
                    </span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/appointments">
                    <span>
                        <CalendarMonthOutlinedIcon />
                        {isHideText ? null : translations[lang]['Appointments'] }
                    </span>
                    <span className="side-bar-number-container span-text">{formatNumber(numberOfAppointments)}</span>
                </NavLink>
            </li>
            {
                user?.roles?.includes('OWNER') || user?.roles?.includes('STAFF') ?
                <li>
                    <NavLink to="/doctors">
                        <span>
                            <MedicalInformationOutlinedIcon />
                            { isHideText ? null : translations[lang]['Doctors'] }
                        </span>
                    </NavLink>
                </li>
                :
                null
            }
            {
                user?.roles?.includes('OWNER') ?
                <li>
                    <NavLink to="/staffs">
                        <span>
                            <AssignmentIndOutlinedIcon />
                            { isHideText ? null : translations[lang]['Staffs'] }
                        </span>
                    </NavLink>
                </li>
                :
                null
            }
            {
                user?.roles?.includes('OWNER') || user?.roles?.includes('STAFF') ?
                <li>
                    <NavLink to="/invoices">
                        <span>
                            <PaymentOutlinedIcon />
                            {isHideText ? null : translations[lang]['Invoices'] }
                        </span>
                    </NavLink>
                </li>
                :
                null
            }
            {
                user.roles.includes('OWNER') || user.roles.includes('DOCTOR') ?
                <li>
                    <NavLink to="/billing/packages">
                        <span>
                            <PaymentsOutlinedIcon />
                            { isHideText ? null : translations[lang]['Billing Plans'] }
                        </span>
                    </NavLink>
                </li>
                :
                null
            }
            {
                !user?.roles?.includes('DOCTOR') ?
                null
                :
                <li>
                    <NavLink to="/encounters">
                        <span>
                            <AssignmentOutlinedIcon />
                            {isHideText ? null : translations[lang]['Encounters'] }
                        </span>
                    </NavLink>
                </li>
            }
            {
                user?.roles?.includes('DOCTOR') ?
                <li>
                    <NavLink to="/prescriptions">
                        <span>
                            <MedicationOutlinedIcon />
                            {isHideText ? null : translations[lang]['Prescriptions'] }
                        </span>
                    </NavLink>
                </li>
                :
                null
            }
            <li>
                <NavLink to="/support">
                    <span>
                        <HeadsetMicOutlinedIcon />
                        {isHideText ? null : translations[lang]['Support'] }
                    </span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/login" onClick={e => {
                    sessionStorage.setItem('user', null)
                    dispatch(setIsLogged(false))
                }}>
                    <span>
                        <LogoutOutlinedIcon />
                        {isHideText ? null : translations[lang]['Logout'] }
                    </span>
                </NavLink>
            </li>
        </ul>
        {
            (user?.roles?.includes('DOCTOR') || user?.roles?.includes('OWNER')) && user.mode === 'TEST' ?
            <div className="center margin-vertical-1">
                <NavLink to="/billing/packages" className="upgrade-container action-color-bg white-text">
                    <UpgradeOutlinedIcon />
                    Upgrade
                </NavLink>
            </div>
            :
            null
        }
    </motion.div>
    </AnimatePresence>
    </div>
}

export default SideBar