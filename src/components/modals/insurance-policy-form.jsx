import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import format from 'date-fns/format'
import SearchPatientInputField from '../inputs/patients-search'

const InsurancePolicyFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, insurancePolicy }) => {

    const lang = useSelector(state => state.lang.lang)
    const user = useSelector(state => state.user.user)
    const companies = useSelector(state => state.insuranceCompanies.insuranceCompanies)

    const [isSubmit, setIsSubmit] = useState(false)

    const [targetPatient, setTargetPatient] = useState()
    const [companyName, setCompanyName] = useState(isUpdate ? insurancePolicy?.insuranceCompany?.name : '')
    const [coveragePercentage, setCoveragePercentage] = useState(isUpdate ? insurancePolicy.coveragePercentage : '')
    const [startDate, setStartDate] = useState(isUpdate ? format(new Date(insurancePolicy.startDate), 'mm/dd/yyyy') : '')
    const [endDate, setEndDate] = useState(isUpdate ? format(new Date(insurancePolicy.endDate), 'mm/dd/yyyy') : '')

    const [targetPatientError, setTargetPatientError] = useState()
    const [companyNameError, setCompanyNameError] = useState()
    const [coveragePercentageError, setCoveragePercentageError] = useState()
    const [startDateError, setStartDateError] = useState()
    const [endDateError, setEndDateError] = useState()



    const handleSubmit = (e) => {
        e.preventDefault()

        if(!targetPatient) return setTargetPatientError(translations[lang]['patient is required'])

        if(!companyName) return setCompanyNameError(translations[lang]['company name is required'])   

        if(!coveragePercentage) return setCoveragePercentageError(translations[lang]['coverage percentage is required']) 

        if(!startDate) return setStartDateError(translations[lang]['start date is required']) 

        if(!endDate) return setEndDateError(translations[lang]['end date is required']) 

        const insurancePolicyData = {
            patientId: targetPatient.patientId,
            clinicId: user.clinicId,
            insuranceCompanyId: companyName,
            coveragePercentage: Number.parseFloat(coveragePercentage),
            startDate,
            endDate,
            status: 'ACTIVE',
            type: 'LIFE'
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/insurance-policies`, insurancePolicyData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'insuranceCompanyId') return setCompanyNameError(errorResponse.message)

                if(errorResponse.field === 'coveragePercentage') return setCoveragePercentageError(errorResponse.message)

                if(errorResponse.field === 'startDate') return setStartDateError(errorResponse.message)

                if(errorResponse.field === 'endDate') return setEndDateError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{translations[lang]['Add Insurance Policy']}</h2>
            </div>  
                <div>
                <div className="modal-body-container">
                    <form 
                    id="insurance-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={handleSubmit}
                    >
                        <SearchPatientInputField
                        targetPatientError={targetPatientError}
                        setTargetPatient={setTargetPatient}
                        setTargetPatientError={setTargetPatientError}
                        />
                        <div className="form-input-container">
                            <label>{translations[lang]['Insurance Company']}</label>
                            <select
                            className="form-input"
                            onClick={e => setCompanyNameError()}
                            onChange={e => setCompanyName(e.target.value)}
                            >
                            <option selected disabled>{translations[lang]['Select Insurance Company']}</option>
                            {companies.map(company => <option value={company._id}>{company.name}</option>)}
                            </select>
                            <span className="red">{companyNameError}</span>
                        </div> 
                        <div className="form-input-container">
                            <label>{translations[lang]['Coverage Percentage']}</label>
                            <input
                            type="number"
                            className="form-input"
                            onClick={e => setCoveragePercentageError()}
                            onChange={e => setCoveragePercentage(e.target.value)}
                            value={coveragePercentage}
                            />
                            <span className="red">{coveragePercentageError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>{translations[lang]['Start Date']}</label>
                            <input
                            type="date"
                            className="form-input"
                            onClick={e => setStartDateError()}
                            onChange={e => setStartDate(e.target.value)}
                            value={startDate}
                            />
                            <span className="red">{startDateError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>{translations[lang]['End Date']}</label>
                            <input
                            type="date"
                            className="form-input"
                            onClick={e => setEndDateError()}
                            onChange={e => setEndDate(e.target.value)}
                            value={endDate}
                            />
                            <span className="red">{endDateError}</span>
                        </div>         
                    </form>
                </div>
                <div className="modal-form-btn-container">
                            <div>   
                                { 
                                    isSubmit ?
                                    <TailSpin
                                    height="25"
                                    width="25"
                                    color="#4c83ee"
                                    />
                                    :
                                    <button
                                    form="insurance-form"
                                    className="normal-button white-text action-color-bg"
                                    >{isUpdate ? translations[lang]['Update'] : translations[lang]['Add']}</button>
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

export default InsurancePolicyFormModal