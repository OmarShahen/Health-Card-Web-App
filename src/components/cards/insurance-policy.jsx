import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '../../utils/formatString'

const InsurancePolicyCard = ({ 
    insurancePolicy, 
    setTargetInsurancePolicy, 
    setIsShowDeleteModal,
    setIsUpdate,
    setShowFormModal
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const cardActionsList = [
        {
            name: translations[lang]['Delete Insurance Policy'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInsurancePolicy(insurancePolicy)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: insurancePolicy.status === 'ACTIVE' ? translations[lang]['Deactivate Insurance Policy'] : translations[lang]['Activate Insurance Policy'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInsurancePolicy(insurancePolicy)
                setIsUpdate(true)
            }
        },
     ]

    return <CardTransition>
    <div className="patient-card-container body-text disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${insurancePolicy?.patient?.firstName + ' ' + insurancePolicy?.patient?.lastName}.svg`} alt="patient-image" />
                <div>
                    <strong>{insurancePolicy?.patient?.firstName + ' ' + insurancePolicy?.patient?.lastName}</strong>
                    <span className="grey-text">{insurancePolicy?.patient?.cardId}</span>
                </div>
            </div>
            {<CardActions actions={cardActionsList} />}
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>{translations[lang]['Clinic']}</strong>
                    <span>{insurancePolicy.clinic.name}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Company']}</strong>
                    <span>{insurancePolicy?.insuranceCompany?.name}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Coverage']}</strong>
                    <span>{insurancePolicy.coveragePercentage}%</span>
                </li>
                <li>
                    <strong>{translations[lang]['Status']}</strong>
                    { 
                    insurancePolicy.status === 'ACTIVE' ? 
                    new Date(insurancePolicy.endDate) > new Date() ?
                        <span className="status-btn done bold-text">{translations[lang][capitalizeFirstLetter(insurancePolicy.status)]}</span> 
                        :
                        <span className="status-btn grey-text bold-text">{translations[lang]['Expired']}</span>
                    : 
                    <span className="status-btn declined bold-text">{translations[lang][capitalizeFirstLetter(insurancePolicy.status)]}</span> 
                    }
                </li>
                <li>
                    <strong>{translations[lang]['Start Date']}</strong>
                    <span>{format(new Date(insurancePolicy.startDate), lang === 'en' ? 'd MMM yyyy' : 'MM/dd/yyyy')}</span>
                </li>
                <li>
                    <strong>{translations[lang]['End Date']}</strong>
                    <span>{format(new Date(insurancePolicy.endDate), lang === 'en' ? 'd MMM yyyy' : 'MM/dd/yyyy')}</span>
                </li>
            </ul>
        </div>
        <CardDate 
        creationDate={insurancePolicy.createdAt}
        updateDate={insurancePolicy.updatedAt}
        />
    </div>
    </CardTransition>
}

export default InsurancePolicyCard