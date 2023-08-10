import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchEncounters } from '../utils/searches/search-encounters'
import { toast } from 'react-hot-toast'
import PageHeader from '../components/sections/page-header'
import EncounterDeleteConfirmationModal from '../components/modals/confirmation/encounter-delete-confirmation-modal'
import ClinicRequestFormModal from '../components/modals/clinic-request-form'
import ClinicStaffCard from '../components/cards/clinic-staff'
import { isRolesValid } from '../utils/roles'
import { useNavigate } from 'react-router-dom'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { formatNumber } from '../utils/numbers'
import translations from '../i18n'

const StaffsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [targetEncounter, setTargetEncounter] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowRequestModal, setIsShowRequestModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [staffs, setStaffs] = useState([])
    const [searchedStaffs, setSearchedStaffs] = useState([])

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {

        let endpointURL = ''

        if(user.roles.includes('STAFF')) {
            endpointURL = `/v1/staffs/clinics/${user.clinicId}`
        } else if(user.roles.includes('OWNER')) {
            endpointURL = `/v1/clinics/owners/${user._id}/staffs`
        }

        setIsLoading(true)
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setStaffs(data.staffs)
            setSearchedStaffs(data.staffs)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload])

 
    return <div className="page-container page-white-background">
        <NavigationBar pageName={translations[lang]["Staffs"]} />
        { 
        isShowDeleteModal ? 
        <EncounterDeleteConfirmationModal 
        encounter={targetEncounter}
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
            pageName={translations[lang]['Staffs']}
            setShowModalForm={setIsShowRequestModal}
            />
            <div className="cards-list-wrapper margin-bottom-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Staffs']}
                number={formatNumber(staffs.length)}
                iconColor={'#5C60F5'}
                />
            </div>
            <div className="search-input-container">
                <SearchInput 
                rows={staffs} 
                setRows={setSearchedStaffs}
                searchRows={searchEncounters}
                isHideClinics={user.roles.includes('STAFF') ? true : false }
                />
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedStaffs.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    { searchedStaffs.map(staff => <ClinicStaffCard 
                    staff={staff} 
                    setReload={setReload}
                    reload={reload}
                    setTargetEncounter={setTargetEncounter}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    />) }
                </div>
                :
                <EmptySection setIsShowForm={setIsShowRequestModal} />
            }
        </div>
        
    </div>
}

export default StaffsPage