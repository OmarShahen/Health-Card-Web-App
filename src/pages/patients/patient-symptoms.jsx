import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FiltersSection from '../../components/sections/filters/filters'
import SymptomCard from '../../components/cards/symptom'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchSymptoms } from '../../utils/searches/search-symptoms'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import DocumentsSizes from '../../components/sections/sizes/documents-size'

const PatientSymptomsPage = () => {


    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const patientProfile = useSelector(state => state.patient.patient)
    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [patient, setPatient] = useState({})
    const [symptoms, setSymptoms] = useState([])
    const [searchedSymptoms, setSearchedSymptoms] = useState([])
    
    const getEncountersSymptoms = (encounters) => {
        let symptoms = []
        for(let i=0;i<encounters.length;i++) {
            let encounter = encounters[i]
            for(let j=0;j<encounter.symptoms.length;j++) {
                symptoms.push({ doctor: encounter.doctor, symptom: encounter.symptoms[j], createdAt: encounter.createdAt })
            }
        }

        return symptoms
    }

    useEffect(() => scroll(0,0), [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/encounters/patients/${patientId}`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const symptoms = getEncountersSymptoms(response.data.encounters)
            setSymptoms(symptoms)
            setSearchedSymptoms(symptoms)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })

    }, [reload, statsQuery])



    return <div>
        <PageHeader 
        pageName={"Symptoms"} 
        addBtnText={'Add Encounter'} 
        formURL={`/encounters/form?cardId=${patientProfile.cardId}`}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="show-mobile">
            <FloatingButton url={`/encounters/form?cardId=${patientProfile.cardId}`} />
        </div>
        <div>
            <div>
                <FiltersSection setStatsQuery={setStatsQuery} statsQuery={statsQuery} defaultValue={'LIFETIME'} />
                <div className="search-input-container">
                    <SearchInput 
                    rows={symptoms} 
                    setRows={setSearchedSymptoms}
                    searchRows={searchSymptoms}
                    />
                </div>
                <div>
                    <DocumentsSizes size={searchedSymptoms.length} />
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedSymptoms.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            { searchedSymptoms.map(symptom => <SymptomCard symptom={symptom} />) }
                        </div> 
                        :
                        <EmptySection url={`/encounters/form?cardId${patient.cardId}`} />
                    }
                </div> 
            </div>
        </div>
    </div>
}

export default PatientSymptomsPage