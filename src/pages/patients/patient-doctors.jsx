import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import DoctorCard from '../../components/cards/doctor'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchDoctors } from '../../utils/searches/search-doctors'
import PageHeader from '../../components/sections/page-header'
import DocumentsSizes from '../../components/sections/sizes/documents-size'

const PatientDoctorsPage = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [doctors, setDoctors] = useState([])
    const [searchedDoctors, setSearchedDoctors] = useState([])

    useEffect(() => scroll(0,0), [])

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
                        />
                    </div>
                    <DocumentsSizes size={searchedDoctors.length} />
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