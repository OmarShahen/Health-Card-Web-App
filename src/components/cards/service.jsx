import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { formatNumber, formatMoney } from '../../utils/numbers'
import { useSelector, useDispatch } from 'react-redux'
import { addService, removeService } from '../../redux/slices/invoiceSlice'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'

const ServiceCard = ({ service, setTargetService, setIsShowForm, setIsShowDeleteModal }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const invoice = useSelector(state => state.invoice)
    const dispatch = useDispatch()

    const addServiceToInvoice = () => {
        dispatch(addService(service))
    }

    const removeServiceFromInvoice = () => {
        dispatch(removeService(service))
    }

    const cardActionsList = [
        {
            name: translations[lang]['Delete Service'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetService(service)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: translations[lang]['Update Service'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetService(service)
                setIsShowForm(true)
            }
        },
     ]

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${service.clinic.name}.svg`} alt="patient-image" />
                <div>
                    <strong>{service.clinic.name}</strong>
                    <span className="grey-text">#{service.clinic.clinicId}</span>
                </div>
            </div>
            { user.roles.includes('OWNER') ? <CardActions actions={cardActionsList} /> : null }
            
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>{translations[lang]['Service']}</strong>
                    <span>{service.name}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Cost']}</strong>
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
                >{translations[lang]['Add']}</button>
                <button 
                className="normal-button cancel-button"
                onClick={e => removeServiceFromInvoice()}
                >{translations[lang]['Remove']}</button>

            </div>
            :
            null
        }
        <CardDate creationDate={service.createdAt} />
    </div>
    </CardTransition>
}

export default ServiceCard