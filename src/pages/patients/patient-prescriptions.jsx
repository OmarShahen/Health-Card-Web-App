import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FiltersSection from '../../components/sections/filters/filters'
import PrescriptionCard from '../../components/cards/prescription'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchPrescriptions } from '../../utils/searches/search-prescriptions'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'
import PrescriptionDeleteConfirmationModal from '../../components/modals/confirmation/prescription-delete-confirmation-modal'

const PatientPrescriptionsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const patient = useSelector(state => state.patient.patient)
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [targetPrescription, setTargetPrescription] = useState()

    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [prescriptions, setPrescriptions] = useState([])
    const [searchedPrescriptions, setSearchedPrescriptions] = useState([])

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])   

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/prescriptions/patients/${patientId}`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPrescriptions(data.prescriptions)
            setSearchedPrescriptions(data.prescriptions)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div>
        { 
        isShowDeleteModal ? 
        <PrescriptionDeleteConfirmationModal
        prescription={targetPrescription}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        <PageHeader 
        pageName={translations[lang]["Prescriptions"]} 
        addBtnText={translations[lang]['Add Prescription']}
        formURL={`/patients/${patientId}/prescriptions/form`}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Prescriptions']}
            number={formatNumber(prescriptions.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        <div className="show-mobile">
            <FloatingButton url={`/patients/${patientId}/prescriptions/form`} />
        </div>
        <div>
            <div>
                <FiltersSection setStatsQuery={setStatsQuery} statsQuery={statsQuery} defaultValue={'LIFETIME'} />
                <div className="search-input-container">
                    <SearchInput 
                    rows={prescriptions} 
                    setRows={setSearchedPrescriptions}
                    searchRows={searchPrescriptions}
                    isHideSpeciality={false}
                    />
                </div>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedPrescriptions.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedPrescriptions
                            .map(prescription => <PrescriptionCard 
                            prescription={prescription}
                            setTargetPrescription={setTargetPrescription}
                            setIsShowDeleteModal={setIsShowDeleteModal}
                            />)}
                        </div>
                            
                        :
                        <EmptySection />
                    }
                </div> 
            </div>
        </div>
    </div>
}

export default PatientPrescriptionsPage