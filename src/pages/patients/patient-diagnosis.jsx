import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FiltersSection from '../../components/sections/filters/filters'
import DiagnoseCard from '../../components/cards/diagnose'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchDiagnosis } from '../../utils/searches/search-diagnosis'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'

const PatientDiagnosisPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const patient = useSelector(state => state.patient.patient)
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [diagnosis, setDiagnosis] = useState([])
    const [searchedDiagnosis, setSearchedDiagnosis] = useState([])
    
    const getEncountersDiagnosis = (encounters) => {
        let diagnosis = []
        for(let i=0;i<encounters.length;i++) {
            let encounter = encounters[i]
            for(let j=0;j<encounter.diagnosis.length;j++) {
                diagnosis.push({ doctor: encounter.doctor, diagnose: encounter.diagnosis[j], createdAt: encounter.createdAt })
            }
        }

        return diagnosis
    }

    useEffect(() => {
        scroll(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/encounters/patients/${patientId}`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const diagnosis = getEncountersDiagnosis(response.data.encounters)
            setDiagnosis(diagnosis)
            setSearchedDiagnosis(diagnosis)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])



    return <div>
        <PageHeader 
        pageName={translations[lang]["Diagnosis"]} 
        addBtnText={translations[lang]['Add Encounter']} 
        formURL={`/encounters/form?cardId=${patient.cardId}`}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Diagnosis']}
            number={formatNumber(diagnosis.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        <div className="show-mobile">
            <FloatingButton url={`/encounters/form?cardId=${patient.cardId}`} />
        </div>
        <div>
            <div>
                <FiltersSection setStatsQuery={setStatsQuery} statsQuery={statsQuery} defaultValue={'LIFETIME'} />
                <div className="search-input-container">
                    <SearchInput 
                    rows={diagnosis} 
                    setRows={setSearchedDiagnosis}
                    searchRows={searchDiagnosis}
                    isHideSpeciality={false}
                    isHideClinics={true}
                    />
                </div>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedDiagnosis.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedDiagnosis.map(diagnose => <DiagnoseCard diagnose={diagnose} />)}
                        </div>
                        :
                        <EmptySection url={`/encounters/form?cardId=${patient.cardId}`} />
                    }
                </div>
            </div>
        </div>
    </div>
}

export default PatientDiagnosisPage