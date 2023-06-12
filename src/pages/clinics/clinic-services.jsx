import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import { searchServices } from '../../utils/searches/search-services'
import PageHeader from '../../components/sections/page-header'
import ServiceCard from '../../components/cards/service'
import ServiceFormModal from '../../components/modals/service-form'



const ClinicsServicesPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isShowForm, setIsShowForm] = useState(false)
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [services, setServices] = useState([])
    const [clinics, setClinics] = useState([])
    const [targetService, setTargetService] = useState()
    const [searchedServices, setSearchedServices] = useState([])
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics-owners/owners/${user._id}`)
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
        serverRequest.get(`/v1/services/owners/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setServices(response.data.services)
            setSearchedServices(response.data.services)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        <PageHeader 
        pageName="Services" 
        addBtnText={'Add Service'} 
        isHideBackButton={true}
        setShow
        setShowModalForm={setIsShowForm} 
        />
        { 
        isShowForm ? 
        <ServiceFormModal 
        setShowFormModal={setIsShowForm} 
        reload={reload} 
        setReload={setReload} 
        service={targetService}
        setService={setTargetService}
        /> 
        : 
        null 
        }
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                    <div className="search-input-container">
                        <SearchInput 
                        rows={services} 
                        setRows={setSearchedServices}
                        searchRows={searchServices}
                        isHideClinics={false}
                        isCustomClincis={true}
                        customClinics={clinics}
                        />
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedServices.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedServices.map(service => <ServiceCard
                         setTargetService={setTargetService} 
                         service={service} 
                         setReload={setReload} 
                         reload={reload}
                         setIsShowForm={setIsShowForm}
                         />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicsServicesPage