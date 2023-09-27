import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { format } from 'date-fns'
import translations from '../../i18n'
import { useSelector } from 'react-redux'


const ClinicCard = ({ clinic, isOwner, setIsShowDeleteModal, setTargetClinic, isShowRenew, disableOnClickView }) => {

    const navigate = useNavigate()
    const lang = useSelector(state => state.lang.lang)

    const _id = isOwner ? clinic._id : clinic.clinic._id
    const clinicId = isOwner ? clinic?.clinicId : clinic?.clinic?.clinicId
    const name = isOwner ? clinic?.name : clinic?.clinic?.name
    const city = isOwner ? clinic?.city : clinic?.clinic?.city
    const country = isOwner ? clinic?.country : clinic?.clinic?.country
    const mode = isOwner ? clinic?.mode : clinic?.clinic?.mode

    const cardActionsList = [
        {
            name: translations[lang]['Delete Clinic'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetClinic(clinic)
                setIsShowDeleteModal(true)
            }
        },
     ]

    return <CardTransition>
    <div onClick={e => disableOnClickView ? null : navigate(`/clinics/${_id}/profile`)} className={`patient-card-container body-text`}>
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${name}.svg`} alt="patient-image" />
                <div>
                    <strong>{name}</strong>
                    <span className="grey-text">#{clinicId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>{translations[lang]['Phone']}</strong>
                    {
                        clinic?.clinic?.phone ?
                        <span>{`+${clinic?.clinic?.countryCode}${clinic?.clinic?.phone}`}</span>
                        :
                        <span>{translations[lang]['Not Registered']}</span>
                    }
                </li>
                <li>
                    <strong>{translations[lang]['Country']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(country)]}</span>
                </li>
                <li>
                    <strong>{translations[lang]['City']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(city)]}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Mode']}</strong>
                    {
                        mode === 'TEST' ?
                        <span className="status-btn pending bold-text">{mode ? translations[lang][capitalizeFirstLetter(mode)] : ''}</span>
                        :
                        <span className="status-btn done bold-text">{mode ? translations[lang][capitalizeFirstLetter(mode)] : ''}</span>

                    }
                </li>
                {
                    isShowRenew ?
                    <li>
                        <strong>{translations[lang]['Renew Date']}</strong>
                        { clinic?.clinic?.activeUntilDate ? 
                        <span>{format(new Date(clinic?.clinic?.activeUntilDate), lang === 'en' ? 'dd MMMM yyyy' : 'MM/dd/yyyy')}</span> 
                        : 
                        translations[lang]['Not Registered'] }
                    </li>
                    :
                    null
                }
            </ul>
        </div>
        <CardDate creationDate={clinic.createdAt} />
    </div>
    </CardTransition>
}

export default ClinicCard