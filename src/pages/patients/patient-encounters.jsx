import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FiltersSection from '../../components/sections/filters/filters'
import EncounterCard from '../../components/cards/encounter'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchEncounters } from '../../utils/searches/search-encounters'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'
import EncounterDeleteConfirmationModal from '../../components/modals/confirmation/encounter-delete-confirmation-modal'

const PatientEncountersPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const patient = useSelector(state => state.patient.patient)
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [targetEncounter, setTargetEncounter] = useState()

    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [encounters, setEncounters] = useState([])
    const [searchedEncounters, setSearchedEncounters] = useState([])

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/encounters/patients/${patientId}`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setEncounters(response.data.encounters)
            setSearchedEncounters(response.data.encounters)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div>
        { 
        isShowDeleteModal ? 
        <EncounterDeleteConfirmationModal
        encounter={targetEncounter}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        <PageHeader 
        pageName={translations[lang]["Encounters"]} 
        addBtnText={translations[lang]['Add Encounter']}
        formURL={`/patients/${patientId}/encounters/form`}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Encounters']}
            number={formatNumber(encounters.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        <div className="show-mobile">
            <FloatingButton url={`/patients/${patientId}/encounters/form`} />
        </div>
        <div>
            <div>
                <FiltersSection 
                setStatsQuery={setStatsQuery} 
                statsQuery={statsQuery}
                defaultValue={'LIFETIME'}
                />
                <div className="search-input-container">
                    <SearchInput 
                    rows={encounters} 
                    setRows={setSearchedEncounters}
                    searchRows={searchEncounters}
                    isHideSpeciality={false}
                    />
                </div>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedEncounters.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedEncounters
                            .map(encounter => <EncounterCard 
                            encounter={encounter}
                            setTargetEncounter={setTargetEncounter}
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

export default PatientEncountersPage