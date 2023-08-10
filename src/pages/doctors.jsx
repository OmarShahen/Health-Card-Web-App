import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchClinicsDoctors } from '../utils/searches/search-clinics-doctors'
import { toast } from 'react-hot-toast'
import PageHeader from '../components/sections/page-header'
import ClinicRequestFormModal from '../components/modals/clinic-request-form'
import ClinicDoctorCard from '../components/cards/clinic-doctor'
import DoctorDeleteConfirmationModal from '../components/modals/confirmation/doctor-delete-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { formatNumber } from '../utils/numbers'
import translations from '../i18n'

const DoctorsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [targetClinicDoctor, setTargetClinicDoctor] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowRequestModal, setIsShowRequestModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [clinicsDoctors, setClinicsDoctors] = useState([])
    const [searchedClinicsDoctors, setSearchedClinicsDoctors] = useState([])

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
    
        let endpointURL = ''

        if(user.roles.includes('STAFF')) {
            endpointURL = `/v1/clinics-doctors/clinics/${user.clinicId}` 
        } else if(user.roles.includes('OWNER')) {
            endpointURL = `/v1/clinics-doctors/owners/${user._id}`
        }

        setIsLoading(true)
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setClinicsDoctors(data.clinicsDoctors)
            setSearchedClinicsDoctors(data.clinicsDoctors)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload])

 
    return <div className="page-container page-white-background">
        <NavigationBar pageName={translations[lang]["Doctors"]} />
        { 
        isShowDeleteModal ? 
        <DoctorDeleteConfirmationModal 
        clinicDoctor={targetClinicDoctor}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        {
            isShowRequestModal ?
            <ClinicRequestFormModal 
            reload={reload} 
            setReload={setReload}
            setShowModalForm={setIsShowRequestModal}
            />
            :
            null
        }
        <div className="padded-container">
            <PageHeader
            pageName={translations[lang]['Doctors']}
            setShowModalForm={setIsShowRequestModal}
            />
            <div className="cards-list-wrapper margin-bottom-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Doctors']}
                number={formatNumber(clinicsDoctors.length)}
                iconColor={'#5C60F5'}
                />
            </div>
            <div className="search-input-container">
                <SearchInput 
                rows={clinicsDoctors} 
                setRows={setSearchedClinicsDoctors}
                searchRows={searchClinicsDoctors}
                isHideClinics={user.roles.includes('STAFF') ? true : false }
                isHideSpeciality={false}
                />
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedClinicsDoctors.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    { searchedClinicsDoctors.map(clinicDoctor => <ClinicDoctorCard 
                    clinicDoctor={clinicDoctor} 
                    setReload={setReload}
                    reload={reload}
                    setTargetClinicDoctor={setTargetClinicDoctor}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    />) }
                </div>
                :
                <EmptySection setIsShowForm={setIsShowRequestModal} />
            }
        </div>
        
    </div>
}

export default DoctorsPage