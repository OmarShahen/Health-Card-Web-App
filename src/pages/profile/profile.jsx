import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { NavLink } from "react-router-dom"
import { serverRequest } from '../../components/API/request'
import NavigationBar from '../../components/navigation/navigation-bar'
import ProfileForm from '../../components/forms/profile/profile'
import { useSelector } from 'react-redux'

const ProfilePage = () => {

    const appUser = useSelector(state => state.user.user)

    const [user, setUser] = useState()
    const [reload, setReload] = useState(0)

    useEffect(() => scroll(0,0), [])

    useEffect(() => {

        serverRequest.get(`/v1/users/${appUser._id}`)
        .then(response => {
            const data = response.data
            setUser(data.user)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        <NavigationBar pageName={'Settings - Account'} />
        <div className="padded-container">
            <div className="page-header-container">
                <div>
                    <h1>
                        Account Settings
                    </h1>
                </div>
            </div>
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/settings/profile`}>Account Details</NavLink></li> 
                    <li><NavLink to={`/patients/${'63efbbe147537b9ccb47e9d6'}/emergency-contacts`}>Delete Account</NavLink></li>
                </ul>
            </div>
            <br />
            <div className="cards-2-list-wrapper">
                { user ? <ProfileForm profile={user} reload={reload} setReload={setReload} /> : null }
            </div>
        </div>
    </div>
}

export default ProfilePage