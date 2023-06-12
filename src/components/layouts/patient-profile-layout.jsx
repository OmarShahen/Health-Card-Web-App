import { useState, useEffect } from 'react'
import { NavLink, Outlet } from "react-router-dom"
import { serverRequest } from '../../components/API/request'
import NavigationBar from '../../components/navigation/navigation-bar'
import PageHeader from '../sections/page-header'
import { setPatient } from '../../redux/slices/patientSlice'
import { useDispatch, useSelector } from 'react-redux'

const PatientProfileLayout = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [patientProfile, setPatientProfile] = useState({})

    useEffect(() => scroll(0,0), [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPatientProfile(data.patient)
            dispatch(setPatient(data.patient))
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div className="page-container">
        <NavigationBar pageName={'Medical Profile'} />
        <div className="padded-container">
            <PageHeader 
            pageName={`${patientProfile.firstName} ${patientProfile.lastName}`}
            isHideRefresh={true}
            />
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/patients/${patientId}/medical-profile`}>Profile</NavLink></li> 
                    <li><NavLink to={`/patients/${patientId}/emergency-contacts`}>Contacts</NavLink></li>
                    { user.role === 'STAFF' ? null : <li><NavLink to={`/patients/${patientId}/doctors`}>Doctors</NavLink></li> }
                    { user.role === 'STAFF' ? null : <li><NavLink to={`/patients/${patientId}/encounters`}>Encounters</NavLink></li> }
                    { user.role === 'STAFF' ? null : <li><NavLink to={`/patients/${patientId}/symptoms`}>Symptoms</NavLink></li> }
                    { user.role === 'STAFF' ? null : <li><NavLink to={`/patients/${patientId}/diagnosis`}>Diagnosis</NavLink></li> }
                    { user.role === 'STAFF' ? null : <li><NavLink to={`/patients/${patientId}/prescriptions`}>Prescriptions</NavLink></li> }
                    { user.role === 'STAFF' ? null : <li><NavLink to={`/patients/${patientId}/drugs`}>Drugs</NavLink></li> }
                </ul>
            </div>
            <Outlet />
        </div>
    </div>
}

export default PatientProfileLayout