import React from 'react'
import '../print.css'
import PrintDrugsTable from '../../tables/prints/print-drugs'
import { format } from 'date-fns'
import { getTime } from '../../../utils/time'

class EncounterDocument extends React.Component {
    render() {

        const encounter = this.props.encounter

        return <div className="print-doc-container body-text">
            <div className="print-doc-header">
                <h1>
                    PATIENT ENCOUNTER
                </h1>
            </div>
            <div className="print-doc-body">
                <div className="print-doc-info-container">
                    <div>
                        <div>
                            <strong>Series</strong>
                            <span className="grey-text">1</span>
                        </div>
                        <div>
                            <strong>Patient</strong>
                            <span className="grey-text">
                                {`${encounter.patient.firstName} ${encounter.patient.lastName}`}
                            </span>
                        </div>
                        <div>
                            <strong>Gender</strong>
                            <span className="grey-text">
                                {encounter.patient.gender}
                            </span>
                        </div>
                    </div>
                    <div></div>
                    <div>
                        <div>
                            <strong>Encounter Date</strong>
                            <span className="grey-text">
                                {format(new Date(encounter.createdAt), 'dd MMM yyyy')}
                            </span>
                        </div>
                        <div>
                            <strong>Encounter Time</strong>
                            <span className="grey-text">{getTime(encounter.createdAt)}</span>
                        </div>
                        <div>
                            <strong>Doctor</strong>
                            <span className="grey-text">
                                {`${encounter.doctor.firstName} ${encounter.doctor.lastName}`}
                            </span>
                        </div>
                        <div>
                            <strong>Speciality</strong>
                            <span className="grey-text">
                                {encounter.doctor.speciality[0]}
                            </span>
                        </div>
                    </div>
                </div>
                <br />
                <div className="print-doc-table-container">
                </div>
                <div className="print-doc-note-container">
                    <strong>Symptoms</strong>
                    <br />
                    <ul>
                        {encounter.symptoms.map(symptom => <li className="grey-text">{symptom}</li>)}
                    </ul>
                </div>
                <br />
                {
                    encounter.note ?
                    <div className="print-doc-note-container">
                        <strong>Note:</strong>
                        <br />
                        {encounter.notes.map(note => <span className="grey-text">{note}</span>)}
                    </div>
                    :
                    null
                }
            </div>
        </div>
    }
}

export default EncounterDocument