import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import DoctorsBottomBar from "../components/navigation/doctors-bottom-bar"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import EncountersTable from '../components/tables/encounters'


const EncountersPage = () => {

    const navigate = useNavigate()

    const [reload, setReload] = useState(0)
    const [encounters, setEncounters] = useState([])
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        serverRequest.get(`/v1/encounters/doctors/63efbbe147537b9ccb47e9d6`)
        .then(response => {
            const data = response.data
            setEncounters(data.encounters)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload])

 
    return <div className="page-container page-white-background">
        
        <div className="padded-container">
            <div className="page-header-container">
                <div>
                    <h1>
                        Encounters
                    </h1>
                </div>
            </div>
            <EncountersTable 
            encounters={encounters}
            setReload={setReload}
            reload={reload}
            />  
        </div>
        
    </div>
}

export default EncountersPage