import { useEffect, useState } from 'react'
import NavigationBar from '../navigation/navigation-bar'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import translations from '../../i18n'


const ClinicProfileLayout = ({ roles }) => {

    const pagePath = window.location.pathname
    const clinicId = pagePath.split('/')[2]

    const lang = useSelector(state => state.lang.lang)

    const [clinic, setClinic] = useState({})

    useEffect(() => {
        scroll(0,0)
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics/${clinicId}`)
        .then(response => {
            const data = response.data
            setClinic(data.clinic)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])


    return <div className="page-container">
        <NavigationBar pageName={translations[lang]['Clinic']} />
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader pageName={`${clinic?.name} #${clinic?.clinicId}`} />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/clinics/${clinicId}/profile`}>{translations[lang]['Profile']}</NavLink></li> 
                        <li><NavLink to={`/clinics/${clinicId}/services`}>{translations[lang]['Services']}</NavLink></li> 
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default ClinicProfileLayout