import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import FiltersSection from '../components/sections/filters/filters'
import EncounterCard from '../components/cards/encounter'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchEncounters } from '../utils/searches/search-encounters'
import { toast } from 'react-hot-toast'
import PageHeader from '../components/sections/page-header'
import EncounterDeleteConfirmationModal from '../components/modals/confirmation/encounter-delete-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { formatNumber } from '../utils/numbers'
import translations from '../i18n'
import FloatingButton from '../components/buttons/floating-button'


const EncountersPage = ({ roles }) => {

    const navigate = useNavigate()

    const [targetEncounter, setTargetEncounter] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [encounters, setEncounters] = useState([])
    const [searchedEncounters, setSearchedEncounters] = useState([])

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
        setIsLoading(true)
        serverRequest.get(`/v1/encounters/doctors/${user._id}`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setEncounters(data.encounters)
            setSearchedEncounters(data.encounters)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload, statsQuery])

 
    return <div className="page-container page-white-background">
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
        {
            user.roles.includes('DOCTOR') ?
            <div className="show-mobile">
                <FloatingButton url={'/encounters/form'} />
            </div>
            :   
            null
        }
        <div className="padded-container">
            <PageHeader
            pageName={translations[lang]['Encounters']}
            addBtnText={translations[lang]['Add Encounter']}
            formURL={'/encounters/form'}
            />
            <div className="cards-list-wrapper margin-bottom-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Encounters']}
                number={formatNumber(encounters.length)}
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
                rows={encounters} 
                setRows={setSearchedEncounters}
                searchRows={searchEncounters}
                isHideClinics={false}
                isCustomClincis={false}
                />
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedEncounters.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    { searchedEncounters.map(encounter => <EncounterCard 
                    encounter={encounter} 
                    setReload={setReload}
                    reload={reload}
                    setTargetEncounter={setTargetEncounter}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    />) }
                </div>
                :
                <EmptySection url={'/encounters/form'} />
            }
        </div>
        
    </div>
}

export default EncountersPage