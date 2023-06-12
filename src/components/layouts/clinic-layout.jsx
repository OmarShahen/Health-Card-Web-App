import { useEffect } from 'react'
import NavigationBar from '../navigation/navigation-bar'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ClinicsLayout = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])


    return <div className="page-container">
        <NavigationBar pageName={'Clinics'} />
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader pageName={'Clinics'} addBtnText={'Add Clinic'} />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/clinics/accepted`}>Clinics</NavLink></li> 
                        <li><NavLink to={`/clinics/requests`}>Requests</NavLink></li>
                        <li><NavLink to={`/clinics/services`}>Services</NavLink></li> 
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default ClinicsLayout