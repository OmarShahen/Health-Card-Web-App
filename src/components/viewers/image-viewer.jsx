import './viewers.css'
import ImageViewer from 'react-simple-image-viewer';


const AppImageViewers = ({ imagesURLs=[], currentIndex=0, setIsShowImageViewer }) => {

    return <div className="modal">
        <ImageViewer
          src={imagesURLs}
          currentIndex={currentIndex}
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={() => setIsShowImageViewer(false)}
        />
      
    </div>
}

export default AppImageViewers