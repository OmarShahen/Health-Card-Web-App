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

const PatientsTable = ({ rows, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(rows)

    useEffect(() => setSearchedRows(rows), [rows])

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
            {/*<div className="table-functionality-feature body-text">
                <div className="category-search-container">
                    <span><SearchOutlinedIcon /></span>
                    <input 
                    type="search"
                    className="input"
                    placeholder="search patients..."
                    onChange={e => setSearchedRows(rows.filter(row => searchRows(row, e.target.value)))}
                    />
                </div>
                <div>
                    <span><ClassOutlinedIcon /></span>
                    <select 
                    name="appointment-types" 
                    id="appointment-types"
                    onChange={e => setSearchedRows(appointments.filter(appointment => {
                        if(appointment.status === e.target.value || e.target.value === 'ALL') {
                            return true
                        } 

                        return false
                    }))}
                    >
                        <option value="ALL">View All</option>
                        <option value="UPCOMING">Recent</option>
                    </select>
                </div>
                <div>
                    <span><CalendarMonthOutlinedIcon /></span>
                    <select 
                    name="prescriptions-dates" 
                    id="prescriptions-dates"
                    >
                        <option value="day">Today</option>
                        <option value="week">Yesterday</option>
                        <option value="month">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="month">Last 90 days</option>
                        <option value="month">All</option>
                    </select>
                </div>
                <div onClick={e => setReload(reload+1)}>
                    <span className="reload-icon-container"><CachedOutlinedIcon /></span>
                </div>
            </div>*/}
            <div className="table-columns-filters-container">
                <div>
                    <span><AddCircleOutlinedIcon /> Name</span>
                    <span><AddCircleOutlinedIcon />Card Id</span>
                    <span><AddCircleOutlinedIcon />Phone</span>
                    <span><AddCircleOutlinedIcon />Registration Date</span>
                </div>
                <span>Clear Filters</span>
            </div>
            <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>NAME</th>
                    <th>CARD ID</th>
                    <th>PHONE</th>
                    <th>GENDER</th>
                    <th>AGE</th>
                    <th>REGISTRATION DATE</th>
                    <th></th>
                </tr>
                
                {
                    searchedRows.map(row => <tr>
                        <td>
                            {`${row.firstName} ${row.lastName}`}
                        </td>
                        <td>#{row.cardId}</td>
                        <td>{`+${row.countryCode}${row.phone}`}</td>
                        <td>{row.gender}</td>
                        <td>{row.dateOfBirth ? getAge(row.dateOfBirth) : 'Not Registered'}</td>
                        <td>{format(new Date(row.createdAt), 'dd MMM yyyy')}</td>
                        <td>
                                <NavLink className="table-view-button" to={`/patients/${row._id}/medical-profile`}>
                                    View
                                </NavLink>
                        </td>
                    </tr>)
                }
            </table>
            <div className="table-footer grey-text">
                <p>{searchedRows.length} results found</p>
            </div>
        </div>
    </div>
}

export default PatientsTable