import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import Card from '../../components/cards/card';
import FiltersSection from '../../components/sections/filters/filters'
import { formatNumber } from '../../utils/numbers'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import BarChart from '../../components/charts/bar-chart/bar-chart'
import { capitalizeFirstLetter } from '../../utils/formatString'


const MarketingReportPage = ({ roles }) => {

    const navigate = useNavigate()

    const [stats, setStats] = useState({})
    const [reload, setReload] = useState(1)

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const todayDate = new Date()
    const monthDate = new Date()

    todayDate.setDate(todayDate.getDate() + 1)
    monthDate.setDate(monthDate.getDate() - 30)

    const [statsQuery, setStatsQuery] = useState({ from: monthDate, to: todayDate })

    useEffect(() => { 
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])


    useEffect(() => {
        serverRequest.get(`/v1/analytics/marketing/owners/${user._id}`, { params: statsQuery })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container">
            <PageHeader 
            pageName={translations[lang]['Marketing Report']} 
            setReload={setReload}
            reload={reload}
            /> 
            <div>
                <FiltersSection
                statsQuery={statsQuery} 
                setStatsQuery={setStatsQuery} 
                isShowUpcomingDates={false}
                defaultValue={'-30'}
                />
            </div>
            <div className="cards-3-list-wrapper margin-top-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Patients']}
                number={formatNumber(stats?.totalClinicPatients ? stats?.totalClinicPatients : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Surveys']}
                number={formatNumber(stats?.totalPatientsSurveys ? stats?.totalPatientsSurveys : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
            </div>
            <div>
                <h2>
                    {translations[lang]['Arrival Ways']}
                </h2>
                <div className="margin-top-1">
                    <BarChart 
                    title={translations[lang]['Arrival Ways']} 
                    total={stats?.totalPatientsSurveys}
                    allData={stats?.patientsArrivingMethods}
                    data={stats?.patientsArrivingMethods ? stats?.patientsArrivingMethods.map(survey => survey.count) : []} 
                    labels={stats?.patientsArrivingMethods ? stats?.patientsArrivingMethods.map(survey => capitalizeFirstLetter(survey._id)) : []} 
                    />
                </div>
            </div>
            <div>
                <h2>
                    {translations[lang]['Scheduling way']}
                </h2>
                <div className="margin-top-1">
                    <BarChart 
                    title={translations[lang]['Scheduling way']} 
                    total={stats?.totalPatientsSurveys}
                    allData={stats?.patientsSurveysSchedulingWayScores}
                    data={stats?.patientsSurveysSchedulingWayScores ? stats?.patientsSurveysSchedulingWayScores.map(survey => survey.count) : []} 
                    labels={stats?.patientsSurveysSchedulingWayScores ? stats?.patientsSurveysSchedulingWayScores.map(survey => translations[lang][capitalizeFirstLetter(survey._id)]) : []} 
                    />
                </div>
            </div>
            <div>
                <h2>
                    {translations[lang]['Demographics']}
                </h2>
                <div className="margin-top-1">
                    <BarChart 
                    title={translations[lang]['Gender']} 
                    total={stats?.totalClinicPatients}
                    allData={stats?.patientsGenderScore}
                    data={stats?.patientsGenderScore ? stats?.patientsGenderScore.map(survey => survey.count) : []} 
                    labels={stats?.patientsGenderScore ? stats?.patientsGenderScore.map(survey => translations[lang][capitalizeFirstLetter(survey._id)]) : []} 
                    />
                </div>
            <div className="margin-top-1">
                    <BarChart 
                    title={translations[lang]['Age']} 
                    total={stats?.totalClinicPatients}
                    allData={stats?.patientsAgeScore}
                    isCapitalize={false}
                    data={stats?.patientsAgeScore ? stats?.patientsAgeScore.map(survey => survey.count) : []} 
                    labels={stats?.patientsAgeScore ? stats?.patientsAgeScore.map(survey => survey._id) : []} 
                    />
                </div>
                <div className="margin-top-1">
                    <BarChart 
                    title={translations[lang]['Cities']} 
                    total={stats?.totalClinicPatients}
                    allData={stats?.patientsCitiesScore}
                    data={stats?.patientsCitiesScore ? stats?.patientsCitiesScore.map(survey => survey.count) : []} 
                    labels={stats?.patientsCitiesScore ? stats?.patientsCitiesScore.map(survey => survey._id ? translations[lang][capitalizeFirstLetter(survey._id)] : translations[lang]['Not Registered']) : []} 
                    />
                </div>
                <div className="margin-top-1">
                    <BarChart 
                    title={translations[lang]['Social Status']} 
                    total={stats?.totalClinicPatients}
                    allData={stats?.patientsSocialStatusScore}
                    data={stats?.patientsSocialStatusScore ? stats?.patientsSocialStatusScore.map(survey => survey.count) : []} 
                    labels={stats?.patientsSocialStatusScore ? stats?.patientsSocialStatusScore.map(survey => survey._id ? translations[lang][capitalizeFirstLetter(survey._id)] : translations[lang]['Not Registered']) : []} 
                    />
                </div>
            </div>
    </div>
}

export default MarketingReportPage