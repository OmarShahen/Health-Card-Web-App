import { useState, useEffect } from 'react'
import './profile.css'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { setIsLogged } from '../../redux/slices/userSlice'
import { isRolesValid } from '../../utils/roles'
import translations from '../../i18n'

const DeleteAccountPage = ({ roles }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSendingLoading, setIsSendingLoading] = useState(false)
    const [isShowConfirmation, setIsShowConfimation] = useState(false)
    const [isCodeForm, setIsCodeForm] = useState(false)
    const [isCodeLoading, setIsCodeLoading] = useState(false)

    const [verificationCode, setVerificationCode] = useState('')

    const [errorMessage, setErrorMessage] = useState()

    useEffect(() => {
        scroll(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    const sendVerificationCode = () => {
        setIsSendingLoading(true)
        serverRequest.post(`/v1/auth/users/${user._id}/delete-account`)
        .then(response => {
            setIsSendingLoading(false)
            setIsCodeForm(true)
        })
        .catch(error => {
            setIsSendingLoading(false)
            console.error(error)
            setErrorMessage(error.response.data.message)
        })
    }

    const handleSubmit = (e) => {

        if(!verificationCode) return setErrorMessage('Verification code is required')

        setIsCodeLoading(true)
        serverRequest.delete(`/v1/auth/users/${user._id}/verification-code/${Number.parseInt(verificationCode)}`,)
        .then(response => {
            setIsCodeLoading(false)
            sessionStorage.setItem('user', null)
            dispatch(setIsLogged(false))
            navigate('/login')
        })
        .catch(error => {
            setIsCodeLoading(false)
            console.error(error)
            setErrorMessage(error.response.data.message)
        })
    }

    return <div>
        <span className="body-text grey-text">{translations[lang]["Pay special attention when entering this area!"]}</span>
        <div className="cards-2-list-wrapper">
            <div className="delete-account-description-container">
                <div>
                    <InfoOutlinedIcon />
                </div>
                <div className="body-text">
                    {
                        user?.roles?.includes('STAFF') ?
                        <p>
                            { lang === 'en' ?
                                "Deleting your account removes all appointments, patients, invoices, and data associated with the account"
                                :
                                null
                            }
                        </p>
                        :
                        <p>
                            { lang === 'en' ?
                                `Deleting your account is only available in the testing mode. If your account is in production mode 
                                it can't be deleted, to allow patients to view their encounters and prescription associated with you.
                                If there is no patients data associated with you the account will be deleted.`
                                :
                                null
                            }
                        </p>
                    }
                    
                    <br />
                    <p>
                        { lang === 'en' ? `Once you click "Delete Account", we send you a confirmation email.`: ` عند مسح الحساب نرسل لك بريد لتاكيد العملية`}
                    </p>
                    <br />
                    {
                        isCodeForm ?
                            isCodeLoading ?
                            <TailSpin
                            height="30"
                            width="30"
                            color="red"
                            />
                            :

                            <div>
                                <input 
                                type="number" 
                                className="form-input" 
                                placeholder={translations[lang]["enter 6-digits"]}
                                value={verificationCode}
                                onClick={e => setErrorMessage()}
                                onChange={e => setVerificationCode(e.target.value)}
                                />
                                <div className="margin-top-1">
                                    <button 
                                    className="normal-button bright-red-bg white-text"
                                    onClick={handleSubmit}
                                    >{translations[lang]['Submit']}</button>
                                </div>
                                <br />
                            </div>
                        :
                        !isShowConfirmation ?
                        <button 
                        onClick={e => setIsShowConfimation(true)} 
                        className="normal-button bright-red-bg white-text"
                        >
                            {translations[lang]['Delete Account']}
                        </button>
                        :
                        <div className="delete-account-buttons-container">
                            {
                                isSendingLoading ?
                                <TailSpin
                                height="30"
                                width="30"
                                color="red"
                                />
                                :
                                <button
                                onClick={e => sendVerificationCode()}
                                className="normal-button bright-red-bg white-text"
                                >
                                    {translations[lang]['Yes, delete']}
                                </button>
                            }
                            
                            <button 
                            onClick={e => {
                                setIsShowConfimation(false)
                                setErrorMessage()
                            }}
                            className="normal-button green-bg white-text"
                            >
                                {translations[lang]['Cancel']}
                            </button>
                        </div>
    
                    }
                    
                    <span className="bright-red-text">{errorMessage}</span>
                    <br />
                    <p>
                        <strong>{translations[lang]['Note:']} </strong>
                        {translations[lang]['for any problem using the app please contact our']}
                        <NavLink to="/support" className="bold-text action-color-text"> {translations[lang]['Support team']}</NavLink></p>
                </div>
            </div>
        </div>
    </div>
}

export default DeleteAccountPage