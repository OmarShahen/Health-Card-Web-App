import { useState, useEffect } from 'react'
import './viewers.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'

const PDFViewerPage = () => {

    const pagePath = window.location.pathname
    const fileId = pagePath.split('/')[3]

    const [url, setURL] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/files/${fileId}`)
        .then(response => {
            setIsLoading(false)
            setURL(response.data.file.url)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])

    return <div className="pdf-viewer-page-container">
        {
            isLoading ?
            <CircularLoading />
            :
            <object data={url} type="application/pdf" width="100%" height="100%">
                <p>
                    Alternative text - include a link <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a></p>
            </object> 
        }
          
    </div>
}

export default PDFViewerPage