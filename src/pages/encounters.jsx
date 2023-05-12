import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import EncountersTable from '../components/tables/encounters'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import FiltersSection from '../components/sections/filters/filters'
import EncounterCard from '../components/cards/encounter'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchEncounters } from '../utils/searches/search-encounters'
import { toast } from 'react-hot-toast'
import PageHeader from '../components/sections/page-header'
import DocumentsSizes from '../components/sections/sizes/documents-size'

const EncountersPage = () => {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [encounters, setEncounters] = useState([])
    const [searchedEncounters, setSearchedEncounters] = useState([])

    const todayDate = new Date()
    const weekDate = new Date()

    todayDate.setDate(todayDate.getDate())
    weekDate.setDate(weekDate.getDate() - 7)

    const [statsQuery, setStatsQuery] = useState({ from: weekDate, to: todayDate })
    const user = useSelector(state => state.user.user)

    useEffect(() => scroll(0,0), [])

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
        <NavigationBar pageName={"Encounters"} />
        <div className="padded-container">
            <PageHeader
            pageName={'Encounters'}
            addBtnText={'Add Encounter'}
            formURL={'/encounters/form'}
            />
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
                />
            </div>
            <DocumentsSizes size={searchedEncounters.length} />
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
                    />) }
                </div>
                :
                <EmptySection url={'/encounters/form'} />
            }
        </div>
        
    </div>
}

export default EncountersPage