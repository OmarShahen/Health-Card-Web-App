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
import DocumentsSizes from '../../components/sections/sizes/documents-size'

const PatientDrugsPage = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const patient = useSelector(state => state.patient.patient)
    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [drugs, setDrugs] = useState([])
    const [searchedDrugs, setSearchedDrugs] = useState([])

    useEffect(() => scroll(0,0), [])

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
        pageName={"Drugs"} 
        addBtnText={'Add Prescription'} 
        formURL={`/prescriptions/form?cardId=${patient.cardId}`}
        isHideBackButton={true}
        isHideRefresh={true}
        />
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
                    />
                </div>
                <div>
                    <DocumentsSizes size={searchedDrugs.length} />
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