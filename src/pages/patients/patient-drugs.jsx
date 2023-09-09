import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FiltersSection from '../../components/sections/filters/filters'
import DrugCard from '../../components/cards/drug'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchDrugs } from '../../utils/searches/search-drugs'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'

const PatientDrugsPage = ({ roles }) => {

    const navigate = useNavigate()
    
    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

    const patient = useSelector(state => state.patient.patient)
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [drugs, setDrugs] = useState([])
    const [searchedDrugs, setSearchedDrugs] = useState([])

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])
    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/prescriptions/patients/${patientId}/drugs`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setDrugs(data.drugs)
            setSearchedDrugs(data.drugs)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div>
        <PageHeader 
        pageName={translations[lang]["Drugs"]} 
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Drugs']}
            number={formatNumber(drugs.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        <div className="show-mobile">
            <FloatingButton url={`/prescriptions/form?cardId=${patient.cardId}`} />
        </div>
        <div>
            <div>
                <FiltersSection setStatsQuery={setStatsQuery} statsQuery={statsQuery} defaultValue={'LIFETIME'} />
                <div className="search-input-container">
                    <SearchInput 
                    rows={drugs} 
                    setRows={setSearchedDrugs}
                    searchRows={searchDrugs}
                    isHideClinics={true}
                    />
                </div>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedDrugs.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedDrugs.map(drug => <DrugCard drug={drug} />)}
                        </div>   
                        :
                        <EmptySection url={`/prescriptions/form?cardId=${patient.cardId}`} />
                    }
                </div>
            </div>
        </div>
    </div>
}

export default PatientDrugsPage