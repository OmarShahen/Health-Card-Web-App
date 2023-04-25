import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import { format } from 'date-fns'
import { getTime } from '../../utils/time'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'

const PrescriptionsTable = ({ prescriptions, setReload, reload }) => {

    const navigate = useNavigate()

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

    return <div>
        <div className="table-columns-filters-container">
            <div>
                <span><AddCircleOutlinedIcon />Prescription ID</span>
                <span><AddCircleOutlinedIcon />Patient name</span>
                <span><AddCircleOutlinedIcon /> Doctor name</span>
                <span><AddCircleOutlinedIcon /> Creation Date</span>
            </div>
            <span>Clear Filters</span>
        </div>
        <div className="table-container">
       <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>PRESCRIPTION ID</th>
                    <th>PATIENT NAME</th>
                    <th>DOCTOR NAME</th>
                    <th>NO. OF DRUGS</th>
                    <th>CREATED</th>
                    <th>Actions</th>
                </tr>
                {
                    prescriptions.map((row, index) => <tr>
                        <td>{index+1}</td>
                        <td>{row.patient.firstName + ' ' + row.patient.lastName}</td>
                        <td>{row.doctor.firstName + ' ' + row.doctor.lastName}</td>
                        <td>{row.medicines.length}</td>
                        <td>{format(new Date(row.createdAt), 'dd MMM yyyy') + ' ' + getTime(row.createdAt)}</td>
                        <td>
                            <div className="small-description-text actions-container">
                                <MoreHorizOutlinedIcon />
                                <div className="actions-dropdown-container">
                                    <ul>
                                        <li className="width" onClick={e => deletePrescription(row._id)}>Delete prescription</li>
                                        <li className="width">Update prescription</li>
                                        <li 
                                        onClick={e => navigate(`/patients/${row.patient._id}/medical-profile`)}
                                        className="width">
                                            View patient profile
                                        </li>
                                    </ul>
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