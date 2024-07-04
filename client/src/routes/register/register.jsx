import './register.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import UploadWidget from '../../components/uploadWidget/UploadWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFile } from '@fortawesome/free-solid-svg-icons';

function Register() {
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: '', // Add username state
  });
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyAddress: '',
    cr12: [],
    auctioneeringLicense: [],
  });
  const [fullDocumentView, setFullDocumentView] = useState(null);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setError('');
    if (!userData.email || !userData.password || !userData.username) {
      setError('Please fill in all required fields.');
      return;
    }
    setStep(2);
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setError('');
    if (!companyData.companyName || !companyData.companyAddress) {
      setError('Please fill in all required fields.');
      return;
    }
    setStep(3);
  };

  const handleSubmitStep3 = async (e) => {
    e.preventDefault();
    setError('');
    if (
      companyData.cr12.length === 0 ||
      companyData.auctioneeringLicense.length === 0
    ) {
      setError('Please upload all required documents.');
      return;
    }

    const formData = new FormData();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('username', userData.username);
    formData.append('companyName', companyData.companyName);
    formData.append('companyAddress', companyData.companyAddress);

    if (Array.isArray(companyData.cr12)) {
      companyData.cr12.forEach((file) => formData.append('cr12', file));
    } else {
      formData.append('cr12', companyData.cr12); // Handle single file case
    }

    if (Array.isArray(companyData.auctioneeringLicense)) {
      companyData.auctioneeringLicense.forEach((file) =>
        formData.append('auctioneeringLicense', file)
      );
    } else {
      formData.append('auctioneeringLicense', companyData.auctioneeringLicense); // Handle single file case
    }

    try {
      const res = await apiRequest.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 200) {
        console.log('Registration successful');
        updateUser(res.data);
        navigate('/');
      } else {
        setError('Failed to register.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register.');
    }
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prevStep) => prevStep - 1);
  };

  const handleUpload = (field, url) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], url], // Append the new URL to the array
    }));
  };

  const handleDocumentClick = (field, index) => {
    setFullDocumentView({ field, index });
  };

  const renderBackButton = () => {
    if (step > 1) {
      return <button onClick={handlePrevStep}>Back</button>;
    }
    return null;
  };

  const renderNextButton = () => {
    if (step < 3) {
      return <button type="submit">Next</button>;
    }
    return <button type="submit">Register</button>;
  };

  const renderDocumentUpload = (label, field, reason) => {
    const documents = companyData[field];

    return (
      <div className="uploadSection">
        <h2>{label}</h2>
        <p>{reason}</p>
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: 'victorkib',
            uploadPreset: 'estate',
            folder: 'posts',
          }}
          handleUpload={(url) => handleUpload(field, url)} // Pass a callback to handle the uploaded URL
        />
        <div className="documentPreview">
          {documents.length > 0 ? (
            documents.map((file, index) => (
              <div className="documentThumbnail" key={index}>
                <img src={file} alt={`${label} ${index}`} />
                <FontAwesomeIcon
                  icon={faEye}
                  className="viewIcon"
                  onClick={() => handleDocumentClick(field, index)}
                />
              </div>
            ))
          ) : (
            <img src={faFile} alt="file" />
          )}
        </div>
      </div>
    );
  };

  const renderFullDocumentView = () => {
    if (!fullDocumentView) return null;

    const { field, index } = fullDocumentView;
    const documentUrl = companyData[field][index];

    console.log('Full Document URL:', documentUrl);

    return (
      <div className="fullDocumentView">
        <div
          className="overlay"
          onClick={() => setFullDocumentView(null)}
        ></div>
        <div className="fullDocument">
          <button
            className="closeButton"
            onClick={() => setFullDocumentView(null)}
          >
            Close
          </button>
          <img
            className="fullDocImg"
            src={documentUrl}
            alt={`${field} ${index}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="registerPage">
      {renderFullDocumentView()}
      <div className="firstRegPage">
        <div className="stepper">
          <div className={`step ${step === 1 ? 'active' : ''}`}>Step 1</div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>Step 2</div>
          <div className={`step ${step === 3 ? 'active' : ''}`}>Step 3</div>
        </div>
        <div className="progress-bar">
          <div
            style={{ width: `${(step - 1) * 50}%` }}
            className="progress"
          ></div>
        </div>
        {step === 1 && (
          <div className="formContainer">
            <form onSubmit={handleSubmitStep1}>
              <h1>Step 1: Personal Information</h1>
              <input
                name="email"
                type="text"
                placeholder="Email *"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
              />
              <input
                name="username"
                type="text"
                placeholder="Username *"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password *"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                required
              />
              {renderNextButton()}
              {error && <span>{error}</span>}
            </form>
            <Link to="/login">Already have an account? Login</Link>
          </div>
        )}
        {step === 2 && (
          <div className="formContainer">
            <form onSubmit={handleSubmitStep2}>
              <h1>Step 2: Company Details</h1>
              <input
                name="companyName"
                type="text"
                placeholder="Company Name *"
                value={companyData.companyName}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    companyName: e.target.value,
                  })
                }
                required
              />
              <input
                name="companyAddress"
                type="text"
                placeholder="Company Address *"
                value={companyData.companyAddress}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    companyAddress: e.target.value,
                  })
                }
                required
              />
              <div className="regbuttons">
                {renderBackButton()}
                {renderNextButton()}
              </div>
              {error && <span>{error}</span>}
            </form>
          </div>
        )}
        {step === 3 && (
          <div className="formContainer">
            <form onSubmit={handleSubmitStep3}>
              <h1>Step 3: Upload Documents</h1>
              {renderDocumentUpload(
                'CR12',
                'cr12',
                'Upload your CR12 document for verification purposes.'
              )}
              {renderDocumentUpload(
                'Auctioneering License',
                'auctioneeringLicense',
                'Upload your auctioneering license for verification purposes.'
              )}
              <div className="regbuttons">
                {renderBackButton()}
                {renderNextButton()}
              </div>
              {error && <span>{error}</span>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
