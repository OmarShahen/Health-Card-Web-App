import { useState, useEffect } from 'react'
import { serverRequest } from "../../components/API/request"
import { useSelector, useDispatch } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import NavigationBar from '../../components/navigation/navigation-bar';
import { format } from 'date-fns'
import { formatMoney } from '../../utils/numbers'
import './invoice.css'
import { NavLink, useNavigate } from 'react-router-dom'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { removeService, closeInvoice, setIsActive } from '../../redux/slices/invoiceSlice'
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-hot-toast'
import CardTransition from '../../components/transitions/card-transitions';
import { isRolesValid } from '../../utils/roles';
import translations from '../../i18n';
import { setPatient } from '../../redux/slices/patientSlice';
import SearchPatientInputField from '../../components/inputs/patients-search';

const InvoiceCheckoutPage = ({ roles }) => {

    const getTotal = (services) => {
        let totalAmount = 0
        for(let i=0;i<services.length;i++) {
            totalAmount += services[i].cost
        }

        return totalAmount
    }

    const isDateValid = (dateEntered) => {
        try {

            format(dateEntered, 'MMM d, yyyy hh:MM a')

            return true
        } catch(error) {
            return false
        }
    }

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const invoice = useSelector(state => state.invoice)

    const [targetPatient, setTargetPatient] = useState()
    const [targetPatientError, setTargetPatientError] = useState()

    const [insurancePolicy, setInsurancePolicy] = useState()
    const [insuranceCoveragePercentage, setInsuranceCoveragePercentage] = useState(0)
    const [totalAmountRemaining, setTotalAmountRemaining] = useState(getTotal(invoice.services))

    const [dueDate, setDueDate] = useState()
    const [invoiceDate, setInvoiceDate] = useState(new Date())
    const [payAmount, setPayAmount] = useState(getTotal(invoice.services))
    const [paymentMethod, setPaymentMethod] = useState('CASH')

    const [isPayInvoiceLoading, setIsPayInvoiceLoading] = useState(false)
    const [isDeleteInvoiceLoading, setIsDeleteInvoiceLoading] = useState(false)

    const [dueDateError, setDueDateError] = useState()
    const [invoiceDateError, setInvoiceDateError] = useState()
    const [payAmountError, setPayAmountError] = useState()

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        dispatch(setIsActive({ isActive: true }))
    }, [])

    useEffect(() => {
        if(!targetPatient) {
            setInsurancePolicy()
            return
        }

        serverRequest.get(`/v1/insurance-policies/patients/${targetPatient.patientId}/clinics/${targetPatient.clinicId}`)
        .then(response => {
            const insurancePolicyList = response.data.insurancePolicy

            if(insurancePolicyList.length === 0) {
                return
            }

            const insurancePolicy = insurancePolicyList[0]
            setInsurancePolicy(insurancePolicy)
            setInsuranceCoveragePercentage(insurancePolicy.coveragePercentage)

        })
        .catch(error => {
            console.error(error)
        })

    }, [targetPatient])


    const payInvoice = () => {

        if(!targetPatient) return setTargetPatientError(translations[lang]['patient is required'])

        if(invoice.services.length == 0) return toast.error(translations[lang]['There is no services in the invoice'], { duration: 3000, position: 'top-right' })

        if(payAmount > getTotal(invoice.services)) return setPayAmountError(translations[lang]['Amount paid is more than the total cost'])

        const invoiceData = {
            patientId: targetPatient.patientId,
            clinicId: user.clinicId,
            creatorId: user._id,
            services: invoice.services.map(service => service._id),
            invoiceDate: invoiceDate ? format(invoiceDate, 'yyyy-MM-dd HH:MM:ss') : format(new Date(), 'yyyy-MM-dd HH:MM:ss'),
            paidAmount: payAmount ? Number.parseFloat(payAmount) : 0,
            paymentMethod,
            dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null
        }

        setIsPayInvoiceLoading(true)
        serverRequest.post(`/v1/invoices`, invoiceData)
        .then(response => {
            setIsPayInvoiceLoading(false)
            dispatch(closeInvoice())
            toast.success(response.data.message, { duration: 3000, position: 'top-right'})
            navigate(`/invoices/${response.data.invoice._id}`)
        })
        .catch(error => {
            setIsPayInvoiceLoading(false)
            console.error(error)
            try {

                const data = error.response.data

                if(data.field === 'invoiceDate') return setInvoiceDateError(data.message)

                if(data.field === 'paidAmount') return setPayAmountError(data.message)

                if(data.field === 'dueDate') return setDueDateError(data.message)

                toast.error(data.message, { duration: 3000, position: 'top-right' })

            } catch(error) {
                console.error(error)
            }
        })

    }

    const deleteInvoice = () => {
        dispatch(closeInvoice())
        setTargetPatient()
        setInsuranceCoveragePercentage()
        setInsurancePolicy()
        setPayAmount(0)
    }

    return <div className="page-container">
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Invoice Checkout"]} 
            />

            <div className="cards-grey-container">
                <div className="invoice-checkout-grid-container body-text">
                    <CardTransition>
                    <div className="invoice-services-container">
                        <h6>{translations[lang]['Invoice']} <span className="action-color-text normal-text">{invoice?.invoice?.invoiceId}</span></h6>
                        <ul>
                            {invoice.services.map(service => <li>
                                <span>{service.name}</span>
                                <span className="invoice-price-container">
                                    {formatMoney(service.cost)}
                                    <span onClick={e => { 
                                        dispatch(removeService(service))
                                        //setCalculatorCounter(calculatorCounter + 1)
                                    }}>
                                        <DeleteOutlineOutlinedIcon />
                                    </span>
                                </span>
                            </li>)}
                        </ul>
                        
                        <ul className="invoice-total-container">
                            <li>
                                <span className="bold-text">{translations[lang]['Total Amount']}</span>
                                <span className="bold-text">{formatMoney(getTotal(invoice.services))}</span>
                            </li>
                            {
                                insurancePolicy?.coveragePercentage ?
                                <li>
                                    <span>{translations[lang]['Insurance Coverage']} {`(${insuranceCoveragePercentage}%)`}</span>
                                    <span>
                                        {formatMoney(getTotal(invoice.services) * (insuranceCoveragePercentage / 100))}
                                    </span>
                                </li>
                                :
                                null
                            }
                            <li>
                                <span className="bold-text">{translations[lang]['Receive Amount']}</span>
                                <span className="bold-text">
                                    {
                                    formatMoney(insuranceCoveragePercentage ? 
                                    getTotal(invoice.services) - (getTotal(invoice.services) * (insuranceCoveragePercentage / 100)) 
                                    : 
                                    getTotal(invoice.services))
                                    }
                                </span>
                            </li>
                            <li>
                                <span>{translations[lang]['Amount Paid']}</span>
                                <span>
                                    {
                                        payAmount ? 
                                        formatMoney(payAmount) 
                                        : 
                                        formatMoney(0)
                                    }
                                </span>
                            </li>
                            <li>
                                <span>{translations[lang]['Amount Remaining']}</span>
                                <span>
                                { 
                                    payAmount ? 
                                    insuranceCoveragePercentage ?
                                    formatMoney((getTotal(invoice.services) - (getTotal(invoice.services) * (insuranceCoveragePercentage/100))) - payAmount) 
                                    :
                                    formatMoney(getTotal(invoice.services) - payAmount) 
                                    : 
                                    formatMoney(0) 
                                }
                                </span>
                            </li>
                        </ul>
                        <div className="invoice-link-container">
                            <NavLink to="/services">{translations[lang]['Add more services?']}</NavLink>
                        </div>
                    </div>
                    </CardTransition>
                    <div></div>
                    <CardTransition>
                        <div className="invoice-payment-container">
                            <div className="invoice-payment-header-container">
                                <div>
                                    <strong>{formatMoney(getTotal(invoice.services))}</strong>
                                </div>
                                <span>{translations[lang]['Date']}, {isDateValid(invoiceDate) ? format(invoiceDate, lang ==='ar' ? 'MM/dd/yyyy' : 'MMM d yyyy') : format(new Date(), lang === 'ar' ? 'MM dd yyyy' : 'MMM d yyyy')}</span>
                            </div>
                            <div className="invoice-payment-list-container">
                                <ul>
                                    <li>
                                        <span>{translations[lang]['To']}</span>
                                        <SearchPatientInputField 
                                        removeLabel={true}
                                        targetPatientError={targetPatientError}
                                        setTargetPatient={setTargetPatient}
                                        setTargetPatientError={setTargetPatientError}
                                        />
                                    </li>
                                    <li>
                                        <span>{translations[lang]['Amount to pay']}</span>
                                        <input 
                                        className="form-input" 
                                        type="number" 
                                        value={payAmount}
                                        min="0"
                                        onChange={e => {
                                            if(insurancePolicy?.coveragePercentage && Number.parseFloat(e.target.value) > totalAmountRemaining) {
                                                return
                                            } else if(!insurancePolicy?.coveragePercentage && getTotal(invoice.services) < Number.parseFloat(e.target.value)) {
                                                return
                                            }

                                            setPayAmount(Number.parseFloat(e.target.value))
                                        }}
                                        onClick={e => setPayAmountError()}
                                        />
                                        <span></span>
                                        <span className="red">{payAmountError}</span>
                                    </li>
                                    <li>
                                        <span>{translations[lang]['Date']}</span>
                                        <input 
                                        className="form-input" 
                                        type="datetime-local" 
                                        onChange={e => setInvoiceDate(new Date(e.target.value))}
                                        onClick={e => setInvoiceDateError()}
                                        />
                                        <span></span>
                                        <span className="red">{invoiceDateError}</span>
                                    </li>
                                    <li>
                                        <span>{translations[lang]['Due Date']}</span>
                                        <input 
                                        className="form-input" 
                                        type="date" 
                                        onChange={e => setDueDate(new Date(e.target.value))}
                                        onClick={e => setDueDateError()}
                                        />
                                        <span></span>
                                        <span className="red">{dueDateError}</span>
                                    </li>
                                    <li>
                                        <span>{translations[lang]['Payment Method']}</span>
                                        <select 
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="form-input"
                                        >
                                            <option value="CASH">{translations[lang]['Cash']}</option>
                                            <option value="CHECK">{translations[lang]['Check']}</option>
                                            <option value="CREDIT_OR_DEBIT">{translations[lang]['Credit or Debit']}</option>
                                            <option value="ONLINE">{translations[lang]['Online Payment']}</option>
                                            <option value="MOBILE">{translations[lang]['Mobile']}</option>
                                        </select>
                                    </li>
                                </ul>
                            </div>
                            <div className="pay-invoice-button">
                                {
                                    isPayInvoiceLoading ?
                                        <TailSpin
                                        height="25"
                                        width="25"
                                        color="#4c83ee"
                                        />
                                        :
                                        <button 
                                        onClick={e => payInvoice()}
                                        className="full-width-button">{translations[lang]['Pay Invoice']}</button>

                                }           
                                {
                                    isDeleteInvoiceLoading ?
                                    <TailSpin
                                        height="25"
                                        width="25"
                                        color="#000"
                                        />
                                    :
                                    <button 
                                    onClick={e => deleteInvoice()}
                                    className="full-width-button cancel-button">{translations[lang]['Cancel']}</button>

                                }                     
                            </div>
                        </div>
                    </CardTransition>
                </div>
            </div>
        </div>
    </div>
}

export default InvoiceCheckoutPage