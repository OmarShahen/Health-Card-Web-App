import './viewers.css'


const AppPdfViewers = () => {

    return <div className="viewer-modal">
        <div className="pdf-body-container">
            <object data="https://firebasestorage.googleapis.com/v0/b/ra-aya.appspot.com/o/3690556.pdf?alt=media&token=8fa5f6ac-76c6-4f96-87c2-95c1796786de" type="application/pdf" width="100%" height="100%">
                <p>
                    Alternative text - include a link <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a></p>
            </object>  
        </div>
    </div>
}

export default AppPdfViewers