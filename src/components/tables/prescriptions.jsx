import { useState, useEffect } from 'react'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { format } from 'date-fns'
import { getTime } from '../../utils/time'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'


const PrescriptionsTable = ({ prescriptions, setReload, reload }) => {

    const navigate = useNavigate()
    const [searchedRows, setSearchedRows] = useState(prescriptions)

    useEffect(() => setSearchedRows(prescriptions), [prescriptions])

    const deletePrescription = (prescriptionId) => {

        serverRequest.delete(`/v1/prescriptions/${prescriptionId}`)
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

    const searchRows = (prescription, value) => {

        const patientName = `${prescription.patient.firstName} ${prescription.patient.lastName}`.toLowerCase()
        const doctorName = `${prescription.doctor.firstName} ${prescription.doctor.lastName}`.toLowerCase()

        if(patientName.includes(value.toLowerCase())) {
            return true
        } else if(doctorName.includes(value.toLowerCase())) {
            return true
        }

        return false
    }

    return <div>
        <div className="table-container">
       <div className="table-container body-text">
            <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Prescriptions</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search prescriptions..."
                        onChange={e => setSearchedRows(prescriptions.filter(row => searchRows(row, e.target.value)))}
                        />
                    </div>
                    <div className="refresh-button-container">
                        <button
                        onClick={e => setReload(reload+1)} 
                        className="normal-button action-color-bg white-text icon-button"
                        >
                            <RefreshIcon />
                            Refresh
                        </button>
                    </div>
                </div>
            <table>
                <tr className="table-header-rows">
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>No. Of Drugs</th>
                    <th>Creation Date</th>
                    <th>Actions</th>
                </tr>
                {
                    searchedRows.slice(0, 20).map((row, index) => <tr>
                        <td>{row.patient.firstName + ' ' + row.patient.lastName}</td>
                        <td>{row.doctor.firstName + ' ' + row.doctor.lastName}</td>
                        <td>{row.medicines.length}</td>
                        <td>{format(new Date(row.createdAt), 'dd MMM yyyy') + ' ' + getTime(row.createdAt)}</td>
                        <td>
                            <div className="small-description-text actions-container">    
                                <div>
                                    <span onClick={e => navigate(`/prescriptions/${row._id}/view`)}><RemoveRedEyeOutlinedIcon /></span>
                                </div>
                                <div>
                                    <span onClick={e => navigate(`/prescriptions/${row._id}/update`)}><CreateOutlinedIcon /></span>
                                </div>
                                <div>
                                    <span onClick={e => deletePrescription(row._id)}><DeleteOutlineOutlinedIcon /></span>
                                </div>
                            </div>
                        </td>
                    </tr>)
                }
            </table>
            <div className="table-footer grey-text">
                <p>{prescriptions.length} results found</p>
            </div>
        </div>
    </div>
    </div>
}

export default PrescriptionsTable