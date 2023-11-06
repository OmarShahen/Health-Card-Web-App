import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import Card from '../../components/cards/card';
import FiltersSection from '../../components/sections/filters/filters'
import { formatNumber, formatToPercentage } from '../../utils/numbers'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import RateChart from '../../components/charts/rate-chart/rate-chart'
import DoughnutChart from '../../components/charts/pie-chart/pie-chart'
import BarChart from '../../components/charts/bar-chart/bar-chart'
import { getExperienceNameByNumber, getSatisfactionNameByNumber, getExplanationNameByNumber } from '../../utils/experience-translator'
import { capitalizeFirstLetter, formatBooleanValue } from '../../utils/formatString'


const ImpressionsSurveysReportPage = ({ roles }) => {

    const navigate = useNavigate()

    const [stats, setStats] = useState({})
    const [reload, setReload] = useState(1)

    const [totalDelays, setTotalDelays] = useState(0)

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

    const getTotalDelays = (list) => {
        let total = 0
        for(let i=0;i<list.length;i++) {
            total += list[i].count
        }

        return total
    }

    useEffect(() => {
        serverRequest.get(`/v1/analytics/impressions/owners/${user._id}`, { params: statsQuery })
        .then(response => {
            setStats(response.data)
            setTotalDelays(getTotalDelays(response.data.patientsSurveysWaitingDelayInformedScores))
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container">
            <PageHeader 
            pageName={translations[lang]['Impressions Report']} 
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
                number={formatNumber(stats.totalClinicPatients ? stats.totalClinicPatients : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Surveys']}
                number={formatNumber(stats.totalPatientsSurveys ? stats.totalPatientsSurveys : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
            </div>
            <div className="margin-top-1">
                    <RateChart 
                    title={translations[lang]['Overall Experience']} 
                    ratings={stats.patientsSurveysOverallExperienceScores} 
                    rateNameFunction={getExperienceNameByNumber}
                    totalReviews={stats.totalPatientsSurveys} 
                    />
                </div>
            <div>
                <h2>
                    {translations[lang]['Appointment']}
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
                <div className="cards-3-list-wrapper margin-top-1">
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Convenient Time Slot']} 
                        labels={
                            stats?.patientsSurveysTimeSlotScores 
                            ? stats?.patientsSurveysTimeSlotScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalPatientsSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.patientsSurveysTimeSlotScores 
                            ? stats?.patientsSurveysTimeSlotScores.map(survey => survey.count) 
                            : 
                            []
                        }
                         />
                    </div>
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Scheduling Ease']} 
                        labels={
                            stats?.patientsSurveysSchedulingEaseScores 
                            ? stats?.patientsSurveysSchedulingEaseScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalPatientsSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.patientsSurveysSchedulingEaseScores 
                            ? stats?.patientsSurveysSchedulingEaseScores.map(survey => survey.count) 
                            : 
                            []
                        } 
                        />
                    </div>
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Reminder Sent']} 
                        labels={
                            stats?.patientsSurveysRemindersSentScores 
                            ? stats?.patientsSurveysRemindersSentScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalPatientsSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.patientsSurveysRemindersSentScores 
                            ? stats?.patientsSurveysRemindersSentScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                </div>
            </div>  
            <div>
                <h2>
                    {translations[lang]['Waiting']}
                </h2>
                <div className="margin-top-1">
                    <RateChart 
                    title={translations[lang]['Satisfaction']} 
                    rateNameFunction={getSatisfactionNameByNumber}
                    ratings={stats?.patientsSurveysWaitingSatisfactionScores ? stats?.patientsSurveysWaitingSatisfactionScores : []} 
                    totalReviews={stats.totalPatientsSurveys ? stats?.totalPatientsSurveys : 0} 
                    />
                </div>
                <div className="cards-3-list-wrapper margin-top-1">
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Delay Occured']} 
                        labels={
                            stats?.patientsSurveysWaitingDelayHappenScores 
                            ? stats?.patientsSurveysWaitingDelayHappenScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalPatientsSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.patientsSurveysWaitingDelayHappenScores 
                            ? stats?.patientsSurveysWaitingDelayHappenScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Delay Informed']} 
                        labels={
                            stats?.patientsSurveysWaitingDelayInformedScores 
                            ? stats?.patientsSurveysWaitingDelayInformedScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, totalDelays)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.patientsSurveysWaitingDelayInformedScores 
                            ? stats?.patientsSurveysWaitingDelayInformedScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                </div>
            </div>
            <h2>
                {translations[lang]['Environment']}
            </h2>
            <div className="cards-3-list-wrapper margin-top-1">
                <div>
                    <DoughnutChart 
                    title={translations[lang]['Clean']} 
                    labels={
                        stats?.patientsSurveysCleanScores 
                        ? stats?.patientsSurveysCleanScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats?.totalPatientsSurveys)}%)`) 
                        : 
                        []
                    }
                    data={
                        stats?.patientsSurveysCleanScores 
                        ? stats?.patientsSurveysCleanScores.map(survey => survey.count) 
                        : 
                        []
                    }
                    />
                </div>
                <div>
                    <DoughnutChart 
                    title={translations[lang]['Comfortable']} 
                    labels={
                        stats?.patientsSurveysComfortableScores 
                        ? stats?.patientsSurveysComfortableScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats?.totalPatientsSurveys)}%)`) 
                        : 
                        []
                    }
                    data={
                        stats?.patientsSurveysComfortableScores 
                        ? stats?.patientsSurveysComfortableScores.map(survey => survey.count) 
                        : 
                        []
                    } 
                    />
                </div>
            </div>
            <h2>
                {translations[lang]['Staff']}
            </h2>
            <div className="cards-3-list-wrapper margin-top-1">
                <div>
                    <DoughnutChart 
                    title={translations[lang]['Friendly']} 
                    labels={
                        stats?.patientsSurveysStaffFriendlyScores 
                        ? stats?.patientsSurveysStaffFriendlyScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats?.totalPatientsSurveys)}%)`) 
                        : 
                        []
                    }
                    data={
                        stats?.patientsSurveysStaffFriendlyScores 
                        ? stats?.patientsSurveysStaffFriendlyScores.map(survey => survey.count) 
                        : 
                        []
                    }
                    />
                </div>
                <div>
                    <DoughnutChart 
                    title={translations[lang]['Responsive']} 
                    labels={
                        stats?.patientsSurveysStaffResponsiveScores 
                        ? stats?.patientsSurveysStaffResponsiveScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats?.totalPatientsSurveys)}%)`) 
                        : 
                        []
                    }
                    data={
                        stats?.patientsSurveysStaffResponsiveScores 
                        ? stats?.patientsSurveysStaffResponsiveScores.map(survey => survey.count) 
                        : 
                        []
                    }
                    />
                </div>
            </div>
            <h2>
                {translations[lang]['Doctor']}
            </h2>
            <div className="cards-2-list-wrapper-gap margin-top-1">
                    <RateChart 
                    title={translations[lang]['Attentiveness']} 
                    rateNameFunction={getExperienceNameByNumber} 
                    ratings={stats?.patientsSurveysDoctorAttentionScores ? stats?.patientsSurveysDoctorAttentionScores : []} 
                    totalReviews={stats?.totalPatientsSurveys} 
                    />
                    <RateChart 
                    title={translations[lang]['Treatment Explanation']}
                    rateNameFunction={getExplanationNameByNumber} 
                    ratings={stats?.patientsSurveysTreatmentExplanationScores ? stats?.patientsSurveysTreatmentExplanationScores : []} 
                    totalReviews={stats?.totalPatientsSurveys} 
                    />
                </div>
            <div className="cards-3-list-wrapper margin-top-1">
                <div>
                    <DoughnutChart 
                    title={translations[lang]['Issues Addressed Adequately']} 
                    labels={
                        stats?.patientsSurveysSymptomsAddressedScores 
                        ? stats?.patientsSurveysSymptomsAddressedScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats?.totalPatientsSurveys)}%)`) 
                        : 
                        []
                    }
                    data={
                        stats?.patientsSurveysSymptomsAddressedScores 
                        ? stats?.patientsSurveysSymptomsAddressedScores.map(survey => survey.count) 
                        : 
                        []
                    }
                    />
                </div>
                <div>
                    <DoughnutChart 
                    title={translations[lang]['Medical History Asked']} 
                    labels={
                        stats?.patientsSurveysMedicalHistoryScores 
                        ? stats?.patientsSurveysMedicalHistoryScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats?.totalPatientsSurveys)}%)`) 
                        : 
                        []
                    }
                    data={
                        stats?.patientsSurveysMedicalHistoryScores 
                        ? stats?.patientsSurveysMedicalHistoryScores.map(survey => survey.count) 
                        : 
                        []
                    }
                    />
                </div>
            </div>
    </div>
}

export default ImpressionsSurveysReportPage