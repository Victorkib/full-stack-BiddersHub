import { useState } from 'react';
import UploadWidget from '../../components/uploadWidget/UploadWidget';

const UploadWrapper = ({ field, onUploadComplete }) => {
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleUpload = (url) => {
    setUploadedUrls((prevUrls) => {
      const newUrls = [...prevUrls, url];
      onUploadComplete(field, newUrls); // Pass the updated URLs to the parent component
      return newUrls;
    });
  };

  return (
    <UploadWidget
      uwConfig={{
        multiple: true,
        cloudName: 'victorkib',
        uploadPreset: 'estate',
        folder: 'posts',
      }}
      handleUpload={handleUpload} // Use the local handleUpload function
    />
  );
};

export default UploadWrapper;
