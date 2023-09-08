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
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'

const PatientSymptomsPage = ({ roles }) => {


    const navigate = useNavigate()
    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

    const patientProfile = useSelector(state => state.patient.patient)
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

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

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

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
        pageName={translations[lang]["Symptoms"]} 
        addBtnText={translations[lang]['Add Encounter']} 
        formURL={`/encounters/form?cardId=${patientProfile.cardId}`}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Symptoms']}
            number={formatNumber(symptoms.length)}
            iconColor={'#5C60F5'}
            />
        </div>
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
                    isHideSpeciality={false}
                    isHideClinics={true}
                    />
                </div>
                <div>
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