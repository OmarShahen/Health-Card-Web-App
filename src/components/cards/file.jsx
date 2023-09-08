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
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
import imageIcon from '../../assets/placeholder-img-format.svg'
import pdfIcon from '../../assets/pdf-icon.svg'
import excelIcon from '../../assets/google-sheets-icon.svg'
import wordIcon from '../../assets/google-docs-icon.svg'
import PushPinIcon from '@mui/icons-material/PushPin'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'



const FileCard = ({ 
    file, 
    fileIndex,
    setCurrentIndex,
    setTargetFile, 
    setIsShowImageViewer,
    setIsShowDeleteModal,
    setIsUpdate,
    setShowFormModal,
    setIsShowUpdate,
    setReload,
    reload
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()

    const handleDownload = () => {

        const fileUrl = file.url
        const fileName = file.name
    
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = fileName
        link.click()
    }

    const pinFile = () => {
        serverRequest.patch(`/v1/files/${file._id}/pin`, { isPinned: !file.isPinned })
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }
    

    const cardActionsList = [
        {
            name: translations[lang]['Download'],
            icon: <CloudDownloadOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                window.open(file.url, '_blank')
            }
        },
        {
            name: translations[lang]['Rename'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetFile(file)
                setIsShowUpdate(true)
            }
        },
        {
            name: file.isPinned ? translations[lang]['Remove Pin'] : translations[lang]['Pin'],
            icon: <PushPinIcon />,
            onAction: (e) => {
                e.stopPropagation()
                pinFile()
            }
        },
        {
            name: translations[lang]['Delete'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetFile(file)
                setIsShowDeleteModal(true)
            }
        }
     ]

    const getFileImage = (fileExtension) => {

        fileExtension = fileExtension.toLowerCase()

        if(['pdf'].includes(fileExtension)) {
            return pdfIcon
        }

        if(['doc', 'docx'].includes(fileExtension)) {
            return wordIcon
        }

        if(['xls', 'xlsx'].includes(fileExtension)) {
            return excelIcon
        } 

        return imageIcon
    }

    return <CardTransition>
    <div onClick={e =>  {

        if(['png', 'jpg', 'jpeg'].includes(file.type)) {
            setCurrentIndex(file.fileIndex)
            setIsShowImageViewer(true) 
            return
        }

        if(file.type === 'pdf') {
            window.open(`/viewers/pdf/${file._id}`, '_blank')
            return
        }

        window.open(file.url, '_blank')
    }} 
    className="patient-card-container body-text"
    >
        <div className="folder-header-container">
            <span className="span-text grey-text bold-text">
                {
                    file.size / (1024 * 1024) > 1 ? 
                    `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    :
                    `${(file.size / (1024)).toFixed(2)} KB`
                }
            </span>
            <CardActions actions={cardActionsList} />
        </div>
        <div>
            <div className="center">
                <img src={getFileImage(file.type)} width="50" height="50" />
            </div>
            <div className="center margin-top-1">
                <span className="body-text bold-text">{file.name}</span>
            </div>
            {
                file.isPinned ?
                <div className="pin-icon-container span-text">
                    <PushPinIcon />
                </div>
                :
                null
            }
        </div>
        <CardDate 
        creationDate={file.createdAt}
        updateDate={file.updatedAt}
        />
    </div>
    </CardTransition>
}

export default FileCard