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

const PatientEncountersPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const patient = useSelector(state => state.patient.patient)
    const user = useSelector(state => state.user.user)

    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [encounters, setEncounters] = useState([])
    const [searchedEncounters, setSearchedEncounters] = useState([])

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }

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
        <PageHeader 
        pageName={"Encounters"} 
        addBtnText={'Add Encounter'} 
        formURL={`/encounters/form?cardId=${patient.cardId}`}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="show-mobile">
            <FloatingButton url={`/encounters/form?cardId=${patient.cardId}`} />
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
                    />
                </div>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedEncounters.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedEncounters.map(encounter => <EncounterCard encounter={encounter} />)}
                        </div>
                        :
                        <EmptySection url={`/encounters/form?cardId=${patient.cardId}`} />
                    }
                </div>
            </div>
        </div>
    </div>
}

export default PatientEncountersPage