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
import PatientDeleteConfirmationModal from '../components/modals/confirmation/patient-delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import { isRolesValid } from '../utils/roles'
import FiltersSection from '../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../components/cards/card'
import { formatNumber } from '../utils/numbers'
import translations from '../i18n'

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
        <NavigationBar pageName={translations[lang]['Patients']} />
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
            { user.roles.includes('DOCTOR') ? <FloatingButton setIsShowForm={setShowPatientIdForm} /> : null }
            { user.roles.includes('STAFF') ? <FloatingButton url={'/patients/form'} /> : null }
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
                        <span onClick={e => navigate(-1)}>{translations[lang]['Back']}</span>
                    </div>
                    <div className="page-header-container">
                        <div>
                            <h1>
                                {translations[lang]['Patients']}
                            </h1>
                        </div>
                        <div 
                        className="btns-container subheader-text">
                            { user.roles.includes('STAFF') ? <button onClick={e => navigate('/patients/form')}><AddOutlinedIcon /><strong>{translations[lang]['Create Patient']}</strong></button> : null }
                            { user.roles.includes('DOCTOR') || user.roles.includes('STAFF') ? <button onClick={e => setShowPatientIdForm(true)}><AddOutlinedIcon /><strong>{translations[lang]['Add patient by card']}</strong></button> : null }
                        </div>
                        <div className="header-mobile-icons-container">
                            <div onClick={e => setReload(reload + 1)}>
                                <CachedIcon />
                            </div>
                        </div>
                    </div>
                </div>
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