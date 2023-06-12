import { useEffect, useState } from 'react'
import { serverRequest } from '../API/request'
import SearchIcon from '@mui/icons-material/Search'
import './input.css'
import DocumentsSizes from '../sections/sizes/documents-size'
import { useSelector } from 'react-redux'

const SearchInput = ({ rows, setRows, searchRows, isCustomClincis, customClinics=[], isHideClinics }) => { 

    const user = useSelector(state => state.user.user)
    const [clinics, setClinics] = useState(customClinics)

    useEffect(() => {
        if(isCustomClincis) {
            setClinics(customClinics)
        }
    }, [customClinics])

    useEffect(() => {

        if(isCustomClincis || isHideClinics) {
            return
        }

        serverRequest.get(`/v1/clinics/doctors/${user._id}`)
        .then(response => {
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }, [])

    return <div className="cards-3-list-wrapper">
        <div className="search-field-input-container">
            <span>
                <SearchIcon />
            </span>
            <input 
            type="text" 
            className="form-input"
            placeholder="Search..."
            onChange={e => setRows(rows.filter(row => searchRows(row, e.target.value)))}
            />
        </div>
        {
            isHideClinics ?
            <div></div>
            :
            <div className="form-input-container">
                <select
                onChange={e => {
                    if(e.target.value === 'ALL') {
                        setRows(rows)
                        return
                    }

                    setRows(rows.filter(row => row.clinicId === e.target.value))
                }}
                >
                    <option selected disabled>Select clinic</option>
                    <option value={'ALL'}>All</option>
                    {clinics.map(clinic => <option value={clinic?.clinic?._id}>{clinic?.clinic?.name}</option>)}
                </select>
            </div>
        }      
        <div className="search-input-result-size-container">
            <DocumentsSizes size={rows.length} />
        </div>
    </div>
}

export default SearchInput