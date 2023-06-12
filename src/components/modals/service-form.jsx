import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import CircularLoading from '../loadings/circular'


const ServiceFormModal = ({ setShowFormModal, reload, setReload, service, setService }) => {

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)
    const [isClinicsLoading, setIsClinicsLoading] = useState(false)

    const [clinics, setClinics] = useState([])

    const [name, setName] = useState(service ? service.name : '')
    const [cost, setCost] = useState(service ? service.cost : '')
    const [clinic, setClinic] = useState()


    const [nameError, setNameError] = useState()
    const [costError, setCostError] = useState()
    const [clinicError, setClinicError] = useState()


    useEffect(() => {

        if(service) {
            return
        }
        
        setIsClinicsLoading(true)
        serverRequest.get(`/v1/clinics-owners/owners/${user._id}`)
        .then(response => {
            setIsClinicsLoading(false)
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(erorr => {
            setIsClinicsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')

        if(!clinic) return setClinicError('Clinic is required')

        if(!cost) return setCostError('Cost is required')
        

        const service = {
            name,
            clinicId: clinic,
            cost: Number.parseFloat(cost)
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/services`, service)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'cost') return setCostError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')

        if(!cost) return setCostError('Cost is required')
        

        const serviceData = {
            name,
            cost: Number.parseFloat(cost)
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/services/${service._id}`, serviceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'cost') return setCostError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ service ? 'Update Service' : 'Create Service'}</h2>
            </div>
            {
                isClinicsLoading ?
                <CircularLoading />
                :
                <div>
                <div className="modal-body-container">
                    <form 
                    id="service-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={service ? handleUpdate : handleSubmit}
                    >
                        <div className="form-input-container">
                            <label>Name</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder=""
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onClick={e => setNameError()}
                            />
                            <span className="red">{nameError}</span>
                        </div>
                        {
                            service ?
                            null
                            :
                            <div className="form-input-container">
                                <label>Clinic</label>
                                <select
                                onChange={e => setClinic(e.target.value)}
                                onClick={e => setClinicError()}
                                >
                                    <option selected disabled>select clinic</option>
                                    {clinics.map(clinic => <option value={clinic?.clinic?._id}>
                                        {clinic?.clinic?.name}
                                    </option>)}
                                </select>
                                <span className="red">{clinicError}</span>
                            </div> 
                        }
                        <div className="form-input-container">
                            <label>Cost</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder=""
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            onClick={e => setCostError()}
                            />
                            <span className="red">{costError}</span>
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
                                    form="service-form"
                                    className="normal-button white-text action-color-bg"
                                    >{service ? 'Update' : 'Create'}</button>
                                } 
                            </div>
                            <div>
                                <button 
                                className="normal-button cancel-button"
                                onClick={e => {
                                    e.preventDefault()
                                    setShowFormModal(false)
                                    setService()
                                }}
                                >Close</button>
                            </div>
                </div>
                </div>
            }
            
        </div>
    </div>
}

export default ServiceFormModal