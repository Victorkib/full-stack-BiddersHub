import './register.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFile } from '@fortawesome/free-solid-svg-icons';
import UploadDocWidget from '../../components/uploadWidget/UploadDocWidget';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCr12,
  addAuctioneeringLicense,
  resetUploads,
} from '../../Features/docSlice/docUrlSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';

function Register() {
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyAddress: '',
  });
  const [loading, setLoading] = useState(false); // State for loader
  const [fullDocumentView, setFullDocumentView] = useState(null);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const documentUrls = useSelector((state) => state.uploads);

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
      !documentUrls.cr12.length ||
      !documentUrls.auctioneeringLicense.length
    ) {
      setError('Please upload all required documents.');
      return;
    }

    setLoading(true); // Set loading to true when submitting

    const formData = new FormData();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('username', userData.username);
    formData.append('companyName', companyData.companyName);
    formData.append('companyAddress', companyData.companyAddress);

    documentUrls.cr12.forEach((url) => formData.append('cr12', url));
    documentUrls.auctioneeringLicense.forEach((url) =>
      formData.append('auctioneeringLicense', url)
    );

    try {
      // toast.info('Registering...'); // Displaying toast for registration process

      const res = await apiRequest.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 200) {
        toast.success('Registration successful');
        updateUser(res.data);
        dispatch(resetUploads());
        navigate('/login');
      } else {
        setError('Failed to register.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register.');
    } finally {
      setLoading(false); // Always set loading back to false, whether success or error
    }
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prevStep) => prevStep - 1);
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
    const documents = documentUrls[field] || [];

    return (
      <div className="uploadSection">
        <h2>{label}</h2>
        <p>{reason}</p>
        <UploadDocWidget
          uwConfig={{
            cloudName: 'victorkib',
            uploadPreset: 'estate',
            folder: 'posts',
            multiple: false,
          }}
          field={field}
        />
        <div className="documentPreview">
          {documents.length > 0 ? (
            documents.map((url, index) => (
              <div className="documentThumbnail" key={index}>
                {url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                  <img src={url} alt={`${label} ${index}`} />
                ) : (
                  <FontAwesomeIcon icon={faFile} />
                )}
                <h6>Document Uploaded✔️</h6>
                <FontAwesomeIcon
                  icon={faEye}
                  className="viewIcon"
                  onClick={() => handleDocumentClick(field, index)}
                />
              </div>
            ))
          ) : (
            <FontAwesomeIcon icon={faFile} />
          )}
        </div>
      </div>
    );
  };

  const renderFullDocumentView = () => {
    if (!fullDocumentView) return null;

    const { field, index } = fullDocumentView;
    const documentUrl = documentUrls[field][index];

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
          {documentUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
            <img src={documentUrl} alt={`${field} ${index}`} />
          ) : (
            <iframe
              className="fullDocIframe"
              src={documentUrl}
              title={`${field} ${index}`}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="registerPage">
      <ToastContainer />
      {loading && (
        <div className="loader">
          <ThreeDots color="#333" height={80} width={80} />
        </div>
      )}
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
              {error && <p className="errorMessage">{error}</p>}
              {renderBackButton()}
              {renderNextButton()}
              <span>
                Already have an account? <Link to="/login">Login here</Link>
              </span>
            </form>
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
              {error && <p className="errorMessage">{error}</p>}
              {renderBackButton()}
              {renderNextButton()}
            </form>
          </div>
        )}
        {step === 3 && (
          <div className="formContainer">
            <form onSubmit={handleSubmitStep3}>
              <h1>Step 3: Upload PDF Documents</h1>
              {renderDocumentUpload(
                'CR12',
                'cr12',
                'Please upload the CR12 document.'
              )}
              {renderDocumentUpload(
                'Auctioneering License',
                'auctioneeringLicense',
                'Please upload the Auctioneering License document.'
              )}
              {error && <p className="errorMessage">{error}</p>}
              {renderBackButton()}
              {renderNextButton()}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
