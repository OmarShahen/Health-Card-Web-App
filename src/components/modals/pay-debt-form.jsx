import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { formatMoney } from '../../utils/numbers'
import translations from '../../i18n'
import { useSelector } from 'react-redux'

const PayDebtFormModal = ({ setShowFormModal, reload, setReload, invoice }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [paid, setPaid] = useState()

    const [paidError, setPaidError] = useState()

    const lang = useSelector(state => state.lang.lang)

    const insuranceCoveragePercentage = invoice?.insuranceCoveragePercentage ? invoice?.insuranceCoveragePercentage / 100 : 1
    const totalAmount = invoice.totalCost
    const totalAmountRemaining = invoice?.insuranceCoveragePercentage ? totalAmount - (totalAmount * insuranceCoveragePercentage) : 0



    const handleSubmit = (e) => {
        e.preventDefault()

        if(!paid) return setPaidError(translations[lang]['paid is required'])        

        const invoiceData = { paid }

        setIsSubmit(true)
        serverRequest.patch(`/v1/invoices/${invoice._id}/paid`, invoiceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'paid') return setPaidError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{translations[lang]['Pay Debt']}</h2>
            </div>  
                <div>
                <div className="modal-body-container">
                    <form 
                    id="debt-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={handleSubmit}
                    >
                        <div className="form-input-container">
                            <label>{translations[lang]['Amount']} ({translations[lang]['Remaining']} {formatMoney(invoice?.insuranceCoveragePercentage ? (totalAmountRemaining - invoice.paid) : totalAmount - invoice.paid)})</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder=""
                            value={paid}
                            onChange={e => setPaid(Number.parseFloat(e.target.value))}
                            onClick={e => setPaidError()}
                            />
                            <span className="red">{paidError}</span>
                        </div>                 
                    </form>
                </div>
                <div className="modal-form-btn-container">
                            <div>   
                                { 
                                    isSubmit ?
                                    <TailSpin
                                    height="25"
                                    width="25"
                                    color="#4c83ee"
                                    />
                                    :
                                    <button
                                    form="debt-form"
                                    className="normal-button white-text action-color-bg"
                                    >{translations[lang]['Pay']}</button>
                                } 
                            </div>
                            <div>
                                <button 
                                className="normal-button cancel-button"
                                onClick={e => {
                                    e.preventDefault()
                                    setShowFormModal(false)
                                    setService()
                                }}
                                >{translations[lang]['Close']}</button>
                            </div>
                </div>
                </div>            
        </div>
    </div>
}

export default PayDebtFormModal