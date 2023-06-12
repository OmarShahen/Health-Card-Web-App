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


const PatientPrescriptionsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const patient = useSelector(state => state.patient.patient)
    const user = useSelector(state => state.user.user)

    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [prescriptions, setPrescriptions] = useState([])
    const [searchedPrescriptions, setSearchedPrescriptions] = useState([])

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }

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
        <PageHeader 
        pageName={"Prescriptions"} 
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
                    rows={prescriptions} 
                    setRows={setSearchedPrescriptions}
                    searchRows={searchPrescriptions}
                    />
                </div>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedPrescriptions.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedPrescriptions.map(prescription => <PrescriptionCard prescription={prescription} />)}
                        </div>
                            
                        :
                        <EmptySection url={`/prescriptions/form?cardId=${patient.cardId}`} />
                    }
                </div> 
            </div>
        </div>
    </div>
}

export default PatientPrescriptionsPage