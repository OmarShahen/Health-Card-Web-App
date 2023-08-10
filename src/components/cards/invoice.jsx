import { useState } from 'react'
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useNavigate } from 'react-router-dom'
import { formatMoney } from '../../utils/numbers'
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'

const InvoiceCard = ({ 
    invoice, 
    reload, 
    setReload, 
    setIsShowPayDebtForm, 
    setTargetInvoice, 
    setIsShowDeleteModal,
    setIsShowRefundModal,
    selectedInvoices,
    setSelectedInvoices,
    isSelectMode
}) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const patientName = `${invoice.patient.firstName} ${invoice.patient.lastName}`
    const patientPhone = `+${invoice.patient.countryCode}${invoice.patient.phone}`

    const formatPaymentMethod = (method) => {
        if(method === 'CASH') return translations[lang]['Cash']
        if(method === 'CHECK') return translations[lang]['Check']
        if(method === 'CREDIT_OR_DEBIT') return translations[lang]['Credit or Debit']
        if(method === 'ONLINE') return translations[lang]['Online Payment']
        if(method === 'MOBILE') return translations[lang]['Mobile']
    }

    const formatStatus = (status) => {
        if(status === 'PAID') {
            return <span className="status-btn done bold-text">{translations[lang]['Paid']}</span>
        } else if(status === 'PENDING') {
            return <span className="status-btn pending bold-text">{translations[lang]['Pending']}</span>
        } else if(status === 'REFUNDED') {
            return <span className="status-btn declined bold-text">{translations[lang]['Refunded']}</span>
        } else if(status === 'DRAFT') {
            return <span className="status-btn grey-bg bold-text">{translations[lang]['Draft']}</span>
        } else if(status === 'PARTIALLY_PAID') {
            return <span className="tag-purple-bg status-btn white-text bold-text">{translations[lang]['Partially Paid']}</span>
        } else if(status === 'OVERDUE') {
            return <span className="red-bg status-btn white-text bold-text">{translations[lang]['Overdue']}</span>
        }

        return <span className="status-btn grey-bg bold-text">{status.toLowerCase()}</span>
    }

    const cardActionsList = [
        {
            name: translations[lang]['Delete Invoice'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInvoice(invoice)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: translations[lang]['Pay Debt'],
            icon: <AddCardOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInvoice(invoice)
                setIsShowPayDebtForm(true)
            }
        },
        {
            name: translations[lang]['Refund Invoice'],
            icon: <CurrencyExchangeOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInvoice(invoice)
                setIsShowRefundModal(true)
            }
        }
     ]

     const isSelected = () => {
        return selectedInvoices.filter(selectedInvoice => selectedInvoice._id === invoice._id).length !== 0 ? true : false
     }

    return <CardTransition>
    <div 
    onClick={e => isSelectMode ? null : navigate(`/invoices/${invoice._id}`)} 
    className={ isSelectMode ? "patient-card-container body-text disable-hover" : "patient-card-container body-text"}
    style={isSelected() ? { border: '2px solid #4c83ee'} : {}}
    >
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${patientName}.svg`} alt="patient-image" />
                <div>
                    <strong>{patientName}</strong>
                    <span className="grey-text">{patientPhone}</span>
                </div>
            </div>
            { user.roles.includes('STAFF') || user.roles.includes('OWNER') ? <CardActions actions={cardActionsList} /> : null }
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>{translations[lang]['ID']}</strong>
                    <span>#{invoice.invoiceId}</span>
                </li>
                {
                    invoice.clinic ?
                    <li>
                        <strong>{translations[lang]['Clinic']}</strong>
                        <span>{invoice.clinic.name}</span>
                    </li>
                    :
                    null
                }
                <li>
                    <strong>{translations[lang]['Status']}</strong>
                    {formatStatus(new Date(invoice.dueDate) < new Date() && !['PAID', 'REFUNDED'].includes(invoice.status) ? 'OVERDUE' : invoice.status)}
                </li>
                <li>
                    <strong>{translations[lang]['Payment method']}</strong>
                    <span>{invoice.paymentMethod ? formatPaymentMethod(invoice.paymentMethod) : translations[lang]['Not Registered']}</span>
                </li>
                <li>
                    <strong>{'Insurance Company'}</strong>
                    <span>{invoice.insuranceCompany ? invoice?.insuranceCompany?.name : translations[lang]['Not Registered']}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Total amount']}</strong>
                    <span>{formatMoney(invoice.totalCost)}</span>
                </li>
                <li>
                    <strong>{`Insurance coverage ${invoice.insuranceCoveragePercentage ? `(${invoice.insuranceCoveragePercentage}%)` : ''}`}</strong>
                    <span>
                        {
                            invoice.insuranceCoveragePercentage ?
                            formatMoney(invoice.totalCost * (invoice?.insuranceCoveragePercentage / 100))
                            :
                            translations[lang]['Not Registered']
                        }
                    </span>
                </li>     
                <li>
                    <strong>{translations[lang]['Paid']}</strong>
                    <span>{formatMoney(invoice.paid)}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Remaining amount']}</strong>
                    <span>
                        {
                            invoice.insurancePolicyId ? 
                            formatMoney((invoice.totalCost - (invoice.totalCost * (invoice?.insuranceCoveragePercentage / 100))) - invoice.paid) 
                            : 
                            formatMoney(invoice.totalCost - invoice.paid)
                        }
                    </span>
                </li>
                <li>
                    <strong>{translations[lang]['Due date']}</strong>
                    <span>{invoice.dueDate ? format(new Date(invoice.dueDate), lang === 'en' ? 'd MMM yyyy' : 'dd/MM/yyyy') : translations[lang]['Not Registered']}</span>
                </li>
            </ul>
        </div>
        {
            isSelectMode ?
            <div className="card-buttons-container">
                <button 
                className="cancel-button normal-button"
                onClick={e => {
                    e.stopPropagation()
                    if(!isSelected()) return
                    setSelectedInvoices(selectedInvoices.filter(selectedInvoice => selectedInvoice._id !== invoice._id))
                }}
                >
                    Remove
                </button>
                <button 
                className="normal-button action-color-bg white-text"
                onClick={e => {
                    e.stopPropagation()
                    if(isSelected()) return
                    setSelectedInvoices([invoice, ...selectedInvoices])
                }}
                >
                    Add
                </button>
            </div>
            :
            null
        }
        <CardDate 
        creationDate={invoice.invoiceDate ? invoice.invoiceDate : invoice.createdAt}
        updateDate={invoice.updatedAt}
        />
    </div>
    </CardTransition>
}

export default InvoiceCard