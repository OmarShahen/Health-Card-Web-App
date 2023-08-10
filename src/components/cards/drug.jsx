import './cards.css'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import CardDate from './components/date'
import CardTransition from '../transitions/card-transitions';
import translations from '../../i18n';
import { useSelector } from 'react-redux';

const DrugCard = ({ drug, drugs, setDrugs, isShowDelete, drugIndex }) => {

    const lang = useSelector(state => state.lang.lang)

    return <CardTransition>
    <div className="prescription-card-container body-text disable-hover">
        <div className="">
                <div className="card-drug-container">
                <div className="drug-icon-container">
                    <span className="icon-container grey-bg"><MedicationOutlinedIcon /></span>
                </div>
                <div className="drug-info-container">
                    <div className="drug-header">
                        <strong>{drug.name}</strong>
                    </div>
                    <div className="grey-text drug-description">
                        <p>
                            {`${drug.dosage.amount} ${translations[lang][drug.dosage.unit]} X ${drug.frequency.number} ${translations[lang][drug.frequency.timeUnit]} X ${drug.duration.number} ${translations[lang][drug.duration.timeUnit]}`}
                        </p>
                    </div>
                    <div className="codes-container">
                            { drug.instructions.map(instruction => <span className="status-btn grey-bg">{translations[lang][instruction]}</span>) }
                    </div>
                </div>
            </div>
            {
                isShowDelete ?
                <div className="card-drug-footer-container">
                    <button 
                    className="normal-button action-color-bg white-text"
                    onClick={e => setDrugs(drugs.filter((prescriptionDrug, index) => index !== drugIndex))}
                    >
                        {translations[lang]['Remove']}
                    </button>
                </div>
                :
                null
            }
        </div>
        { drug.createdAt ? <CardDate creationDate={drug.createdAt} /> : null }
    </div>
    </CardTransition>
}

export default DrugCard