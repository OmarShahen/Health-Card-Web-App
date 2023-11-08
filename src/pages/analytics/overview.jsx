import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import Card from '../../components/cards/card';
import { formatNumber } from '../../utils/numbers'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import LineChart from '../../components/charts/line-chart/line-chart'
import RateChart from '../../components/charts/rate-chart/rate-chart'
import { getExperienceNameByNumber, getHealthImprovementNameByNumber } from '../../utils/experience-translator'
import FiltersSection from '../../components/sections/filters/filters'
import { usePDF, Margin } from 'react-to-pdf'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'


const AnalyticsOverviewPage = ({ roles }) => {

    const navigate = useNavigate()

    const { toPDF, targetRef } = usePDF({filename: `Ra'aya Overview Report.pdf`, page: { margin: Margin.SMALL }});

    const [stats, setStats] = useState({})
    const [reload, setReload] = useState(1)
    const [isHideBackBtn, setIsHideBackBtn] = useState(false)

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [statsQuery, setStatsQuery] = useState()

    useEffect(() => { 
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/analytics/overview/owners/${user._id}`, { params: statsQuery })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
        })

    }, [reload, statsQuery])


    return <div className="page-container" ref={targetRef}>
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]['Overview']} 
            setReload={setReload}
            reload={reload}
            addBtnText={translations[lang]['Export Data']}
            addBtnTextIcon={<CloudDownloadOutlinedIcon />}
            addBtnFunction={toPDF}
            isHideBackButton={isHideBackBtn}
            /> 
            <div>
                <FiltersSection 
                statsQuery={statsQuery} 
                setStatsQuery={setStatsQuery} 
                isShowUpcomingDates={false}
                defaultValue={'LIFETIME'}
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
                number={formatNumber(stats?.totalSurveys ? stats?.totalSurveys : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Impressions Surveys']}
                number={formatNumber(stats?.totalPatientsSurveys ? stats?.totalPatientsSurveys : 0)}
                iconColor={'#FF8C00'}
                isShowStats={true}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Treatments Surveys']}
                number={formatNumber(stats?.totalTreatmentsSurveys ? stats?.totalTreatmentsSurveys : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Calls']}
                number={formatNumber(stats?.totalCalls ? stats?.totalCalls : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
            </div>
            <div className="cards-2-list-wrapper-gap margin-top-1">
                <RateChart 
                title={translations[lang]['Impressions']} 
                ratings={stats?.patientsSurveysOverallExperienceScores}
                totalReviews={stats?.totalPatientsSurveys}
                rateNameFunction={getExperienceNameByNumber}
                />
                <RateChart 
                title={translations[lang]['Treatment']} 
                ratings={stats?.treatmentsSurveysImprovementScores}
                totalReviews={stats?.totalTreatmentsSurveys}
                rateNameFunction={getHealthImprovementNameByNumber}
                />
            </div>
            <div className="margin-top-1">
                <LineChart 
                title={translations[lang]["Patients Growth"]} 
                data={stats?.clinicPatientsGrowth ? stats?.clinicPatientsGrowth.map(patient => patient.count) : []} 
                labels={stats?.clinicPatientsGrowth ? stats?.clinicPatientsGrowth.map(patient => patient._id) : []} 
                />
            </div>
        </div> 
    </div>
}

export default AnalyticsOverviewPage