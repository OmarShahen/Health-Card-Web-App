import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
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
import PatientDeleteConfirmationModal from '../components/modals/confirmation/patient-delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import { isRolesValid } from '../utils/roles'
import FiltersSection from '../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../components/cards/card'
import { formatNumber } from '../utils/numbers'
import translations from '../i18n'
import PageHeader from '../components/sections/page-header'

const PatientsPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [targetPatient, setTargetPatient] = useState({})

    const [statsQuery, setStatsQuery] = useState()
    const [targetClinic, setTargetClinic] = useState()
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [showPatientIdForm, setShowPatientIdForm] = useState(false)
    const [showPatientDataForm, setShowPatientDataForm] = useState(false)
    const [patients, setPatients] = useState([])
    const [searchedPatients, setSearchedPatients] = useState([])

    useEffect(() => { 
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = user.roles.includes('STAFF') ? 
        `/v1/patients/clinics/${user.clinicId}`
        :
        `/v1/patients/doctors/${user._id}`    
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setPatients(response.data.patients)
            setSearchedPatients(response.data.patients)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        { 
        isShowDeleteModal ? 
        <PatientDeleteConfirmationModal 
        patient={targetPatient}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        <div className="show-mobile">
            { 
            user.roles.includes('STAFF') || user.roles.includes('DOCTOR') ? 
            <FloatingButton url={'/patients/form'} /> 
            : 
            null 
            }
        </div>
        
            <div className="padded-container">
                <PageHeader 
                pageName={translations[lang]['Patients']}
                formURL={'/patients/form'}
                addBtnText={translations[lang]['Add Patient']}
                />
                <div className="cards-list-wrapper margin-bottom-1">
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={translations[lang]['Patients']}
                    number={formatNumber(patients.length)}
                    iconColor={'#5C60F5'}
                    />
                </div>
                <div>
                    <FiltersSection 
                    setStatsQuery={setStatsQuery} 
                    statsQuery={statsQuery}
                    defaultValue={'LIFETIME'}
                    />
                    <div className="search-input-container">
                        <SearchInput 
                        rows={patients} 
                        setRows={setSearchedPatients}
                        searchRows={searchPatients}
                        setTargetClinic={setTargetClinic}
                        isHideClinics={user.roles.includes('STAFF') ? true : false }
                        />
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedPatients.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedPatients.map((patient, index) => <PatientCard 
                                patient={patient} 
                                setReload={setReload} 
                                reload={reload}
                                setIsShowDeleteModal={setIsShowDeleteModal}
                                setTargetPatient={setTargetPatient}
                                />
                            )}
                    </div>
                    :
                    <EmptySection setIsShowForm={setShowPatientDataForm} />
    }
        </div>
        </div>
    </div>
}

export default PatientsPage