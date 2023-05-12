import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'



const DoctorsTable = ({ doctors, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(doctors)

    useEffect(() => setSearchedRows(doctors), [doctors])

    const searchRows = (doctor, value) => {

        const name = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
        const phone = `${doctor.countryCode}${doctor.phone}`
        const email = `${doctor.email}`

        if(name.includes(value.toLowerCase())) {
            return true
        } else if(phone.includes(value)) {
            return true
        } else if(email.includes(value)) {
            return true
        }

        return false
    }

    return <div>
            <div className="table-container body-text">
                <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Doctors</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search doctors..."
                        onChange={e => setSearchedRows(doctors.filter(row => searchRows(row, e.target.value)))}
                        />
                    </div>
                    <div className="refresh-button-container">
                        <button
                        onClick={e => setReload(reload+1)}
                        className="normal-button action-color-bg white-text icon-button">
                            <RefreshIcon />
                            Refresh
                        </button>
                    </div>
                </div>
            <table>
                <tr className="table-header-rows">
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Speciality</th>
                </tr>
                
                {
                    searchedRows.slice(0, 20).map(row => <tr>
                        <td>{row.firstName + ' ' + row.lastName}</td>
                        <td>{`+${row.countryCode}${row.phone}`}</td>
                        <td>{row.email}</td>
                        <td>{row.speciality[0]}</td>
                    </tr>)
                }
            </table>
            <div className="table-footer grey-text">
                <p>{searchedRows.length} results found</p>
            </div>
        </div>
    </div>
}

export default DoctorsTable