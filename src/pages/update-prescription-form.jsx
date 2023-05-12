import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import DrugsTable from '../components/tables/drugs'
import DrugFormModal from '../components/modals/drug-form';
import NavigationBar from '../components/navigation/navigation-bar';


const UpdatePrescriptionsFormPage = () => {

    const navigate = useNavigate()
    const pagePath = window.location.pathname
    const prescriptionId = pagePath.split('/')[2]

    const [isSubmit, setIsSubmit] = useState(false)

    const [targetDrug, setTargetDrug] = useState()
    const [targetIndex, setTargetIndex] = useState()
    const [showFormModal, setShowFormModal] = useState(false)

    const [prescription, setPrescription] = useState()
    const [drugs, setDrugs] = useState([])

    const [drugsError, setDrugsError] = useState()

    useEffect(() => {
        serverRequest.get(`/v1/prescriptions/${prescriptionId}`)
        .then(response => {
            const data = response.data
            setPrescription(data.prescription)
            setDrugs(data.prescription.medicines)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [])


    const handleNotesKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setNotes([...notes, value])

        e.target.value = ''
    }

    const handlePrescription = () => {
        
        if(drugs.length === 0) return setDrugsError('No drug is registered in the prescription')

        const medicalData = {
            medicines: drugs
        }

        setIsSubmit(true)
        serverRequest.put(`v1/prescriptions/${prescriptionId}`, medicalData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { duration: 5000, position: 'top-center' })
            navigate(`/prescriptions/${prescriptionId}/view`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
        })
        
    }

    const resetForm = () => {
        setDrugs([])
        setDrugsError()
    }

    return <div className="page-container">
        <NavigationBar pageName="Prescription Form" />
        {
            showFormModal ?
            <DrugFormModal 
            drugs={drugs} 
            setDrugs={setDrugs}
            setShowFormModal={setShowFormModal}
            targetDrug={targetDrug}
            targetIndex={targetIndex}
            />
            :
            null
        }
        <div className="padded-container">
            <PageHeader pageName={'Update Prescription'} />
            <div className="prescription-form-wrapper left">
                <div className="prescription-form-notes-container box-shadow margin-top-1">
                    <div className="prescription-header-container">
                        <div>
                            <h3>Medications</h3>
                            <span className="red">{drugsError}</span>
                        </div>
                        <button 
                        className="normal-button white-text action-color-bg" 
                        onClick={e => {
                            setDrugsError()
                            setShowFormModal(true)
                        }}
                        >
                        Add Drug
                        </button>
                    </div>
                    
                    {
                        prescription ?
                        <DrugsTable 
                        drugs={drugs} 
                        setDrugs={setDrugs} 
                        isRemoveAction={true}
                        isUpdateAction={false}
                        isShowFilters={false}
                        setTargetDrug={setTargetDrug}
                        setShowFormModal={setShowFormModal}
                        setTargetIndex={setTargetIndex}
                        />
                        :
                        null
                    }
                
                </div>
                <div className="margin-top-1">
                    
                        {
                            isSubmit ?
                            <button className="send-btn center full-width-button action-color-bg">
                                <TailSpin
                                height="30"
                                width="40"
                                color="#FFF"
                                />
                            </button>
                            :
                            <button className="full-width-button action-color-bg white-text" onClick={e => handlePrescription()}>
                                Update Prescription
                            </button>
                        }
                        <br />
                        <button 
                        className="full-width-button grey-bg black box-shadow" 
                        onClick={e => resetForm()}>
                            Reset
                        </button>
                </div>
            </div>
        </div>
        
    </div>
}

export default UpdatePrescriptionsFormPage