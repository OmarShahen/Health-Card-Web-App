import { useState, useEffect } from 'react'
import { NavLink, Outlet } from "react-router-dom"
import { serverRequest } from '../../components/API/request'
import NavigationBar from '../../components/navigation/navigation-bar'
import PageHeader from '../sections/page-header'
import { setPatient } from '../../redux/slices/patientSlice'
import { useDispatch, useSelector } from 'react-redux'
import translations from '../../i18n'

const PatientProfileLayout = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

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
        <NavigationBar pageName={translations[lang]['Medical Profile']} />
        <div className="padded-container">
            <PageHeader 
            pageName={`${patientProfile.firstName} ${patientProfile.lastName}`}
            isHideRefresh={true}
            />
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/patients/${patientId}/medical-profile`}>{translations[lang]['Profile']}</NavLink></li> 
                    <li><NavLink to={`/patients/${patientId}/emergency-contacts`}>{translations[lang]['Emergency Contacts']}</NavLink></li>
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/doctors`}>{translations[lang]['Past Doctors']}</NavLink></li> }
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/encounters`}>{translations[lang]['Encounters']}</NavLink></li> }
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/symptoms`}>{translations[lang]['Symptoms']}</NavLink></li> }
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/diagnosis`}>{translations[lang]['Diagnosis']}</NavLink></li> }
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/prescriptions`}>{translations[lang]['Prescriptions']}</NavLink></li> }
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/drugs`}>{translations[lang]['Drugs']}</NavLink></li> }
                </ul>
            </div>
            <Outlet />
        </div>
    </div>
}

export default PatientProfileLayout