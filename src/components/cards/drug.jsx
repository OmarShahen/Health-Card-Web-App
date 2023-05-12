import './cards.css'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import CardDate from './components/date'


const DrugCard = ({ drug, drugs, setDrugs, isShowDelete, drugIndex }) => {

    return <div className="prescription-card-container body-text disable-hover">
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
                            {`${drug.dosage.amount} ${drug.dosage.unit} X ${drug.frequency.number} ${drug.frequency.timeUnit} X ${drug.duration.number} ${drug.duration.timeUnit}`}
                        </p>
                    </div>
                    <div className="codes-container">
                            { drug.instructions.map(instruction => <span className="status-btn grey-bg">{instruction}</span>) }
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
                        Remove
                    </button>
                </div>
                :
                null
            }
        </div>
        <CardDate date={drug.createdAt} />
    </div>
}

export default DrugCard