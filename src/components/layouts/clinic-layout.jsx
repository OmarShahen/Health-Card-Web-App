import { useEffect, useState } from 'react'
import NavigationBar from '../navigation/navigation-bar'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatNumber } from '../../utils/numbers'
import { serverRequest } from '../API/request'
import translations from '../../i18n'

const ClinicsLayout = ({ roles }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const numberOfInvitations = useSelector(state => state.invitation.numberOfInvitations)

    const [numberOfStaffRequests, setNumberOfStaffRequests] = useState(0)

    useEffect(() => {
        scroll(0,0)
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics-requests/owners/${user._id}/staffs?status=PENDING`)
        .then(response => {
            setNumberOfStaffRequests(response.data.clinicsRequests.length)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])


    return <div className="page-container">
        <NavigationBar pageName={translations[lang]['Clinics']} />
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader pageName={translations[lang]['Clinics']} isHideRefresh={true} />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/clinics/owned`}>{translations[lang]['Owned']}</NavLink></li> 
                        { user.roles.includes('DOCTOR') ? <li><NavLink to={`/clinics/registered`}>{translations[lang]['Registered']}</NavLink></li> : null }
                        <li>
                            <NavLink to={`/clinics/invitations`}>
                                {translations[lang]['My Invitations']}
                                <span className="side-bar-number-container span-text">{formatNumber(numberOfInvitations)}</span>
                            </NavLink>
                        </li>
                        { user.roles.includes('OWNER') ? <li><NavLink to={`/clinics/doctors/requests`}>{translations[lang]['Doctors Requests']}</NavLink></li> : null }
                        { user.roles.includes('OWNER') ? <li><NavLink to={`/clinics/owners/requests`}>{translations[lang]['Owners Requests']}</NavLink></li> : null }
                        { 
                            user.roles.includes('OWNER') ? 
                            <li>
                                <NavLink to={`/clinics/staffs/requests`}>
                                    {translations[lang]['Staffs Requests']}
                                    <span className="side-bar-number-container span-text">{formatNumber(numberOfStaffRequests)}</span>
                                </NavLink>
                            </li> 
                            : 
                            null 
                        }
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default ClinicsLayout