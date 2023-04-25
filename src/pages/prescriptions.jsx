import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import Card from '../components/cards/card'
import PrescriptionCard from '../components/cards/patient-prescriptions';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import { AssignmentOutlined } from '@mui/icons-material'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import { serverRequest } from '../components/API/request'
import toast from 'react-hot-toast'
import PrescriptionsTable from '../components/tables/prescriptions'

const PrescriptionsPage = () => {

    const [reload, setReload] = useState(0)
    const [prescriptions, setPrescriptions] = useState([])
    const [searchedPrescriptions, setSearchedPrescriptions] = useState([])

    useEffect(() => {
        serverRequest.get(`/v1/prescriptions/doctors/63efbbe147537b9ccb47e9d6`)
        .then(response => {
            setPrescriptions(response.data.prescriptions)
            setSearchedPrescriptions(response.data.prescriptions)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    

    const getTotalMedicines = (prescriptions) => {
        let total = 0
        for(let i=0;i<prescriptions.length;i++) {
            total += prescriptions[i].medicines.length
        }

        return total
    }

    const searchPrescriptions = (prescription, target) => {

        const name = `${prescription.patient.firstName} ${prescription.patient.lastName}`.toLowerCase()
        const phone = `${prescription.patient.countryCode}${prescription.patient.phone}`

        if(name.includes(target.toLowerCase())) {
            return true
        } else if(phone.includes(target.toLowerCase())) {
            return true
        }

        for(let i=0;i<prescription.medicines.length;i++) {
            let drug = prescription.medicines[i]
            if(drug.name.toLowerCase().includes(target.toLowerCase())) {
                return true
            }
        }

        return false
    }

    return <div className="page-container">
               
        <div className="padded-container">
            <PageHeader pageName="Prescriptions" addBtnText={"Add Prescription"} /> 
            <PrescriptionsTable 
            prescriptions={prescriptions} 
            reload={reload} 
            setReload={setReload} 
            />
        </div>
        
    </div>
}

export default PrescriptionsPage