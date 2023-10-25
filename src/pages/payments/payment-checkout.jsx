import { useState, useEffect } from 'react'
import { serverRequest } from "../../components/API/request"
import { useSelector, useDispatch } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import NavigationBar from '../../components/navigation/navigation-bar';
import { format } from 'date-fns'
import { formatMoney } from '../../utils/numbers'
import '../invoices/invoice.css'
import { NavLink, useNavigate } from 'react-router-dom'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { removeService, closeInvoice } from '../../redux/slices/invoiceSlice'
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-hot-toast'
import CardTransition from '../../components/transitions/card-transitions';
import { isRolesValid } from '../../utils/roles';


const PaymentCheckoutPage = ({ roles }) => {

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

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const invoice = useSelector(state => state.invoice)

    const [clinics, setClinics] = useState([])

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
        serverRequest.get(`/v1/clinics-owners/owners/${user._id}/owner-created`)
        .then(response => {
            setClinics(response.data.clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])


    const payInvoice = () => {

        if(invoice.services.length == 0) return toast.error('There is no services in the invoice', { duration: 3000, position: 'top-right' })

        if(payAmount > getTotal(invoice.services)) return setPayAmountError('Amount paid is more than the total cost')

        const invoiceData = {
            services: invoice.services.map(service => service._id),
            invoiceDate: invoiceDate ? format(invoiceDate, 'yyyy-MM-dd HH:MM:ss') : format(new Date(), 'yyyy-MM-dd HH:MM:ss'),
            paidAmount: payAmount ? Number.parseFloat(payAmount) : 0,
            paymentMethod,
            dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null
        }

        setIsPayInvoiceLoading(true)
        serverRequest.post(`/v1/invoices/${invoice.invoice._id}/checkout`, invoiceData)
        .then(response => {
            setIsPayInvoiceLoading(false)
            dispatch(closeInvoice())
            toast.success(response.data.message, { duration: 3000, position: 'top-right'})
            navigate('/invoices')
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

        setIsDeleteInvoiceLoading(true)
        serverRequest.delete(`/v1/invoices/${invoice.invoice._id}`)
        .then(response => {
            setIsDeleteInvoiceLoading(false)
            dispatch(closeInvoice())
            toast.success(response.data.message, { duration: 3000, position: 'top-right'})
            navigate('/invoices')
        })
        .catch(error => {
            setIsDeleteInvoiceLoading(false)
            console.error(error)
        })

    }

    return <div className="page-container">
        <div className="padded-container">
            <PageHeader 
            pageName="Upgrade Account" 
            />

            <div className="cards-grey-container">
                <div className="invoice-checkout-grid-container body-text">
                    <CardTransition>
                    <div className="invoice-services-container">
                        <h6>Clinics <span className="action-color-text normal-text">#{clinics.length}</span></h6>
                        <ul>
                            {clinics.map(clinic => <li>
                                <span>{clinic.clinic.name}</span>
                                <span className="invoice-price-container">
                                    {formatMoney(500)}
                                    <span onClick={e => dispatch(removeService(service))}>
                                        <DeleteOutlineOutlinedIcon />
                                    </span>
                                </span>
                            </li>)}
                        </ul>
                        
                        <ul className="invoice-total-container">
                            <li>
                                <span className="bold-text">Total Amount</span>
                                <span className="bold-text">{formatMoney(clinics.length * 500)}</span>
                            </li>
                        </ul>
                        <div className="invoice-link-container">
                            <NavLink to="/services">Add more services?</NavLink>
                        </div>
                    </div>
                    </CardTransition>
                    <div></div>
                    <CardTransition>
                        <div className="invoice-payment-container">
                            <div className="invoice-payment-header-container">
                                <span>Invoice from <span className="actions-color-text">{invoice?.invoice?.clinic?.name}</span></span>
                                <div>
                                    <strong>{formatMoney(getTotal(invoice.services))}</strong>
                                </div>
                                <span>Date, {isDateValid(invoiceDate) ? format(invoiceDate, 'MMM d yyyy hh:MM a') : format(new Date(), 'MMM d yyyy hh:MM a')}</span>
                            </div>
                            <div className="invoice-payment-list-container">
                                <ul>
                                    <li>
                                        <span>To</span>
                                        <input className="form-input" type="number" value={invoice?.invoice?.patientCardId} disabled/>
                                    </li>
                                    <li>
                                        <span>From</span>
                                        <input className="form-input" type="text" value={invoice?.invoice?.clinic?.name} disabled/>
                                    </li>
                                    <li>
                                        <span>Amount to pay</span>
                                        <input 
                                        className="form-input" 
                                        type="number" 
                                        value={payAmount}
                                        min="0"
                                        onChange={e => {
                                            if(Number.parseFloat(e.target.value) > getTotal(invoice.services)) {
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
                                        <span>Date</span>
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
                                        <span>Due Date</span>
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
                                        <span>Payment Method</span>
                                        <select 
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="form-input"
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="CHECK">Check</option>
                                            <option value="CREDIT_OR_DEBIT">Credit or debit</option>
                                            <option value="ONLINE">Online payment</option>
                                            <option value="MOBILE">Mobile</option>
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
                                        className="full-width-button">Pay Invoice</button>

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
                                    className="full-width-button cancel-button">Delete Invoice</button>

                                }                     
                            </div>
                        </div>
                    </CardTransition>
                </div>
            </div>
        </div>
    </div>
}

export default PaymentCheckoutPage