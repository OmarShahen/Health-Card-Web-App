import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { serverRequest } from "../API/request"
import { toast } from "react-hot-toast"


const EmergencyContactsTable = ({ contacts, setReload, reload, setUpdateContact, setIsShowForm, setFormMode }) => {

    const navigate = useNavigate()
    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const [searchedRows, setSearchedRows] = useState(contacts)

    useEffect(() => setSearchedRows(contacts), [contacts])

    const searchRows = (contact, value) => {

        const name = `${contact.name}`.toLowerCase()
        const phone = `${contact.countryCode}${contact.phone}`
        const relation = `${contact.relation}`.toLowerCase()

        if(name.includes(value.toLowerCase())) {
            return true
        } else if(phone.includes(value)) {
            return true
        } else if(relation.includes(value.toLowerCase())) {
            return true
        }

        return false
    }

    const deleteContact = (contact) => {

        serverRequest.delete(`/v1/patients/${patientId}/emergency-contacts/country-codes/${contact.countryCode}/phones/${contact.phone}`)
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
            <div className="table-container body-text">
                <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Emergency Contacts</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search contacts..."
                        onChange={e => setSearchedRows(contacts.filter(row => searchRows(row, e.target.value)))}
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
                    <th>Relative</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                
                {
                    searchedRows.slice(0, 20).map(row => <tr>
                        <td>{row.name}</td>
                        <td>{row.relation}</td>
                        <td>{`+${row.countryCode}${row.phone}`}</td>
                        <td>
                            <div className="small-description-text actions-container">    
                                <div>
                                    <span
                                    onClick={e => {
                                        setUpdateContact(row)
                                        setFormMode('EDITE')
                                        setIsShowForm(true)
                                    }}
                                    ><CreateOutlinedIcon /></span>
                                </div>
                                <div>
                                    <span onClick={e => deleteContact(row)}><DeleteOutlineOutlinedIcon /></span>
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

export default EmergencyContactsTable