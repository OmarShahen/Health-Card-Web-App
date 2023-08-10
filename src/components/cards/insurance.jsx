import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'
import { useNavigate } from 'react-router-dom'


const InsuranceCard = ({ 
    insurance, 
    setTargetInsurance, 
    setIsShowDeleteModal,
    setIsUpdate,
    setShowFormModal
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    

    const cardActionsList = [
        {
            name: 'Delete Insurance',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInsurance(insurance)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Insurance',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInsurance(insurance)
                setIsUpdate(true)
                setShowFormModal(true)
            }
        },
     ]

    return <CardTransition>
    <div onClick={e => navigate(`/insurance-companies/${insurance._id}/invoices`)} className="patient-card-container body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${insurance.name}.svg`} alt="patient-image" />
                <div>
                    <strong>{insurance.name}</strong>
                    <span className="grey-text">{''}</span>
                </div>
            </div>
            {<CardActions actions={cardActionsList} />}
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Clinic</strong>
                    <span>{insurance.clinic.name}</span>
                </li>
            </ul>
        </div>
        <CardDate 
        creationDate={insurance.createdAt}
        updateDate={insurance.updatedAt}
        />
    </div>
    </CardTransition>
}

export default InsuranceCard