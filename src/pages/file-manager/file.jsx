import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import FiltersSection from '../../components/sections/filters/filters'
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
import PrescriptionDeleteConfirmationModal from '../../components/modals/confirmation/prescription-delete-confirmation-modal'
import NavigationBar from '../../components/navigation/navigation-bar'
import FolderCard from '../../components/cards/folder'
import FolderFormModal from '../../components/modals/folder-form'
import FolderDeleteConfirmationModal from '../../components/modals/confirmation/folder-delete-confirmation-modal'
import UploadFileFormModal from '../../components/modals/file-upload-form'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'
import FileCard from '../../components/cards/file'

const FileManagerFilesPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const folderId = pagePath.split('/')[3]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [targetFolder, setTargetFolder] = useState()

    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowUploadForm, setIsShowUploadForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)

    const [statsQuery, setStatsQuery] = useState({})
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    const [files, setFiles] = useState([])
    const [searchedFiles, setSearchedFiles] = useState([])

    const [folders, setFolders] = useState([])
    const [searchedFolders, setSearchedFolders] = useState([])

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])   

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/files/creators/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setFiles(response.data.files)
            setSearchedFiles(response.data.files)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [window.location.pathname, reload])

    return <div>
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
            isShowForm ? 
            <FolderFormModal
            reload={reload} 
            setReload={setReload}
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
        pageName={'Files'} 
        addBtnText={'Create Folder'}
        addBtnText2={'Upload File'}
        addBtnText2Icon={<CloudUploadOutlinedIcon />}
        addBtnTextIcon={<CreateNewFolderOutlinedIcon />}
        setShowModalForm={setIsShowForm}
        setShowModalForm2={setIsShowUploadForm}
        isHideBackButton={false}
        isHideRefresh={true}
        />
       
        <div className="show-mobile">
            <FloatingButton />
        </div>
        <div>
            <div>
                <FiltersSection setStatsQuery={setStatsQuery} statsQuery={statsQuery} defaultValue={'LIFETIME'} />
                <div className="search-input-container">
                    <SearchInput
                    rows={folders} 
                    setRows={setSearchedFolders}
                    searchRows={searchFolders}
                    isHideClinics={true}
                    />
                </div>
                <div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedFiles.length !== 0 ?
                        <div className="cards-3-list-wrapper">
                            {searchedFiles
                            .map(file => <FileCard 
                            file={file}
                            setTargetFolder={setTargetFolder}
                            setIsUpdate={setIsUpdate}
                            setIsShowUpdate={setIsShowForm}
                            setIsShowDeleteModal={setIsShowDeleteModal}
                            reload={reload}
                            setReload={setReload}
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

export default FileManagerFilesPage