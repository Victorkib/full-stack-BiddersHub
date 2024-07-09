import React, { useState } from 'react';
import Viewer from 'react-viewer'; // Import react-viewer
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faFilePdf,
  faFileImage,
} from '@fortawesome/free-solid-svg-icons';

const DocumentViewer = ({ documentUrl }) => {
  const [visible, setVisible] = useState(false);

  const handleDocumentClick = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div onClick={handleDocumentClick}>Click to view document</div>
      <Viewer
        visible={visible}
        onClose={onClose}
        images={[{ src: documentUrl, alt: 'Document' }]}
        downloadable={true} // Optional: Allow downloading
        noClose={true} // Optional: Disable close button
        zIndex={9999} // Optional: Adjust z-index
      />
    </div>
  );
};

export default DocumentViewer;
