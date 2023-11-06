import React from 'react'
import Chart from 'chart.js/auto'
import '../../cards/cards.css'
import '../chart.css'
import './rate-chart.css'
import { formatNumber } from '../../../utils/numbers'
import { useSelector } from 'react-redux'
import translations from '../../../i18n'


const RateChart = ({ title, ratings=[], totalReviews=0, rateNameFunction }) => {

    const lang = useSelector(state => state.lang.lang)

    const getTotalAmount = (scores) => {
        let total = 0
        for(let i=0;i<scores.length;i++) {
            total += scores[i].count
        }

        return total
    }

    const getAverageScore = (scores) => {
        let total = 0
        for(let i=0;i<scores.length;i++) {
            total += (scores[i].count * scores[i]._id)
        }

        return total / getTotalAmount(scores)
    }


    return <div className="card-container cards-white-bg disable-hover">
        <div className="chart-header-container">
            <span>{title}</span>
        </div>
        <div className="rate-chart-body-container">
            <div className="rate-chart-score-container">
                <strong>
                    {
                        ratings.length === 0 ? 
                        0 
                        : 
                        formatNumber(getAverageScore(ratings).toFixed(2))
                    }
                </strong>
                <span>- {translations[lang]['of']} {formatNumber(totalReviews)} {translations[lang]['reviews']}</span>
            </div>
            <div>
                {ratings.map(rate => <div className="rate-chart-progress-container">
                    <span>{rateNameFunction ? translations[lang][rateNameFunction(rate._id)] : rate._id}</span>
                    <progress max={'100'} value={(rate.count / totalReviews) * 100}></progress>
                    <span>{rate.count}</span>
                </div>)}
            </div>
        </div>
    </div>
}

export default RateChart