import './print-table.css'

const PrintDrugsTable = ({ rows }) => {

    return <div>
        <div className="print-table-container">
       <div className="print-table-container body-text">
            <table>
                <tr className="print-table-header-rows">
                    <th>Drug Name</th>
                    <th>Amount</th>
                    <th>Amount Unit</th>
                    <th>Frequency Number</th>
                    <th>Frequency Time</th>
                    <th>Period Number</th>
                    <th>Period Time</th>
                </tr>
                {
                    rows.map((row, index) => <tr>
                        <td>{row.name}</td>
                        <td>{row.dosage.amount}</td>
                        <td>{row.dosage.unit}</td>
                        <td>{row.frequency.number}</td>
                        <td>{row.frequency.timeUnit}</td>
                        <td>{row.duration.number}</td>
                        <td>{row.duration.timeUnit}</td>
                    </tr>)
                }
            </table>
        </div>
    </div>
    </div>
}

export default PrintDrugsTable