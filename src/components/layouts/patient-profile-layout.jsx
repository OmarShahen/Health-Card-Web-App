import { useState, useEffect } from 'react'
import { NavLink, Outlet } from "react-router-dom"
import { serverRequest } from '../../components/API/request'
import PageHeader from '../sections/page-header'
import { setPatient } from '../../redux/slices/patientSlice'
import { useDispatch, useSelector } from 'react-redux'
import translations from '../../i18n'


const PatientProfileLayout = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

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
        <div className="padded-container">
        <PageHeader 
        pageName={ isLoading ? 'Loading...' : `${patientProfile.firstName} ${patientProfile.lastName ? patientProfile.lastName : ''}`}
        addBtnText={translations[lang]['Update Patient']}
        formURL={`/patients/${patientProfile?._id}/form?mode=UPDATE`}
        />
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/medical-profile`}>{translations[lang]['Profile']}</NavLink></li> 
                    <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/emergency-contacts`}>{translations[lang]['Contacts']}</NavLink></li>
                    {/* !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/doctors`}>{translations[lang]['Past Doctors']}</NavLink></li> */}
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/encounters`}>{translations[lang]['Encounters']}</NavLink></li> }
                    {/* !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/symptoms`}>{translations[lang]['Symptoms']}</NavLink></li> */}
                    {/* !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/diagnosis`}>{translations[lang]['Diagnosis']}</NavLink></li> */}
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/prescriptions`}>{translations[lang]['Prescriptions']}</NavLink></li> }
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/drugs`}>{translations[lang]['Drugs']}</NavLink></li> }
                    { user.roles.includes('DOCTOR') || user.roles.includes('STAFF') ? <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/appointments`}>{translations[lang]['Appointments']}</NavLink></li> : null }
                    { user.roles.includes('OWNER') || user.roles.includes('STAFF') ? <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/invoices`}>{translations[lang]['Invoices']}</NavLink></li> : null }
                    { user.roles.includes('OWNER') || user.roles.includes('STAFF') ? <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/insurance-policies`}>{translations[lang]['Insurance']}</NavLink></li> : null }
                    { user.roles.includes('OWNER') || user.roles.includes('STAFF') ? <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/attachments`}>{translations[lang]['Attachments']}</NavLink></li> : null }

                </ul>
            </div>
            <Outlet />
        </div>
    </div>
}

export default PatientProfileLayout