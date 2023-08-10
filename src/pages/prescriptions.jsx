import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import FiltersSection from '../components/sections/filters/filters'
import PrescriptionCard from '../components/cards/prescription'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchPrescriptions } from '../utils/searches/search-prescriptions'
import { useNavigate } from 'react-router-dom'
import PrescriptionDeleteConfirmationModal from '../components/modals/confirmation/prescription-delete-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { formatNumber } from '../utils/numbers'
import FloatingButton from '../components/buttons/floating-button'
import translations from '../i18n'


const PrescriptionsPage = ({ roles }) => {

    const navigate = useNavigate()
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [targetPrescription, setTargetPrescription] = useState({})

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [prescriptions, setPrescriptions] = useState([])
    const [searchedPrescriptions, setSearchedPrescriptions] = useState([])

    const todayDate = new Date()
    const weekDate = new Date()

    todayDate.setDate(todayDate.getDate() + 1)
    weekDate.setDate(weekDate.getDate() - 7)

    const [statsQuery, setStatsQuery] = useState({ from: weekDate, to: todayDate })

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0,0)
    }, [])

    useEffect(() => {

        let endpointURL = ''

        if(user.roles.includes('STAFF')) {
            endpointURL = `/v1/prescriptions/clinics/${user.clinicId}`
        } else {
            endpointURL = `/v1/prescriptions/doctors/${user._id}`
        }

        setIsLoading(true)
        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setPrescriptions(response.data.prescriptions)
            setSearchedPrescriptions(response.data.prescriptions)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
        <NavigationBar pageName={translations[lang]['Prescriptions']} />
        { 
        isShowModal ? 
        <PrescriptionDeleteConfirmationModal 
        prescription={targetPrescription}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowModal}
        /> 
        : 
        null 
        }
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]['Prescriptions']} 
            addBtnText={user.roles.includes('STAFF') ? null : translations[lang]["Add Prescription"]}
            formURL={"/prescriptions/form"}
            reload={reload}
            setReload={setReload}
            />
            <div className="show-mobile">
                <FloatingButton url={'/prescriptions/form'} />
            </div>
            <div className="cards-list-wrapper margin-bottom-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Prescriptions']}
                number={formatNumber(prescriptions.length)}
                iconColor={'#5C60F5'}
                />
            </div>
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'-7'}
            />

            <div className="search-input-container">
                <SearchInput 
                rows={prescriptions} 
                setRows={setSearchedPrescriptions}
                searchRows={searchPrescriptions}
                isHideClinics={user.roles.includes('STAFF') ? true : false }
                />
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedPrescriptions.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {searchedPrescriptions.map(prescription =><PrescriptionCard 
                    prescription={prescription} 
                    setReload={setReload} 
                    reload={reload} 
                    setTargetPrescription={setTargetPrescription}
                    setIsShowDeleteModal={setIsShowModal}
                    />)}
                </div>
                    
                :
                <EmptySection url={'/prescriptions/form'} />
            }
        </div>
        
    </div>
}

export default PrescriptionsPage