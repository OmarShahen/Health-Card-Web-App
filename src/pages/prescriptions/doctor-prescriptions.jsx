import { useState, useEffect } from 'react'
import '../prescriptions.css'
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DoctorPrescriptionCard from '../../components/cards/doctor-prescriptions';
import FloatingButton from '../../components/buttons/floating-button';
import FavoriteIcon from '@mui/icons-material/Favorite'
import PrescriptionMobileNavBar from '../../components/navigation/prescriptions-mobile-nav-bar';
import PrescriptionsBottomNavigationBar from '../../components/navigation/doctors-bottom-bar';
import { serverRequest } from '../../components/API/request';
import { useSelector } from 'react-redux/es/exports';
import { TailSpin } from 'react-loader-spinner'


const DoctorPrescriptionsPage = () => {

    const user = useSelector(state => state.user.user)
    const [isLoading, setIsLoading] = useState(false)
    const [prescriptions, setPrescriptions] = useState([])
    const [searchPrescriptions, setSearchPrescriptions] = useState([])

    const checkSearchValue = (prescription, value) => {
        if(prescription.patientName.toLowerCase().includes(value)) {
            return true
        } else if(String(prescription.patientPhone).includes(String(Number.parseInt(value)))) {
            return true
        }

        return false
    }

    const handleSearchPrescriptions = (value) => {
        setSearchPrescriptions(prescriptions.filter(prescription => checkSearchValue(prescription, value.toLowerCase())))
    }


    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/prescriptions/doctors/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setPrescriptions(response.data.prescriptions)
            setSearchPrescriptions(response.data.prescriptions)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])

    return <div className="page-container">
        <FloatingButton url={'/prescriptions/form'} />
        <PrescriptionMobileNavBar />
        <PrescriptionsBottomNavigationBar />
        <div className="prescriptions-search-container">
            <div className="search-container">
                <input 
                type="text" 
                className="form-input" 
                placeholder="اكتب اسم الحالة" 
                onChange={e => handleSearchPrescriptions(e.target.value)}
                />
            </div>
            {/*<div className="filter-container">
                <span>
                    <CalendarMonthOutlinedIcon />
                    التاريخ
                </span>
                <span>
                    <ImportExportOutlinedIcon />
                    الترتيب
                </span>
            </div>*/}
        </div>
        <br />
        {
            isLoading ?
            <div className="loading-page-container">
                <TailSpin
                height="60"
                width="60"
                color="#2193B0"
                />
            </div>
            :
            searchPrescriptions.map(prescription => <div className="cards-list-wrapper">
                <DoctorPrescriptionCard 
                prescription={prescription}
                /><br />
            </div>)
        }
    </div>
}

export default DoctorPrescriptionsPage