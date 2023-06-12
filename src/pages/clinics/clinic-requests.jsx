import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import { searchClinics } from '../../utils/searches/search-clinics'
import { serverRequest } from '../../components/API/request'
import ClinicRequestCard from '../../components/cards/clinic-request'


const ClinicsRequestsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [requests, setRequests] = useState([])
    const [searchedRequests, setSearchedRequests] = useState([])
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/clinics-requests/users/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setRequests(response.data.clinicsRequests)
            setSearchedRequests(response.data.clinicsRequests)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                    <div className="search-input-container">
                        <SearchInput 
                        rows={requests} 
                        setRows={setSearchedRequests}
                        searchRows={searchClinics}
                        isHideClinics={true}
                        />
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedRequests.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedRequests.map(request => <ClinicRequestCard request={request} setReload={setReload} reload={reload} />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicsRequestsPage