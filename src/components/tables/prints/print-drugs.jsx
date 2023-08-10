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
                    <th>{translations[lang]['Amount Unit']}</th>
                    <th>{translations[lang]['Frequency Number']}</th>
                    <th>{translations[lang]['Frequency Time']}</th>
                    <th>{translations[lang]['Period Number']}</th>
                    <th>{translations[lang]['Period Time']}</th>
                </tr>
                {
                    rows.map((row, index) => <tr>
                        <td>{row.name}</td>
                        <td>{row.dosage.amount}</td>
                        <td>{translations[lang][row.dosage.unit]}</td>
                        <td>{row.frequency.number}</td>
                        <td>{translations[lang][capitalizeFirstLetter(row.frequency.timeUnit)]}</td>
                        <td>{row.duration.number}</td>
                        <td>{translations[lang][capitalizeFirstLetter(row.duration.timeUnit)]}</td>
                    </tr>)
                }
            </table>
        </div>
    </div>
    </div>
}

export default PrintDrugsTable