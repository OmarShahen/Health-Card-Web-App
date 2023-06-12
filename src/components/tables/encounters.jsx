import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import { serverRequest } from "../API/request"
import { toast } from "react-hot-toast"
import { getTime } from '../../utils/time'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import TableFunctions from "./table-functions"

const EncountersTable = ({ encounters, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(encounters)

    useEffect(() => setSearchedRows(encounters), [encounters])

    const deleteEncounter = (encounterId) => {
        serverRequest.delete(`/v1/encounters/${encounterId}`)
        .then(response => {
            const data = response.data
            setReload(reload+1)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const searchRows = (encounter, value) => {

        const doctorName = `${encounter.patient.firstName} ${encounter.patient.lastName}`.toLowerCase()
        const patientName = `${encounter.doctor.firstName} ${encounter.doctor.lastName}`.toLowerCase()

        if(doctorName.includes(value.toLowerCase())) {
            return true
        } else if(patientName.includes(value.toLowerCase())) {
            return true
        }

        return false
    }

    return <div>
            <div className="table-container body-text">
                <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Encounters</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search encounters..."
                        onChange={e => setSearchedRows(encounters.filter(row => searchRows(row, e.target.value)))}
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
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Symptoms</th>
                    <th>Diagnosis</th>
                    <th>Creation Date</th>
                    <th>Actions</th>
                </tr>
                
                {
                    searchedRows.slice(0, 20).map(row => <tr>
                        <td>{row.patient.firstName + ' ' + row.patient.lastName}</td>
                        <td>{row.doctor.firstName + ' ' + row.doctor.lastName}</td>
                        <td>{row.symptoms.length}</td>
                        <td>{row.diagnosis.length}</td>
                        <td>{format(new Date(row.createdAt), 'dd MMM yyyy') + ' ' + getTime(row.createdAt)}</td>
                        <td>
                            <div className="small-description-text actions-container">    
                                <div>
                                    <span onClick={e => navigate(`/encounters/${row._id}/view`)}><RemoveRedEyeOutlinedIcon /></span>
                                </div>
                                <div>
                                    <span onClick={e => navigate(`/encounters/${row._id}/update`)}><CreateOutlinedIcon /></span>
                                </div>
                                <div>
                                    <span onClick={e => deleteEncounter(row._id)}><DeleteOutlineOutlinedIcon /></span>
                                </div>
                            </div>
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

export default EncountersTable