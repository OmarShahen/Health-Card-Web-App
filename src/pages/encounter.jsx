import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import NavigationBar from '../components/navigation/navigation-bar'
import EncounterCard from '../components/cards/encounter'
import { toast } from 'react-hot-toast'
import PageHeader from '../components/sections/page-header'


const EncounterPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const encounterId = pagePath.split('/')[2]

    const [reload, setReload] = useState(0)
    const [encounter, setEncounter] = useState()
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/encounters/${encounterId}`)
        .then(response => {
            const data = response.data
            setEncounter(data.encounter)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload])

 
    return <div className="page-container page-white-background">
        <NavigationBar pageName={"Encounter"} />
        <div className="padded-container">
            <PageHeader pageName={'Encounter'} />
            { encounter ? <div className="grey-bg-container"><EncounterCard encounter={encounter} /></div> : null }
            </div>
    </div>
}

export default EncounterPage