import { useState, useEffect } from 'react'
import PrescriptionCard from "../components/cards/prescription"
import './prescriptions.css'
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PatientCard from "../components/cards/patient"
import { useNavigate } from "react-router-dom"
import ScanButton from "../components/buttons/scan-button"
import DoctorsBottomBar from "../components/navigation/doctors-bottom-bar"
import { serverRequest } from "../components/API/request";
import { useSelector } from 'react-redux'
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

const SettingsPage = () => {

    const navigate = useNavigate()

    const [patients, setPatients] = useState([])
    const [searchedPatients, setSearchedPatients] = useState([])
    const user = useSelector(state => state.user.user)

    return <div className="page-container">
         <div className="options-container">
            <div>
                <div className="option-icon-container light-text-color">
                    <AccountCircleOutlinedIcon />
                </div>
                <div className="option-body-container">
                    <span>حسابي</span>
                    <span>
                        <ChevronLeftOutlinedIcon />
                    </span>
                </div>
            </div>
            <div>
                <div className="option-icon-container light-text-color">
                    <HeadsetMicOutlinedIcon />
                </div>
                <div className="option-body-container">
                    <span>الدعم</span>
                    <span>
                        <ChevronLeftOutlinedIcon />
                    </span>
                </div>
            </div>
            <div>
                <div className="option-icon-container light-text-color">
                    <SettingsOutlinedIcon />
                </div>
                <div className="option-body-container">
                    <span>الاعدادات</span>
                    <span>
                        <ChevronLeftOutlinedIcon />
                    </span>
                </div>
            </div>
            <div>
                <div className="option-icon-container light-text-color">
                    <LogoutOutlinedIcon />
                </div>
                <div className="option-body-container">
                    <span>الخروج</span>
                    <span>
                        <ChevronLeftOutlinedIcon />
                    </span>
                </div>
            </div>
        </div>
    </div>
}

export default SettingsPage