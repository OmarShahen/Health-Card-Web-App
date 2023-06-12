import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import ProfileForm from '../../components/forms/profile/profile'
import ChangePasswordForm from '../../components/forms/profile/change-password'
import { useSelector } from 'react-redux'

const ProfilePage = () => {

    const appUser = useSelector(state => state.user.user)

    const [user, setUser] = useState()
    const [reload, setReload] = useState(0)

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


    return <div>
        { user ? <ProfileForm profile={user} reload={reload} setReload={setReload} /> : null }
    </div>
}

export default ProfilePage