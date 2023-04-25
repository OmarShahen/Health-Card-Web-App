import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { getAge } from "../../utils/age-calculator"
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'

const SymptomsTable = ({ symptoms, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(symptoms)

    useEffect(() => setSearchedRows(symptoms), [symptoms])

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
                    <span><AddCircleOutlinedIcon />Interaction date</span>
                </div>
                <span>Clear Filters</span>
            </div>
            <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>SYMPTOM</th>
                    <th>DOCTOR</th>
                    <th>REGISTRATION DATE</th>
                </tr>
                
                {
                    searchedRows.map(row => <tr>
                        <td>{row.symptom}</td>
                        <td>{`${row.doctor.firstName} ${row.doctor.lastName}`}</td>
                        <td>{format(new Date(row.createdAt), 'dd MMM yyyy')}</td>
                    </tr>)
                }
            </table>
            <div className="table-footer grey-text">
                <p>{searchedRows.length} results found</p>
            </div>
        </div>
    </div>
}

export default SymptomsTable