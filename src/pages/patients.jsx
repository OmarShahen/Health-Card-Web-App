import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PatientFormModal from '../components/modals/patient-form'
import PatientCardJoinFormModal from '../components/modals/patient-card-join-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import PatientCard from '../components/cards/patient'
import CachedIcon from '@mui/icons-material/Cached'
import FloatingButton from '../components/buttons/floating-button'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchPatients } from '../utils/searches/search-patients'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'

const PatientsPage = () => {

    const navigate = useNavigate()

    const [targetClinic, setTargetClinic] = useState()
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [showPatientIdForm, setShowPatientIdForm] = useState(false)
    const [showPatientDataForm, setShowPatientDataForm] = useState(false)
    const [patients, setPatients] = useState([])
    const [searchedPatients, setSearchedPatients] = useState([])
    const user = useSelector(state => state.user.user)

    useEffect(() => scroll(0,0), [])

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = user.role === 'STAFF' ? 
        `/v1/patients/clinics/${user.clinicId}`
        :
        `/v1/patients/doctors/${user._id}`    
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            setPatients(response.data.patients)
            setSearchedPatients(response.data.patients)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container page-white-background">
        <NavigationBar pageName={'Patients'} />
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setShowPatientDataForm} />
        </div>
        {
            showPatientIdForm ?
            <PatientCardJoinFormModal
            setShowModalForm={setShowPatientIdForm} 
            reload={reload}
            setReload={setReload}
            />
            :
            null
        }

        {
            showPatientDataForm ?
            <PatientFormModal
            setShowModalForm={setShowPatientDataForm}
            reload={reload}
            setReload={setReload}
            />
            :
            null
        }
            <div className="padded-container">
                <div className="page-header-wrapper">
                    <div className="back-button-container">
                        <ArrowBackIcon />
                        <span onClick={e => navigate(-1)}>Back</span>
                    </div>
                    <div className="page-header-container">
                        <div>
                            <h1>
                                Patients
                            </h1>
                        </div>
                        <div 
                        className="btns-container subheader-text">
                            <button onClick={e => navigate('/patients/form')}><AddOutlinedIcon /><strong>Create patient</strong></button>
                            <button onClick={e => setShowPatientIdForm(true)}><AddOutlinedIcon /><strong>Add patient by ID</strong></button>
                        </div>
                        <div className="header-mobile-icons-container">
                            <div onClick={e => setReload(reload + 1)}>
                                <CachedIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="search-input-container">
                        <SearchInput 
                        rows={patients} 
                        setRows={setSearchedPatients}
                        searchRows={searchPatients}
                        setTargetClinic={setTargetClinic}
                        />
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedPatients.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedPatients.map(patient => <PatientCard patient={patient} setReload={setReload} reload={reload} />)}
                    </div>
                    :
                    <EmptySection setIsShowForm={setShowPatientDataForm} />
    }
        </div>
        </div>
    </div>
}

export default PatientsPage