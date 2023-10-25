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
import ServiceDeleteConfirmationModal from '../../components/modals/confirmation/service-delete-confirmation-modal'
import { isRolesValid } from '../../utils/roles'
import translations from '../../i18n'

const ClinicServicesPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const clinicId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isShowForm, setIsShowForm] = useState(false)
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [services, setServices] = useState([])
    const [clinics, setClinics] = useState([])
    const [targetService, setTargetService] = useState()
    const [searchedServices, setSearchedServices] = useState([])

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])


    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/services/clinics/${clinicId}`)
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
        pageName={translations[lang]["Services"]}
        addBtnText={translations[lang]['Add Service']} 
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
        clinicId={clinicId}
        isClinicService={true}
        isShowCloseButton={true}
        /> 
        : 
        null 
        }
        { 
        isShowDeleteModal ? 
        <ServiceDeleteConfirmationModal 
        service={targetService}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
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
                        isHideClinics={true}
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
                         setIsShowDeleteModal={setIsShowDeleteModal}
                         isHideBtns={true}
                         />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicServicesPage