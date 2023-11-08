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
import RateChart from '../../components/charts/rate-chart/rate-chart'
import DoughnutChart from '../../components/charts/pie-chart/pie-chart'
import { getHealthImprovementNameByNumber } from '../../utils/experience-translator'
import { formatBooleanValue } from '../../utils/formatString'
import { formatToPercentage } from '../../utils/numbers'
import { usePDF, Margin } from 'react-to-pdf'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'


const TreatmentSurveysReportPage = ({ roles }) => {

    const navigate = useNavigate()

    const { toPDF, targetRef } = usePDF({filename: `Ra'aya Treatment Report.pdf`, page: { margin: Margin.SMALL }});

    const [stats, setStats] = useState({})
    const [reload, setReload] = useState(1)

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [statsQuery, setStatsQuery] = useState()

    useEffect(() => { 
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/analytics/treatments/owners/${user._id}`, { params: statsQuery })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container" ref={targetRef}>
            <PageHeader 
            pageName={translations[lang]['Treatments Report']} 
            setReload={setReload}
            reload={reload}
            addBtnText={translations[lang]['Export Data']}
            addBtnTextIcon={<CloudDownloadOutlinedIcon />}
            addBtnFunction={toPDF}
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
                number={formatNumber(stats.totalClinicPatients ? stats.totalClinicPatients : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Surveys']}
                number={formatNumber(stats.totalTreatmentSurveys ? stats.totalTreatmentSurveys : 0)}
                iconColor={'#5C60F5'}
                isShowStats={true}
                />
            </div>
            <div className="margin-top-1">                
                <RateChart 
                title={translations[lang]['Health Improvements']} 
                ratings={stats.treatmentsSurveysImprovementScores} 
                rateNameFunction={getHealthImprovementNameByNumber}
                totalReviews={stats.totalTreatmentSurveys} 
                />
            </div>
            <div>
                <h2>
                    {translations[lang]['Side Effects & New Symptoms']}
                </h2>
                <div className="cards-3-list-wrapper margin-top-1">
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Side Effects Occured']} 
                        labels={
                            stats?.treatmentsSurveysExperiencedSideEffectsScores 
                            ? stats?.treatmentsSurveysExperiencedSideEffectsScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysExperiencedSideEffectsScores 
                            ? stats?.treatmentsSurveysExperiencedSideEffectsScores.map(survey => survey.count) 
                            : 
                            []
                        }
                         />
                    </div>
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['New Symptoms Occured']} 
                        labels={
                            stats?.treatmentsSurveysNewSymptomsOccuredScores 
                            ? stats?.treatmentsSurveysNewSymptomsOccuredScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysNewSymptomsOccuredScores 
                            ? stats?.treatmentsSurveysNewSymptomsOccuredScores.map(survey => survey.count) 
                            : 
                            []
                        }
                         />
                    </div>
                </div>
            </div> 
            <div>
                <h2>
                    {translations[lang]['Medication']}
                </h2>
                <div className="cards-3-list-wrapper margin-top-1">
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Medication Took As Prescribed']} 
                        labels={
                            stats?.treatmentsSurveysMedicationTookAsPrescribedScores 
                            ? stats?.treatmentsSurveysMedicationTookAsPrescribedScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysMedicationTookAsPrescribedScores 
                            ? stats?.treatmentsSurveysMedicationTookAsPrescribedScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                    <div>
                        <DoughnutChart title={translations[lang]['Challenges Obtaining']}
                        labels={
                            stats?.treatmentsSurveysObtainingMedicationScores 
                            ? stats?.treatmentsSurveysObtainingMedicationScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysObtainingMedicationScores 
                            ? stats?.treatmentsSurveysObtainingMedicationScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                    <div>
                        <DoughnutChart title={translations[lang]['Challenges Taking']}
                        labels={
                            stats?.treatmentsSurveysTakingMedicationScores 
                            ? stats?.treatmentsSurveysTakingMedicationScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysTakingMedicationScores 
                            ? stats?.treatmentsSurveysTakingMedicationScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                </div>
                <div className="cards-3-list-wrapper margin-top-1">
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Problem Remebring']} 
                        labels={
                            stats?.treatmentsSurveysProblemRemeberingScores 
                            ? stats?.treatmentsSurveysProblemRemeberingScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysProblemRemeberingScores 
                            ? stats?.treatmentsSurveysProblemRemeberingScores.map(survey => survey.count) 
                            : 
                            []
                        } 
                        />
                    </div>
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Taking Outter Medication']}
                        labels={
                            stats?.treatmentsSurveysTakingOutterMedicationScores 
                            ? stats?.treatmentsSurveysTakingOutterMedicationScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysTakingOutterMedicationScores 
                            ? stats?.treatmentsSurveysTakingOutterMedicationScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                    <div>
                        <DoughnutChart 
                        title={translations[lang]['Dosages Missed']} 
                        labels={
                            stats?.treatmentsSurveysDosageMissedScores 
                            ? stats?.treatmentsSurveysDosageMissedScores.map(survey => `${translations[lang][formatBooleanValue(survey._id)]} (${formatToPercentage(survey.count, stats.totalTreatmentSurveys)}%)`) 
                            : 
                            []
                        }
                        data={
                            stats?.treatmentsSurveysDosageMissedScores 
                            ? stats?.treatmentsSurveysDosageMissedScores.map(survey => survey.count) 
                            : 
                            []
                        }
                        />
                    </div>
                </div>
            </div>
    </div>
}

export default TreatmentSurveysReportPage