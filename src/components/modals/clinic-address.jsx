import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import PageTransition from '../transitions/page-transitions'
import { clearClinic } from '../../redux/slices/clinicSlice'
import { setUser } from '../../redux/slices/userSlice'


const ClinicAddressFormModal = ({ reload, setReload, setShowModalForm, setIsShowServiceModal, setClinicId }) => {

    const user = useSelector(state => state.user.user)
    const clinic = useSelector(state => state.clinic)
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [buildingName, setBuildingName] = useState()
    const [apartmentNumber, setApartmentNumber] = useState()
    const [floor, setFloor] = useState()
    const [street, setStreet] = useState()
    const [additionalDirections, setAdditionalDirections] = useState()

    const [buildingNameError, setBuildingNameError] = useState()
    const [apartmentNumberError, setApartmentNumberError] = useState()
    const [floorError, setFloorError] = useState()
    const [streetError, setStreetError] = useState()
    const [additionalDirectionsError, setAdditionalDirectionsError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!buildingName) return setBuildingNameError('Building name is required')

        if(!apartmentNumber) return setApartmentNumberError('Apartment number is required')

        if(!floor) return setFloorError('Floor is required')

        if(!street) return setStreetError('Street is required')

        const clinicData = {
            ownerId: user._id,
            name: clinic.name,
            countryCode: Number.parseInt(clinic.countryCode),
            phone: Number.parseInt(clinic.phone),
            country: clinic.country,
            city: clinic.city,
            speciality: clinic.specialities,
            address: {
                buildingName,
                apartmentNumber,
                floor,
                street,
                additionalDirections
            }
        }        

        setIsSubmit(true)
        serverRequest.post(`/v1/clinics`, clinicData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setClinicId(data.clinic._id)
            toast.success(data.message, { duration: 3000, position: 'top-right' })
            if(!user.roles.includes('OWNER')) {
                sessionStorage.setItem('user', JSON.stringify({ ...user, roles: [ ...user.roles, 'OWNER' ] }))
                dispatch(setUser({ ...user, roles: [ ...user.roles, 'OWNER' ] }))
            }
            setReload(reload + 1)
            setShowModalForm(false)
            setIsShowServiceModal(true)
            
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'address.buildingName') return setBuildingNameError(errorResponse.message)

                if(errorResponse.field === 'address.apartmentNumber') return setApartmentNumberError(errorResponse.message)

                if(errorResponse.field === 'address.floor') return setFloorError(errorResponse.message)

                if(errorResponse.field === 'address.street') return setStreetError(errorResponse.message)

                if(errorResponse.field === 'address.additionalDirections') return setAdditionalDirectionsError(errorResponse.message)


                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })
    }

    return <PageTransition>
    <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Clinic Address</h2>
            </div>
            <div className="modal-body-container">
                <form id="patient-card-form" className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>Building name or number</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={buildingName}
                        onChange={e => setBuildingName(e.target.value)}
                        onClick={e => setBuildingNameError()}
                        />
                        <span className="red">{buildingNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Apartment  number</label>
                        <input 
                        type="number" 
                        className="form-input" 
                        placeholder=""
                        value={apartmentNumber}
                        onChange={e => setApartmentNumber(e.target.value)}
                        onClick={e => setApartmentNumberError()}
                        />
                        <span className="red">{apartmentNumberError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Floor</label>
                        <input 
                        type="number" 
                        className="form-input" 
                        placeholder=""
                        value={floor}
                        onChange={e => setFloor(e.target.value)}
                        onClick={e => setFloorError()}
                        />
                        <span className="red">{floorError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Street</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        onClick={e => setStreetError()}
                        />
                        <span className="red">{streetError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Additional directions</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={additionalDirections}
                        onChange={e => setAdditionalDirections(e.target.value)}
                        onClick={e => setAdditionalDirectionsError()}
                        />
                        <span className="red">{additionalDirectionsError}</span>
                    </div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        !isSubmit ?
                        <button
                        form="patient-card-form"
                        className="normal-button white-text action-color-bg"
                        >
                            Create
                        </button>
                        :
                        <TailSpin width="25" height="25" color="#4c83ee" />
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        e.preventDefault()
                        dispatch(clearClinic())
                        setShowModalForm(false)
                    }}
                    >Close</button>
                </div>
                    </div>
                </div>
            </div>
        </PageTransition>
}

export default ClinicAddressFormModal