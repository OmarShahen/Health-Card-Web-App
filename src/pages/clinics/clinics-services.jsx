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
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import FloatingButton from '../../components/buttons/floating-button'
import translations from '../../i18n'

const ClinicsServicesPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isShowForm, setIsShowForm] = useState(false)
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [services, setServices] = useState([])
    const [clinics, setClinics] = useState([])
    const [targetService, setTargetService] = useState()
    const [searchedServices, setSearchedServices] = useState([])

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
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
        pageName={translations[lang]["Services"]} 
        addBtnText={translations[lang]['Add Service']} 
        isHideBackButton={true}
        setShow
        setShowModalForm={setIsShowForm} 
        />
        {
            user.roles.includes('OWNER') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setIsShowForm} />
            </div>
            :
            null
        }
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Services']}
            number={formatNumber(services.length)}
            iconColor={'#5C60F5'}
            />
        </div>
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
                         setIsShowDeleteModal={setIsShowDeleteModal}
                         />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicsServicesPage