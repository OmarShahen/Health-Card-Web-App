import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchFiles } from '../../utils/searches/search-files'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import translations from '../../i18n'
import NavigationBar from '../../components/navigation/navigation-bar'
import FolderCard from '../../components/cards/folder'
import FolderFormModal from '../../components/modals/folder-form'
import FolderDeleteConfirmationModal from '../../components/modals/confirmation/folder-delete-confirmation-modal'
import UploadFileFormModal from '../../components/modals/file-upload-form'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'
import FileCard from '../../components/cards/file'
import FileFormModal from '../../components/modals/file-form'
import FileDeleteConfirmationModal from '../../components/modals/confirmation/file-delete-confirmation-modal'
import AppImageViewers from '../../components/viewers/image-viewer'

const FileManagerFolderPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const folderId = pagePath.split('/')[3]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)
    const [isShowDeleteFolderModal, setIsShowDeleteFolderModal] = useState(false)
    const [targetFolder, setTargetFolder] = useState()
    const [targetFile, setTargetFile] = useState()

    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowUploadForm, setIsShowUploadForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)

    const [isShowImageViewer, setIsShowImageViewer] = useState(false)

    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(1)
    const [reloadFolder, setReloadFolder] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [folder, setFolder] = useState()
    const [files, setFiles] = useState([])
    const [imagesURLs, setImagesURLs] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [searchedFiles, setSearchedFiles] = useState([])
    const [folders, setFolders] = useState([])
    const [searchedFolders, setSearchedFolders] = useState([])

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])   

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/folders/parent-folder/${folderId}`)
        .then(response => {
            setIsLoading(false)
            setFolders(response.data.folders)
            setSearchedFolders(response.data.folders)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [window.location.pathname, reloadFolder])

    useEffect(() => {
        serverRequest.get(`/v1/folders/${folderId}`)
        .then(response => {
            setFolder(response.data.folder)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [window.location.pathname])

    useEffect(() => {
        serverRequest.get(`/v1/files/folders/${folderId}`)
        .then(response => {
            setFiles(response.data.files)
            setSearchedFiles(response.data.files)
            const imagesFiles = response.data.files.filter(file => ['png', 'jpeg', 'jpg'].includes(file.type))
            const indexedImages = imagesFiles.map((file, index) => {
                file.fileIndex = index
                return file
            })
            setImagesURLs(indexedImages.map(image => image.url))

        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [window.location.pathname, reload])


    return <div>
        { 
            isShowImageViewer && imagesURLs.length !== 0 ? 
            <AppImageViewers 
            imagesURLs={imagesURLs} 
            currentIndex={currentIndex}
            setIsShowImageViewer={setIsShowImageViewer} 
            /> 
            : 
            null 
        }
        { 
        isShowUploadForm ? 
        <UploadFileFormModal 
        reload={reload}
        setReload={setReload}
        setShowFormModal={setIsShowUploadForm}
        /> 
        : 
        null 
        }

        {
            isShowUpdateModal ?
            <FileFormModal
            reload={reload}
            setReload={setReload}
            file={targetFile}
            setShowFormModal={setIsShowUpdateModal}
            />
            :
            null
        }
        { 
            isShowForm ? 
            <FolderFormModal
            reload={reloadFolder} 
            setReload={setReloadFolder}
            setShowFormModal={setIsShowForm}
            parentFolderId={folderId}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            folder={targetFolder}
            /> 
            : 
            null 
        }
        {
            isShowDeleteFolderModal ?
            <FolderDeleteConfirmationModal
            setReload={setReloadFolder}
            reload={reloadFolder}
            folder={targetFolder}
            setIsShowModal={setIsShowDeleteFolderModal}
            />
            :
            null
        }
        {
            isShowDeleteModal ?
            <FileDeleteConfirmationModal
            setReload={setReload}
            reload={reload}
            file={targetFile}
            setIsShowModal={setIsShowDeleteModal}
            />
            :
            null
        }
        <PageHeader 
        pageName={folder ? folder.name : translations[lang]['Loading...']} 
        addBtnText={translations[lang]['Create Folder']}
        addBtnText2={translations[lang]['Upload File']}
        addBtnText2Icon={<CloudUploadOutlinedIcon />}
        addBtnTextIcon={<CreateNewFolderOutlinedIcon />}
        setShowModalForm={setIsShowForm}
        setShowModalForm2={setIsShowUploadForm}
        isHideBackButton={false}
        isHideRefresh={true}
        />
       
        <div className="show-mobile">
            <FloatingButton 
            setIsShowForm={setIsShowUploadForm}
            />
        </div>
        <div>
            <div>
                <div className="search-input-container">
                    <SearchInput
                    rows={files} 
                    setRows={setSearchedFiles}
                    searchRows={searchFiles}
                    isHideClinics={true}
                    />
                </div>
                { searchedFolders.length !== 0 ? <h2>{translations[lang]['Folders']}</h2> : null }
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedFolders.length !== 0 ?
                        <div className="cards-3-list-wrapper">
                            {searchedFolders
                            .map(folder => <FolderCard 
                            folder={folder}
                            setTargetFolder={setTargetFolder}
                            setIsUpdate={setIsUpdate}
                            setIsShowUpdate={setIsShowForm}
                            setIsShowDeleteModal={setIsShowDeleteFolderModal}
                            />)}
                        </div> 
                        :
                        null
                    }
                </div> 
                <h2>{translations[lang]['Files']}</h2>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedFiles.length !== 0 ?
                        <div className="cards-3-list-wrapper">
                            {searchedFiles
                            .map((file, index) => <FileCard
                            file={file}
                            fileIndex={index}
                            setCurrentIndex={setCurrentIndex}
                            setIsShowImageViewer={setIsShowImageViewer}
                            setTargetFile={setTargetFile}
                            setIsShowUpdate={setIsShowUpdateModal}
                            setIsShowDeleteModal={setIsShowDeleteModal}
                            setReload={setReload}
                            reload={reload}
                            />)}
                        </div>
                            
                        :
                        <EmptySection />
                    }
                </div> 
            </div>
        </div>
        <br />
    </div>
}

export default FileManagerFolderPage