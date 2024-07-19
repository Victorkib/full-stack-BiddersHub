import { useState, useEffect } from 'react';
import './EditSingle.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiRequest from '../../lib/apiRequest';
import UploadWidget from '../../components/uploadWidget/UploadWidget';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';

function EditSingle() {
  const [value, setValue] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for UploadWidget
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const [propertyType, setPropertyType] = useState('flowers'); // Property type state

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        const data = res.data;
        setProduct(data);
        setValue(data.postDetail.desc);
        setImages(data.images);
        setPropertyType(data.property);
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    const postDetail = {
      desc: value,
      size: propertyType === 'house' ? parseInt(inputs.size) : undefined,
      rating: parseInt(inputs.rating),
      condition: inputs.condition,
      functionality: inputs.functionality,
    };

    try {
      // Display loader for backend update
      setLoading(true);

      const res = await apiRequest.put(`/posts/${id}`, {
        postData: {
          title: inputs.title,
          basePrice: parseInt(inputs.basePrice),
          deposit: parseInt(inputs.deposit),
          address: inputs.address,
          city: inputs.city,
          property: inputs.property,
          latitude: '-1.2860648473335243',
          longitude: '36.794800775775435',
          images: images,
        },
        postDetail: postDetail,
      });
      toast.success('Post updated successfully');
      navigate('/' + res.data.id);
    } catch (err) {
      console.log(err);
      toast.error('Failed to update post');
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoading(false); // Hide backend update loader
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="editSingle">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="formContainer">
          <div className="wrapper">
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={product?.title}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="basePrice">Base Price {`($)`}</label>
              <input
                id="basePrice"
                name="basePrice"
                type="number"
                defaultValue={product?.basePrice}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="deposit">Deposit {`($)`}</label>
              <input
                id="deposit"
                name="deposit"
                type="number"
                defaultValue={product?.deposit}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={product?.address}
                required
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={product?.city}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="property">Product Type</label>
              <select
                name="property"
                defaultValue={product?.property}
                onChange={(e) => setPropertyType(e.target.value)}
                required
              >
                <option value="flowers">Flowers</option>
                <option value="vehicles">Vehicles</option>
                <option value="house">Houses</option>
                <option value="condo">Utilities</option>
                <option value="land">Paintings</option>
                <option value="other">Other</option>
              </select>
            </div>
            {propertyType === 'house' && (
              <div className="item">
                <label htmlFor="size">Product Size (sqft)</label>
                <input
                  min={0}
                  id="size"
                  name="size"
                  type="number"
                  defaultValue={product?.postDetail?.size}
                  required
                />
              </div>
            )}
            <div className="item">
              <label htmlFor="rating">Rate item 0-5 scale</label>
              <input
                min={0}
                max={5}
                id="rating"
                name="rating"
                type="number"
                defaultValue={product?.postDetail?.rating}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="condition">Condition</label>
              <select
                name="condition"
                defaultValue={product?.postDetail?.condition}
                required
              >
                <option value="brandNew">Brand New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="functionality">Functionality</label>
              <select
                name="functionality"
                defaultValue={product?.postDetail?.functionality}
                required
              >
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="useable">Useable</option>
              </select>
            </div>
            <div className="item">
              <label>Add Photos</label>
              <UploadWidget
                uwConfig={{
                  multiple: true,
                  cloudName: 'victorkib',
                  uploadPreset: 'estate',
                  folder: 'posts',
                }}
                setState={setImages}
                setLoading={setLoading}
              />
            </div>
            <button className="sendButton" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="loader">
                  <ThreeDots className="threeDots" height={15} width={50} />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
        {loading && (
          <div className="loaderContainer">
            <ThreeDots className="backendLoader" height={80} width={80} />
            <p>Updating post...</p>
          </div>
        )}
        <hr />
        <div className="sideContainer">
          {images.map((img, index) => (
            <div key={index} className="imageContainer">
              <img src={img} alt={`Post Image ${index + 1}`} />
              <button type="button" onClick={() => handleRemoveImage(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </form>
      <ToastContainer /> {/* Toast notifications container */}
      {error && <span>{error}</span>}
    </div>
  );
}

export default EditSingle;
