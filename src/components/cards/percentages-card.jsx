import React from 'react'
import translations from '../../i18n'
import { formatNumber, formatMoney } from '../../utils/numbers'
import './chart-card.css'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { useSelector } from 'react-redux'

const PercentagesCard = ({ category, percentages, total, isCapitalize=true }) => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="chart-table-wrapper">
        <table className="chart-table-container">
        <tr>
            <th>{category}</th>
            <th>{translations[lang]['Total']}</th>
            <th>{translations[lang]['Percentages']}</th>
        </tr>
        {
            percentages.map(row => <tr>
                <td>{isCapitalize ? row._id ? translations[lang][capitalizeFirstLetter(row._id)] : translations[lang]['Not Registered'] : row._id }</td>
                <td>{formatNumber(row.count)}</td>
                <td>{((row.count / total) * 100).toFixed(2)}%</td>
            </tr>)
        }
        
        </table>
    </div>
}

export default PercentagesCard