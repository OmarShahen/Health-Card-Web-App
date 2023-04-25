import React from 'react'
import QrReader from 'react-qr-scanner'

const QRCodeScanner = () => {
  

    const previewStyle = {
      height: 240,
      width: 320,
    }

    const handleScan = (text) => {
        if(!text) 
            return 
        const data = JSON.parse(text.text)
        console.log(data)
    }

    return(
      <div>
        <QrReader
          delay={100}
          style={previewStyle}
          onError={(error) => console.error(error)}
          onScan={handleScan}
          />
      </div>
    )
}

export default QRCodeScanner