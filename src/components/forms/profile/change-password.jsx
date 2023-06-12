import { useState, useEffect } from "react"
import './profile.css'
import { serverRequest } from "../../API/request"
import { toast } from "react-hot-toast"
import { TailSpin } from "react-loader-spinner"
import { useSelector } from "react-redux"

const ChangePasswordForm = () => {

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [currentPassword, setCurrentPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

    const [currentPasswordError, setCurrentPasswordError] = useState()
    const [newPasswordError, setNewPasswordError] = useState()
    const [confirmPasswordError, setConfirmPasswordError] = useState()

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!currentPassword) return setCurrentPasswordError('Current password is required')

        if(!newPassword) return setNewPasswordError('New password is required')
        
        if(!confirmPassword) return setConfirmPasswordError('Confirm password is required')

        if(newPassword !== confirmPassword) return setConfirmPasswordError('Confirm password is not the same as new password')

        const updatedData = { newPassword, currentPassword }

        setIsSubmit(true)
        serverRequest.patch(`/v1/users/${user._id}/password/verify`, updatedData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            resetForm()
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'currentPassword') return setCurrentPasswordError(errorResponse.message)

                if(errorResponse.field === 'newPassword') return setNewPasswordError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })
    }

    const resetForm  = () => {

        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')

        setCurrentPasswordError()
        setNewPasswordError()
        setConfirmPasswordError()
    }

    return <div className="profile-form-container">
        <div className="profile-form-wrapper">
            <form id="profile-form" className="body-text">
                <div>
                    <label>Verify current password</label>
                    <div className="form-input-button-container">
                        <input 
                        type="password" 
                        className="form-input" 
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        onClick={e => setCurrentPasswordError()}
                        />
                    </div>
                    <span className="red">{currentPasswordError}</span>
                </div>
                <div>
                    <label>New password</label>
                    <div className="form-input-button-container">
                        <input 
                        type="password" 
                        className="form-input" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        onClick={e => setNewPasswordError()}
                        />
                    </div>
                    <span className="red">{newPasswordError}</span>
                </div>
                <div>
                    <label>Confirm new password</label>
                    <div className="form-input-button-container">
                        <input 
                        type="password" 
                        className="form-input" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        onClick={e => setConfirmPasswordError()}
                        />
                    </div>
                    <span className="red">{confirmPasswordError}</span>
                </div>

                <div>
                    {
                        isSubmit ?
                        <TailSpin width="30" height="30" color="#22D172" />
                        :
                        <button onClick={handleUpdate} className="update-btn">
                            Update
                        </button>
                    }
                </div>
                
            </form>
        </div>
    </div>
}

export default ChangePasswordForm