import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { formatNumber, formatMoney } from '../../utils/numbers'
import { useSelector, useDispatch } from 'react-redux'
import { addService, removeService } from '../../redux/slices/invoiceSlice'


const ServiceCard = ({ service, reload, setReload, setTargetService, setIsShowForm }) => {

    const invoice = useSelector(state => state.invoice)
    const dispatch = useDispatch()

    const deleteService = (service) => {
        serverRequest.delete(`/v1/services/${service._id}`)
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const addServiceToInvoice = () => {
        dispatch(addService(service))
    }

    const removeServiceFromInvoice = () => {
        dispatch(removeService(service))
    }

    const cardActionsList = [
        {
            name: 'Delete service',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deleteService(service)
            }
        },
        {
            name: 'Update service',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetService(service)
                setIsShowForm(true)
            }
        },
     ]

    return <div className="patient-card-container disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${service.clinic.name}.svg`} alt="patient-image" />
                <div>
                    <strong>{service.clinic.name}</strong>
                    <span className="grey-text">#{service.clinic.clinicId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Service</strong>
                    <span>{service.name}</span>
                </li>
                <li>
                    <strong>Cost</strong>
                    <span>{formatMoney(service.cost)}</span>
                </li>
            </ul>
        </div>
        {
            invoice.isActive ?
            <div className="card-buttons-container">
                <button 
                className="normal-button action-color-bg white-text"
                onClick={e => addServiceToInvoice()}
                >Add</button>
                <button 
                className="normal-button cancel-button"
                onClick={e => removeServiceFromInvoice()}
                >Remove</button>

            </div>
            :
            null
        }
        <CardDate creationDate={service.createdAt} />
    </div>
}

export default ServiceCard