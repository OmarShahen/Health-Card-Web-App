import React from 'react'
import Chart from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import '../../cards/cards.css'
import '../chart.css'


const DoughnutChart = ({ title, labels=[], data=[]  }) => {

    return <div className="card-container cards-white-bg disable-hover">
        <div className="chart-header-container">
            <span>{title}</span>
        </div>
        <Doughnut
            data={{
                labels,
                datasets: [{
                    backgroundColor: [
                        '#366DFF',
                        '#BDC5D1',
                        '#7000F2',
                        '#09A5BE'
                      ],
                    data: data,
                    borderWidth: 5,
                    hoverBorderColor: "#fff"
                }],
            }}

            />
    </div>
}

export default DoughnutChart