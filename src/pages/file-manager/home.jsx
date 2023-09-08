import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchFolders } from '../../utils/searches/search-folders'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'
import NavigationBar from '../../components/navigation/navigation-bar'
import FolderCard from '../../components/cards/folder'
import FolderFormModal from '../../components/modals/folder-form'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'
import FolderDeleteConfirmationModal from '../../components/modals/confirmation/folder-delete-confirmation-modal'
import FileCard from '../../components/cards/file'
import FileDeleteConfirmationModal from '../../components/modals/confirmation/file-delete-confirmation-modal'
import FileFormModal from '../../components/modals/file-form'
import AppImageViewers from '../../components/viewers/image-viewer'


const FileManagerHomePage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowDeleteFileModal, setIsShowDeleteFileModal] = useState(false)
    const [isShowUpdateFileModal, setIsShowUpdateFileModal] = useState(false)
    const [isShowImageViewer, setIsShowImageViewer] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false)
    const [targetFolder, setTargetFolder] = useState()
    const [targetFile, setTargetFile] = useState()
    const [currentIndex, setCurrentIndex] = useState(0)

    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(1)
    const [reloadFile, setReloadFile] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isFilesLoading, setIsFilesLoading] = useState(true)
    const [folders, setFolders] = useState([])
    const [files, setFiles] = useState([])
    const [imagesURLs, setImagesURLs] = useState([])
    const [searchedFolders, setSearchedFolders] = useState([])

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])   

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/folders/creators/${user._id}`)
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
    }, [reload])

    useEffect(() => {
        setIsFilesLoading(true)
        serverRequest.get(`/v1/files/creators/${user._id}?isPinned=true`)
        .then(response => {
            setIsFilesLoading(false)
            setFiles(response.data.files)
            const imagesFiles = response.data.files.filter(file => ['png', 'jpeg', 'jpg'].includes(file.type))
            const indexedImages = imagesFiles.map((file, index) => {
                file.fileIndex = index
                return file
            })
            setImagesURLs(indexedImages.map(image => image.url))
        })
        .catch(error => {
            setIsFilesLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reloadFile])

    return <div>
        <NavigationBar pageName={translations[lang]['Files Manager']} />
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
            isShowForm ? 
            <FolderFormModal 
            reload={reload} 
            setReload={setReload}
            setShowFormModal={setIsShowForm}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            folder={targetFolder}
            /> 
            : 
            null 
        }
        {
            isShowUpdateFileModal ?
            <FileFormModal
            reload={reloadFile}
            setReload={setReloadFile}
            file={targetFile}
            setShowFormModal={setIsShowUpdateFileModal}
            />
            :
            null
        }
        {
            isShowDeleteFileModal ?
            <FileDeleteConfirmationModal
            setReload={setReloadFile}
            reload={reloadFile}
            file={targetFile}
            setIsShowModal={setIsShowDeleteFileModal}
            />
            :
            null
        }
        {
            isShowDeleteModal ?
            <FolderDeleteConfirmationModal
            setReload={setReload}
            reload={reload}
            folder={targetFolder}
            setIsShowModal={setIsShowDeleteModal}
            />
            :
            null
        }
        <PageHeader 
        pageName={translations[lang]['Files Manager']} 
        addBtnText={translations[lang]['Create Folder']}
        addBtnTextIcon={<CreateNewFolderOutlinedIcon />}
        setShowModalForm={setIsShowForm}
        isHideBackButton={false}
        isHideRefresh={true}
        />
       
        <div className="show-mobile">
            <FloatingButton />
        </div>
        <div>
            <div>
                <div className="search-input-container">
                    <SearchInput 
                    rows={folders} 
                    setRows={setSearchedFolders}
                    searchRows={searchFolders}
                    />
                </div>
                { files.length !== 0 ? <h2>{translations[lang]['Pinned Files']}</h2> : null }
                <div>
                    {
                        isFilesLoading ?
                        <CircularLoading />
                        :
                        files.length !== 0 ?
                        <div className="cards-3-list-wrapper">
                            {files
                            .map((file, fileIndex) => <FileCard
                            file={file}
                            fileIndex={fileIndex}
                            setCurrentIndex={setCurrentIndex}
                            setIsShowImageViewer={setIsShowImageViewer}
                            setTargetFile={setTargetFile}
                            setIsShowUpdate={setIsShowUpdateFileModal}
                            setIsShowDeleteModal={setIsShowDeleteFileModal}
                            setReload={setReloadFile}
                            reload={reloadFile}
                            />)}
                        </div>
                        :
                        null
                    }
                </div> 
                <h2>{translations[lang]['Folders']}</h2>
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
                            setIsShowDeleteModal={setIsShowDeleteModal}
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

export default FileManagerHomePage