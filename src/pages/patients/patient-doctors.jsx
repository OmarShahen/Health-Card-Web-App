import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import DoctorCard from '../../components/cards/doctor'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchDoctors } from '../../utils/searches/search-doctors'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const PatientDoctorsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)

    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [doctors, setDoctors] = useState([])
    const [searchedDoctors, setSearchedDoctors] = useState([])
    const [clinics, setClinics] = useState([])

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }

    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics/patients/${patientId}`)
        .then(response => {
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}/doctors`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setDoctors(data.doctors)
            setSearchedDoctors(data.doctors)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div>
        <PageHeader 
        pageName={"Doctors"}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div>
            <div>
                <div>
                    <div className="search-input-container">
                        <SearchInput 
                        rows={doctors} 
                        setRows={setSearchedDoctors}
                        searchRows={searchDoctors}
                        isCustomClincis={true}
                        customClinics={clinics}
                        />
                    </div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedDoctors.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedDoctors.map(doctor => <DoctorCard doctor={doctor} />)}
                        </div>
                        :
                        <EmptySection />
                    }
                </div> 
            </div>
        </div>
    </div>
}

export default PatientDoctorsPage