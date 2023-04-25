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

const EmergencyContactsTable = ({ contacts, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(contacts)

    useEffect(() => setSearchedRows(contacts), [contacts])

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
            
            <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>NAME</th>
                    <th>RELATIVE DEGREE</th>
                    <th>PHONE</th>
                </tr>
                
                {
                    searchedRows.map(row => <tr>
                        <td>{row.name}</td>
                        <td>{row.relation}</td>
                        <td>{`+${row.countryCode}${row.phone}`}</td>
                    </tr>)
                }
            </table>
            <div className="table-footer grey-text">
                <p>{searchedRows.length} results found</p>
            </div>
        </div>
    </div>
}

export default EmergencyContactsTable