import { useState, useEffect } from 'react'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'


const DrugsTable = ({ drugs, setDrugs, reload, setReload, isShowFilters, isRemoveAction, isUpdateAction, setTargetDrug, setTargetIndex, setShowFormModal }) => {

    const [searchedRows, setSearchedRows] = useState(drugs)

    useEffect(() => setSearchedRows(drugs), [drugs])

    const searchRows = (drug, value) => {

        const name = drug.name.toLowerCase()

        if(name.includes(value.toLowerCase())) {
            return true
        }

        return false
    }

    return <div>
        <div className="table-container">
       <div className="table-container body-text">
        {
            isShowFilters ?
                <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Drugs</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search drugs..."
                        onChange={e => setSearchedRows(drugs.filter(row => searchRows(row, e.target.value)))}
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
            :
            null
        }
            
            <table>
                <tr className="table-header-rows">
                    <th>Drug Name</th>
                    <th>Amount</th>
                    <th>Amount Unit</th>
                    <th>Frequency Number</th>
                    <th>Frequency Time</th>
                    <th>Period Number</th>
                    <th>Period Time</th>
                    { isRemoveAction ? <th>Actions</th> : null }
                </tr>
                {
                    searchedRows.slice(0, 20).map((row, index) => <tr>
                        <td>{row.name}</td>
                        <td>{row.dosage.amount}</td>
                        <td>{row.dosage.unit}</td>
                        <td>{row.frequency.number}</td>
                        <td>{row.frequency.timeUnit}</td>
                        <td>{row.duration.number}</td>
                        <td>{row.duration.timeUnit}</td>
                        { isRemoveAction ?
                        <td>
                            <div className="small-description-text actions-container">
                                {
                                    isUpdateAction ?
                                    <div>
                                        <span onClick={e => {
                                            setTargetDrug(row)
                                            setTargetIndex(index)
                                            setShowFormModal(true)
                                        }}><CreateOutlinedIcon /></span>
                                    </div>
                                    :
                                    null
                                }  
                                <div>
                                    <span 
                                    onClick={e => setDrugs(drugs.filter((drug, drugIndex) => index !== drugIndex))}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </span>
                                </div>
                            </div>
                        </td>
                            : 
                            null 
                        }
                    </tr>)
                }
            </table>
            <div className="table-footer grey-text">
                <p>{drugs.length} drugs registered</p>
            </div>
        </div>
    </div>
    </div>
}

export default DrugsTable