import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { SignalWifiStatusbarNullTwoTone } from '@mui/icons-material'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'


const FolderCard = ({ 
    folder, 
    setTargetFolder, 
    setIsShowDeleteModal,
    setIsUpdate,
    setShowFormModal,
    setIsShowUpdate
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    

    const cardActionsList = [
        {
            name: translations[lang]['Rename'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetFolder(folder)
                setIsUpdate(true)
                setIsShowUpdate(true)
            }
        },
        {
            name: translations[lang]['Delete'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetFolder(folder)
                setIsShowDeleteModal(true)
            }
        }
     ]

    return <CardTransition>
    <div onClick={e => navigate(`/files-manager/folders/${folder._id}`)} className="patient-card-container body-text">
        <div className="folder-header-container">
            <div className="folder-image-container">
                <CreateNewFolderOutlinedIcon />
                <div className="body-text folder-description-container">
                    <strong className="">{folder.name}</strong>
                    <span className="grey-text span-text">
                        {translations[lang]['creator:']} 
                        <span className="bold-text"> {folder?.creator?.firstName + ' ' + folder?.creator?.lastName}</span>
                    </span>
                    <span className="grey-text span-text">
                        {translations[lang]['clinic:']}
                        <span className="bold-text"> {folder?.clinic?.name}</span>
                    </span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <CardDate 
        creationDate={folder.createdAt}
        updateDate={folder.updatedAt}
        />
    </div>
    </CardTransition>
}

export default FolderCard