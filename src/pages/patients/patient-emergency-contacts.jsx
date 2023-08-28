import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import EmergencyContactFormModal from '../../components/modals/emergency-contacts-form'
import CircularLoading from '../../components/loadings/circular'
import ContactCard from '../../components/cards/contact'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchContacts } from '../../utils/searches/search-contacts'
import PageHeader from '../../components/sections/page-header'
import EmergencyContactDeleteConfirmationModal from '../../components/modals/confirmation/emergency-contact-delete-confirmation-modal'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import translations from '../../i18n'

const PatientEmergencyContactsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(0)
    const [isShowForm, setIsShowForm] = useState(false)
    const [formMode, setFormMode] = useState('CREATE')
    const [updateContact, setUpdateContact] = useState()
    const [emergencyContacts, setEmergencyContacts] = useState([])
    const [searchedEmergencyContacts, setSearchedEmergencyContacts] = useState([])

    useEffect(() => { 
        scroll(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login') 
    }, [])
    
    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setEmergencyContacts(data.patient.emergencyContacts)
            setSearchedEmergencyContacts(data.patient.emergencyContacts)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div>

        <PageHeader 
        pageName={translations[lang]['Emergency Contacts']}
        addBtnText={translations[lang]['Add Emergency Contact']}
        setShowModalForm={setIsShowForm}
        isHideBackButton={true}
        isHideRefresh={true}
        />

        {
            user.roles.includes('STAFF') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setIsShowForm} />
            </div>
            :
            null
        }
        
        { 
        isShowDeleteModal ? 
        <EmergencyContactDeleteConfirmationModal 
        contact={updateContact}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        patientId={patientId}        
        /> 
        : 
        null 
        }
        { isShowForm ?
        <EmergencyContactFormModal 
        setShowModalForm={setIsShowForm}
        reload={reload}
        setReload={setReload}
        mode={formMode}
        setMode={setFormMode}
        contact={updateContact}
        />
        : 
        null 
        }
        <div>
            <div>
                <div className="search-input-container">
                    <SearchInput 
                    rows={emergencyContacts} 
                    setRows={setSearchedEmergencyContacts}
                    searchRows={searchContacts}
                    isHideClinics={true}
                    />
                </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedEmergencyContacts.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedEmergencyContacts.map(contact => <ContactCard
                         contact={contact}
                         reload={reload}
                         setReload={setReload}
                         patientId={patientId}
                         setFormMode={setFormMode}
                         setUpdateContact={setUpdateContact}
                         setIsShowForm={setIsShowForm}
                         setIsShowDeleteModal={setIsShowDeleteModal}
                         />)}
                    </div>
                    :
                    <EmptySection setIsShowForm={setIsShowForm} />
                }
            </div>
        </div>
    </div>
}

export default PatientEmergencyContactsPage