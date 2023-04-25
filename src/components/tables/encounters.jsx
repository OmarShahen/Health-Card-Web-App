import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import { serverRequest } from "../API/request"
import { toast } from "react-hot-toast"
import { getTime } from '../../utils/time'

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
                    <span><AddCircleOutlinedIcon />Patient name</span>
                    <span><AddCircleOutlinedIcon />Doctor name</span>
                    <span><AddCircleOutlinedIcon />Symptoms</span>
                    <span><AddCircleOutlinedIcon />Diagnosis</span>
                    <span><AddCircleOutlinedIcon />Creation date</span>
                </div>
                <span>Clear Filters</span>
            </div>
            <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>PATIENT NAME</th>
                    <th>DOCTOR NAME</th>
                    <th>SYMPTOMS</th>
                    <th>DIAGNOSIS</th>
                    <th>CREATION DATE</th>
                    <th>Actions</th>
                </tr>
                
                {
                    searchedRows.map(row => <tr>
                        <td>{row.patient.firstName + ' ' + row.patient.lastName}</td>
                        <td>{row.doctor.firstName + ' ' + row.doctor.lastName}</td>
                        <td>{row.symptoms.length}</td>
                        <td>{row.diagnosis.length}</td>
                        <td>{format(new Date(row.createdAt), 'dd MMM yyyy') + ' ' + getTime(row.createdAt)}</td>
                        <td>
                            <div className="small-description-text actions-container">
                                <MoreHorizOutlinedIcon />
                                <div className="actions-dropdown-container">
                                    <ul>
                                        <li className="width" onClick={e => deleteEncounter(row._id)}>Delete Encounter</li>
                                        <li className="width">Update Encounter</li>
                                        <li onClick={e => navigate(`/patients/${row.patient._id}/medical-profile`)} className="width">View Patient Profile</li>
                                    </ul>
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