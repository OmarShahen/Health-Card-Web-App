import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import ClinicCard from '../../components/cards/clinic'
import { searchClinics } from '../../utils/searches/search-clinics'


const ClinicsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [clinics, setClinics] = useState([])
    const [searchedClinics, setSearchedClinics] = useState([])
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/clinics/doctors/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setClinics(response.data.clinics)
            setSearchedClinics(response.data.clinics)
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
                        rows={clinics} 
                        setRows={setSearchedClinics}
                        searchRows={searchClinics}
                        isHideClinics={false}
                        />
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedClinics.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedClinics.map(clinic => <ClinicCard clinic={clinic} setReload={setReload} reload={reload} />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicsPage