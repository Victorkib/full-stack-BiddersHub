import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addCr12,
  addAuctioneeringLicense,
} from '../../Features/docSlice/docUrlSlice';
import { ThreeDots } from 'react-loader-spinner';

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadDocWidget({ uwConfig, field, setLoading }) {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById('uw');
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('id', 'uw');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.addEventListener('load', () => setLoaded(true));
        document.body.appendChild(script);
        console.log('script loaded');
      } else {
        // If already loaded, update the state
        console.log('script loaded');
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    setLoading(true); // Set loading to true when initializing widget

    if (loaded && window.cloudinary && window.cloudinary.createUploadWidget) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          setLoading(false); // Set loading to false when upload completes

          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info:', result.info);
            console.log('Uploaded Document URL:', result.info.secure_url);

            // Dispatch action based on the field type
            if (field === 'cr12') {
              dispatch(addCr12(result.info.secure_url));
            } else if (field === 'auctioneeringLicense') {
              dispatch(addAuctioneeringLicense(result.info.secure_url));
            }
          }
        }
      );

      myWidget.open();
    } else {
      // Handle the case where Cloudinary script or createUploadWidget is not available yet
      console.error('Cloudinary script not fully loaded.');
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        type="button"
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadDocWidget;
export { CloudinaryScriptContext };
