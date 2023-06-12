import React from 'react'
import '../print.css'
import PrintDrugsTable from '../../tables/prints/print-drugs'
import { format } from 'date-fns'
import { getTime } from '../../../utils/time'

class PrescriptionDocument extends React.Component {
    render() {

        const prescription = this.props.prescription

        return <div className="print-doc-container body-text">
            <div className="print-doc-header">
                <h1>
                    PATIENT PRESCRIPTION
                </h1>
            </div>
            <div className="print-doc-body">
                <div className="print-doc-info-container">
                    <div>
                        <div>
                            <strong>Series</strong>
                            <span className="grey-text">{prescription.prescriptionId}</span>
                        </div>
                        <div>
                            <strong>Patient</strong>
                            <span className="grey-text">
                                {`${prescription.patient.firstName} ${prescription.patient.lastName}`}
                            </span>
                        </div>
                        <div>
                            <strong>Gender</strong>
                            <span className="grey-text">
                                {prescription.patient.gender}
                            </span>
                        </div>
                    </div>
                    <div></div>
                    <div>
                        <div>
                            <strong>Prescription Date</strong>
                            <span className="grey-text">
                                {format(new Date(prescription.createdAt), 'dd MMM yyyy')}
                            </span>
                        </div>
                        <div>
                            <strong>Prescription Time</strong>
                            <span className="grey-text">{getTime(prescription.createdAt)}</span>
                        </div>
                        <div>
                            <strong>Doctor</strong>
                            <span className="grey-text">
                                {`${prescription.doctor.firstName} ${prescription.doctor.lastName}`}
                            </span>
                        </div>
                        <div>
                            <strong>Speciality</strong>
                            <span className="grey-text">
                                {prescription.doctor.speciality[0]}
                            </span>
                        </div>
                    </div>
                </div>
                <br />
                <div className="print-doc-table-container">
                    <PrintDrugsTable rows={prescription.medicines} />
                </div>
                <br />
                {
                    prescription.note ?
                    <div className="print-doc-note-container">
                        <strong>Note:</strong>
                        <br />
                        {prescription.notes.map(note => <span className="grey-text">{note}</span>)}
                    </div>
                    :
                    null
                }
            </div>
            <div className="application-signature-container">
                <span>Powered by <strong>Agile</strong></span>
            </div>
        </div>
    }
}

export default PrescriptionDocument