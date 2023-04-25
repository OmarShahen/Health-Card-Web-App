import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'

const DoctorsTable = ({ doctors, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(doctors)

    useEffect(() => setSearchedRows(doctors), [doctors])

    const searchRows = (patient, value) => {

        const name = `${patient.firstName} ${patient.lastName}`.toLowerCase()
        const phone = `${patient.countryCode}${patient.phone}`
        const cardId = `${patient.cardId}`

        if(name.includes(value.toLowerCase())) {
            return true
        } else if(phone.includes(value)) {
            return true
        } else if(cardId.includes(value)) {
            return true
        }

        return false
    }

    return <div>
            <div className="table-columns-filters-container">
                <div>
                    <span><AddCircleOutlinedIcon />Name</span>
                    <span><AddCircleOutlinedIcon />Phone</span>
                    <span><AddCircleOutlinedIcon />Email</span>
                    <span><AddCircleOutlinedIcon />Speciality</span>
                </div>
                <span>Clear Filters</span>
            </div>
            <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>NAME</th>
                    <th>PHONE</th>
                    <th>EMAIL</th>
                    <th>SPECIALITY</th>
                </tr>
                
                {
                    searchedRows.map(row => <tr>
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