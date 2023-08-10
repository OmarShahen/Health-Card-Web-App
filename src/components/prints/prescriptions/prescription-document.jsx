import React from 'react'
import '../print.css'
import PrintDrugsTable from '../../tables/prints/print-drugs'
import { format } from 'date-fns'
import { getTime } from '../../../utils/time'
import { capitalizeFirstLetter } from '../../../utils/formatString'
import translations from '../../../i18n'

class PrescriptionDocument extends React.Component {
    render() {

        const prescription = this.props.prescription
        const lang = this.props.lang

        return <div className="print-doc-container body-text">
            <div className="print-doc-header">
                <h1>
                    {translations[lang]['PATIENT PRESCRIPTION']}
                </h1>
            </div>
            <div className="print-doc-body">
                <div className="print-doc-info-container">
                    <div>
                        <div>
                            <strong>{translations[lang]['Series']}</strong>
                            <span className="grey-text">{prescription.prescriptionId}</span>
                        </div>
                        <div>
                            <strong>{translations[lang]['Patient']}</strong>
                            <span className="grey-text">
                                {`${prescription.patient.firstName} ${prescription.patient.lastName}`}
                            </span>
                        </div>
                        <div>
                            <strong>{translations[lang]['Gender']}</strong>
                            <span className="grey-text">
                                {translations[lang][capitalizeFirstLetter(prescription.patient.gender)]}
                            </span>
                        </div>
                    </div>
                    <div></div>
                    <div>
                        <div>
                            <strong>{translations[lang]['Prescription Date']}</strong>
                            <span className="grey-text">
                                {format(new Date(prescription.createdAt), lang === 'en' ? 'dd MMM yyyy' : 'dd/MM/yyyy')}
                            </span>
                        </div>
                        <div>
                            <strong>{translations[lang]['Prescription Time']}</strong>
                            <span className="grey-text">{getTime(prescription.createdAt)}</span>
                        </div>
                        <div>
                            <strong>{translations[lang]['Doctor']}</strong>
                            <span className="grey-text">
                                {`${prescription.doctor.firstName} ${prescription.doctor.lastName}`}
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
                    prescription.notes && prescription.notes.length !== 0 ?
                    <div className="print-doc-note-container">
                        <strong>{translations[lang]['Notes:']}</strong>
                        <div className="margin-top-1"></div>
                        <ul>
                            {prescription.notes.map(note => <li className="grey-text">{note}.</li>)}
                        </ul>
                    </div>
                    :
                    null
                }
            </div>
            <div className="application-signature-container">
                <span>Powered by <strong>RA'AYA</strong></span>
            </div>
        </div>
    }
}

export default PrescriptionDocument