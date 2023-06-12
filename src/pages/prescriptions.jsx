import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import FiltersSection from '../components/sections/filters/filters'
import PrescriptionCard from '../components/cards/prescription'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchPrescriptions } from '../utils/searches/search-prescriptions'
import { useNavigate } from 'react-router-dom'


const PrescriptionsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [prescriptions, setPrescriptions] = useState([])
    const [searchedPrescriptions, setSearchedPrescriptions] = useState([])

    const todayDate = new Date()
    const weekDate = new Date()

    todayDate.setDate(todayDate.getDate())
    weekDate.setDate(weekDate.getDate() - 7)

    const [statsQuery, setStatsQuery] = useState({ from: weekDate, to: todayDate })

    const user = useSelector(state => state.user.user)

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/prescriptions/doctors/${user._id}`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setPrescriptions(response.data.prescriptions)
            setSearchedPrescriptions(response.data.prescriptions)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
        <NavigationBar pageName={'Prescriptions'} />
        <div className="padded-container">
            <PageHeader 
            pageName="Prescriptions" 
            addBtnText={"Add Prescription"}
            formURL={"/prescriptions/form"}
            reload={reload}
            setReload={setReload}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'-7'}
            />

            <div className="search-input-container">
                <SearchInput 
                rows={prescriptions} 
                setRows={setSearchedPrescriptions}
                searchRows={searchPrescriptions}
                />
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedPrescriptions.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {searchedPrescriptions.map(prescription =><PrescriptionCard 
                    prescription={prescription} 
                    setReload={setReload} 
                    reload={reload} 
                    />)}
                </div>
                    
                :
                <EmptySection url={'/prescriptions/form'} />
            }
        </div>
        
    </div>
}

export default PrescriptionsPage