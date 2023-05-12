import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'


const SymptomsTable = ({ symptoms, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(symptoms)

    useEffect(() => setSearchedRows(symptoms), [symptoms])

    const searchRows = (symptom, value) => {

        const symptomName = `${symptom.symptom}`.toLowerCase()
        const doctorName = `${symptom.doctor.firstName} ${symptom.doctor.lastName}`.toLowerCase()

        if(symptomName.includes(value.toLowerCase())) {
            return true
        } else if(doctorName.includes(value.toLowerCase())) {
            return true
        }

        return false
    }

    return <div>
            <div className="table-container body-text">
                <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Symptoms</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search encounters..."
                        onChange={e => setSearchedRows(symptoms.filter(row => searchRows(row, e.target.value)))}
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
                    <th>Symptom</th>
                    <th>Doctor</th>
                    <th>Registration Date</th>
                </tr>
                
                {
                    searchedRows.slice(0, 20).map(row => <tr>
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