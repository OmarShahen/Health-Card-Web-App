import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'


const DrugsTable = ({ drugs, setDrugs, isShowFilters, isRemoveAction }) => {

    return <div>
        {
            !isShowFilters ?
            null
            :
            <div className="table-columns-filters-container">
                <div>
                    <span><AddCircleOutlinedIcon />Drug name</span>
                    <span><AddCircleOutlinedIcon />Amount</span>
                    <span><AddCircleOutlinedIcon />Frequency</span>
                    <span><AddCircleOutlinedIcon />Period</span>
                </div>
                <span>Clear Filters</span>
            </div>
        }
        <div className="table-container">
       <div className="table-container body-text">
            <table>
                <tr className="table-header-rows">
                    <th>DRUG NAME</th>
                    <th>AMOUNT</th>
                    <th>AMOUNT UNIT</th>
                    <th>FREQUENCY NUMBER</th>
                    <th>FREQUENCY TIME</th>
                    <th>PERIOD NUMBER</th>
                    <th>PERIOD TIME</th>
                    { isRemoveAction ? <th></th> : null }
                </tr>
                {
                    drugs.map((row, index) => <tr>
                        <td>{row.name}</td>
                        <td>{row.dosage.amount}</td>
                        <td>{row.dosage.unit}</td>
                        <td>{row.frequency.number}</td>
                        <td>{row.frequency.timeUnit}</td>
                        <td>{row.duration.number}</td>
                        <td>{row.duration.timeUnit}</td>
                        { isRemoveAction ?
                        <td>
                            <span 
                            className="table-view-button"
                            onClick={e => setDrugs(drugs.filter((drug, drugIndex) => index !== drugIndex))}
                            >
                                remove
                            </span>
                        </td>
                            : 
                            null 
                        }
                    </tr>)
                }
            </table>
            <div className="table-footer grey-text">
                <p>{drugs.length} results found</p>
            </div>
        </div>
    </div>
    </div>
}

export default DrugsTable