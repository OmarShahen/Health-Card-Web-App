import './document-sizes.css'

const DocumentsSizes = ({ size }) => {

    return <div className="documents-sizes-container">
        <span className="grey-bg">{size ? size : 0}</span>
    </div>
}

export default DocumentsSizes