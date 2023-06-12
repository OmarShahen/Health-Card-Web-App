import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { formatNumber } from '../../utils/numbers'


const InvoiceCard = ({ invoice, reload, setReload }) => {

    const navigate = useNavigate()

    const patientName = `${invoice.patient.firstName} ${invoice.patient.lastName}`
    const patientPhone = `+${invoice.patient.countryCode}${invoice.patient.phone}`

    const deleteInvoice = (invoiceId) => {
        serverRequest.delete(`/v1/invoices/${invoiceId}`)
        .then(response => {
            const data = response.data
            setReload(reload+1)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const cardActionsList = [
        {
            name: 'Delete Invoice',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deleteInvoice(invoice._id)
            }
        }
     ]

    return <div onClick={e => navigate(`/patients/${invoice.patient._id}/medical-profile`)} className="patient-card-container">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${patientName}.svg`} alt="patient-image" />
                <div>
                    <strong>{patientName}</strong>
                    <span className="grey-text">{patientPhone}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                {
                    invoice.clinic ?
                    <li>
                        <strong>Clinic</strong>
                        <span>{invoice.clinic.name}</span>
                    </li>
                    :
                    null
                }
                <li>
                    <strong>Status</strong>
                    <span className="status-btn pending bold-text">{invoice.status}</span>
                </li>
                <li>
                    <strong>Payment Method</strong>
                    <span>{invoice.paymentMethod ? invoice.paymentMethod : 'Not registered'}</span>
                </li>
                <li>
                    <strong>Total Amount</strong>
                    <span className="bold-text">{formatNumber(invoice.totalCost)}</span>
                </li>
            </ul>
        </div>
        <CardDate creationDate={invoice.createdAt} />
    </div>
}

export default InvoiceCard