import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import { setIsActive, setInvoice, closeInvoice } from '../../redux/slices/invoiceSlice'
import { setIsShowModal, setIsShowRenewModal } from '../../redux/slices/modalSlice'
import translations from '../../i18n'
import SearchPatientInputField from '../inputs/patients-search'

const InvoiceFormModal = ({ setShowModalForm }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [targetPatient, setTargetPatient] = useState()
    const [targetPatientError, setTargetPatientError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!targetPatient) return setTargetPatientError('patient is required')

        const invoiceData = { 
            status: 'DRAFT',
            clinicId: user.clinicId
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/invoices`, invoiceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data

            data.invoice.patientCardId = invoiceData.cardId
            dispatch(closeInvoice())
            dispatch(setIsActive({ isActive: true }))
            dispatch(setInvoice({ invoice: data.invoice }))
            navigate('/services')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'cardId') return setCardIdError(errorResponse.message)

                if(errorResponse.field === 'clinicId') return setClinicError(errorResponse.message)

                if(errorResponse.field === 'mode') { 
                    setShowModalForm(false)
                    dispatch(setIsShowModal(true))
                    return
                }

                if(errorResponse.field === 'activeUntilDate') {
                    setShowModalForm(false)
                    dispatch(setIsShowRenewModal(true))
                    return
                }

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{translations[lang]['Create Invoice']}</h2>
            </div>
            <div className="modal-body-container">
                <form id="patient-card-form" className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <SearchPatientInputField 
                    setTargetPatient={setTargetPatient}
                    setTargetPatientError={setTargetPatientError}
                    targetPatientError={targetPatientError}
                    />
                </form>
            </div>
            <div className="modal-form-btn-container">
                        <div>
                            {
                                !isSubmit ?
                                <button
                                form="patient-card-form"
                                className="normal-button white-text action-color-bg"
                                >
                                    {translations[lang]['Next']}
                                </button>
                                :
                                <TailSpin width="25" height="25" color="#4c83ee" />
                            }
                        </div>
                        <div>
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                e.preventDefault()
                                setShowModalForm(false)
                            }}
                            >{translations[lang]['Close']}</button>
                        </div>
                    </div>
        </div>
    </div>
}

export default InvoiceFormModal