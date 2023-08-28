import './print-table.css'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'
import { capitalizeFirstLetter } from '../../../utils/formatString'

const PrintDrugsTable = ({ rows }) => {

    const lang = useSelector(state => state.lang.lang)

    return <div>
        <div className="print-table-container">
       <div className="print-table-container body-text">
            <table>
                <tr className="print-table-header-rows">
                    <th>{translations[lang]['Drug Name']}</th>
                    <th>{translations[lang]['Amount']}</th>
                    <th>{translations[lang]['Frequency']}</th>
                    <th>{translations[lang]['Period Number']}</th>
                    <th>{translations[lang]['Dosage Times']}</th>
                </tr>
                {
                    rows.map((row, index) => <tr>
                        <td>{row.name}</td>
                        <td>{`${row.dosage.amount} ${translations[lang][row.dosage.unit]}`}</td>
                        <td>{`${row.frequency.number} ${translations[lang][capitalizeFirstLetter(row.frequency.timeUnit)]}`}</td>
                        <td>{`${row.duration.number} ${translations[lang][capitalizeFirstLetter(row.duration.timeUnit)]}`}</td>
                        <td>
                        { row.instructions
                        .map((instruction, index) => <span>{translations[lang][instruction]}{row.instructions.length === index + 1 ? null : ','} </span>) }
                        </td>
                    </tr>)
                }
            </table>
        </div>
    </div>
    </div>
}

export default PrintDrugsTable