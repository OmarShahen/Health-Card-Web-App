import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { projectStorage } from '../../firebase/config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import CloseIcon from '@mui/icons-material/Close'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import imageIcon from '../../assets/placeholder-img-format.svg'
import pdfIcon from '../../assets/pdf-icon.svg'
import excelIcon from '../../assets/google-sheets-icon.svg'
import wordIcon from '../../assets/google-docs-icon.svg'


const UploadFileFormModal = ({ 
    setShowFormModal, 
    reload, 
    setReload, 
    isUpdate, 
}) => {

    const pagePath = window.location.pathname
    const folderId = pagePath.split('/')[3]

    const lang = useSelector(state => state.lang.lang)
    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [clinics, setClinics] = useState([])

    const [files, setFiles] = useState([])
    const [progress, setProgress] = useState([])
    const [uploadComplete, setUploadComplete] = useState(false)

    const getFileExtension = (fileName) => {

        const splittedFileNameList = fileName.split('.')
        const fileExtension = splittedFileNameList[splittedFileNameList.length - 1]
        return fileExtension
    }

    const getFileName = (fileName) => {

        const splittedFileNameList = fileName.split('.')
        let name = ''

        for(let i=0;i<(splittedFileNameList.length-1);i++) {
            name += splittedFileNameList[i]
        }

        return name
    }

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

    const handleFileChange = (event) => {

        if(event.target.files.length > 6) {
            return toast.error(translations[lang]['6 files is the maximum'], { duration: 3000, position: 'top-right' })
        }

        const fileList = Array.from(event.target.files)
        fileList.forEach(file => {
            file.isUploaded = false
            file.isLoading = false
            const fileSize = file.size / (1024 * 1024)
            file.isSizeValid = fileSize > 25 ? false : true
        })
        setFiles(fileList)
        setProgress(Array(fileList.length).fill(0))
    }


    useEffect(() => {

        if(isUpdate) {
            return
        }

        serverRequest.get(`/v1/clinics-owners/owners/${user._id}`)
        .then(response => {
            const clinics = response.data.clinics
            setClinics(clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    const handleUpload = (e) => {

        e.preventDefault()

        if(files.length === 0) {
            return toast.error(translations[lang]['No files to upload'], { duration: 3000, position: 'top-right' })
        }

        setProgress(Array(files.length).fill(0))
        setUploadComplete(false)
        setIsLoading(true)
        
        files.forEach((file, index) => {

            if(!file.isSizeValid) {
                return
            }

            const storage = getStorage()
            const storageRef = ref(storage, file.name)

            const uploadTask = uploadBytesResumable(storageRef, file);
    
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progressValue = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              )
    
              setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress]
                updatedProgress[index] = progressValue
                return updatedProgress
              });
            },
            (error) => {
              console.error(error)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                const fileData = {
                    creatorId: user._id,
                    folderId,
                    name: getFileName(file.name),
                    size: file.size,
                    type: getFileExtension(file.name).toLowerCase(),
                    url: downloadURL
                }

                serverRequest.post(`/v1/files`, fileData)
                .then(response => {
                    setFiles(files.map(file => {
                        if(file.name === response.data.file.name) {
                            file.isUploaded = true
                        }

                        return file
                    }))
                    toast.success(response.data.message, { duration: 3000, position: 'top-right' })

                    if(index === (files.length - 1)) {
                        setReload(reload + 1)
                    }
                })
                .catch(error => {
                    console.error(error)
                    toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
                })
              });
    
              if (index === files.length - 1) {
                setUploadComplete(true)
                toast.success(translations[lang]['Uploaded files successfully!'], { duration: 3000, position: 'top-right' })
                setIsLoading(false)
                setShowFormModal(false)
              }
            }
          );
        });
      };

    

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{`${translations[lang]['Upload Files']} (Max: 25 MB)`}</h2>
            </div>  
                <div>
                <div className="modal-body-container">
                    <div className="upload-file-form-container">
                        <form 
                        id="upload-form" 
                        className="responsive-form body-text" 
                        onSubmit={handleUpload}
                        > 
                        <label for="file-upload" className="upload-file-input-container">
                        <CloudUploadOutlinedIcon />
                        <p>{translations[lang]['click inside the frame to upload files']}</p>
                        </label>
                        <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".doc, .docx, .xls, .xlsx, .pdf, image/*"
                        onChange={handleFileChange}
                        />            
                        </form>
                            <ul>
                            {files.map((file) => <li>
                                <div className="file-upload-info-container">
                                    <div>
                                        <img src={getFileImage(getFileExtension(file.name))} width="30" height="30" />
                                    </div>
                                    <div>
                                        <span className="body-text grey-text bold-text">{getFileName(file.name)}</span>
                                        <span className="span-text grey-text">{translations[lang]['size']} {
                                        file.size/1000000 > 1 ? 
                                        `${(file.size/(1024 * 1024)).toFixed(2)} MB`
                                        : 
                                        `${(file.size/1024).toFixed(2)} KB`
                                        }
                                        </span>
                                    </div>
                                </div>
                                {
                                    file.isUploaded ?
                                    <CheckOutlinedIcon color="success" />
                                    :
                                    file.isSizeValid ?
                                    <span 
                                    className="remove-file-button"
                                    onClick={e => setFiles(files.filter(targetFile => file.name !== targetFile.name))}
                                    >
                                            <CloseIcon />
                                        </span>
                                        :
                                        <span className="red bold-text">{translations[lang]['Too Big']}</span>
                                }
                                
                                
                            </li>)}
                            </ul>
                    </div>
                </div>
                <div className="modal-form-btn-container">
                    <div>   
                        { 
                            isLoading ?
                            <TailSpin
                            height="25"
                            width="25"
                            color="#4c83ee"
                            />
                            :
                            <button
                            form="upload-form"
                            className="normal-button white-text action-color-bg"
                            >{translations[lang]['Upload']}</button>
                        } 
                    </div>
                    <div>
                        <button 
                        className="normal-button cancel-button"
                        onClick={e => {
                            e.preventDefault()
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
                </div>            
        </div>
    </div>
}

export default UploadFileFormModal