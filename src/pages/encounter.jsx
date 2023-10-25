import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import NavigationBar from '../components/navigation/navigation-bar'
import EncounterCard from '../components/cards/encounter'
import { toast } from 'react-hot-toast'
import PageHeader from '../components/sections/page-header'
import { isRolesValid } from '../utils/roles'
import DeleteEncounterConfirmationModal from '../components/modals/confirmation/encounter-delete-confirmation-modal'
import translations from '../i18n'
import CircularLoading from '../components/loadings/circular'


const EncounterPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const encounterId = pagePath.split('/')[2]

    const [reload, setReload] = useState(0)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [encounter, setEncounter] = useState()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/encounters/${encounterId}`)
        .then(response => {
            const data = response.data
            setEncounter(data.encounter)
        })
        .catch(error => {
            console.error(error)

            if(error.response.data.field === 'encounterId') return navigate(`/encounters`)
            
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload])

 
    return <div className="page-container page-white-background">
        {
            isShowDeleteModal ?
            <DeleteEncounterConfirmationModal
            setReload={setReload}
            reload={reload}
            encounter={encounter}
            setIsShowModal={setIsShowDeleteModal}
            />
            :
            null
        }
        
        <div className="padded-container">
            <PageHeader pageName={translations[lang]['Encounter']} />
            { 
                encounter ? 
                <div className="grey-bg-container">
                    <EncounterCard 
                    encounter={encounter} 
                    setTargetEncounter={setEncounter} 
                    setIsShowDeleteModal={setIsShowDeleteModal} 
                    />
                </div> 
                : 
                <CircularLoading />
            }
            </div>
    </div>
}

export default EncounterPage