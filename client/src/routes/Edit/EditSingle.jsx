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
  const [isLoading, setIsLoading] = useState(false); // Loading state

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
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true on form submit
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/posts/${id}`, {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      toast.success('Post updated successfully'); // Success toast
      navigate('/' + res.data.id);
    } catch (err) {
      console.log(err);
      toast.error('Failed to update post'); // Error toast
      setError(err.message);
    } finally {
      setIsLoading(false); // Set loading to false after request completes
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
            {/* Other form fields */}
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={product?.title}
              />
            </div>
            <div className="item">
              <label htmlFor="price">Base Price</label>
              <input
                id="price"
                name="price"
                type="number"
                defaultValue={product?.price}
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={product?.address}
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
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Number In stock</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                defaultValue={product?.bedroom}
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Variety Number</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                defaultValue={product?.bathroom}
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                defaultValue={product?.latitude}
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                defaultValue={product?.longitude}
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" defaultValue={product?.type}>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" defaultValue={product?.property}>
                <option value="apartment">Vehicles</option>
                <option value="house">Houses</option>
                <option value="condo">Utilities</option>
                <option value="land">Paintings</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select
                name="utilities"
                defaultValue={product?.postDetail?.utilities}
              >
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Credit Policy</label>
              <select name="pet" defaultValue={product?.postDetail?.pet}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                defaultValue={product?.postDetail?.income}
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input
                min={0}
                id="size"
                name="size"
                type="number"
                defaultValue={product?.postDetail?.size}
              />
            </div>
            <div className="item">
              <label htmlFor="school">TestNo</label>
              <input
                min={0}
                id="school"
                name="school"
                type="number"
                defaultValue={product?.postDetail?.school}
              />
            </div>
            <div className="item">
              <label htmlFor="bus">TestNo</label>
              <input
                min={0}
                id="bus"
                name="bus"
                type="number"
                defaultValue={product?.postDetail?.bus}
              />
            </div>
            <div className="item">
              <label htmlFor="restaurant">TestNo</label>
              <input
                min={0}
                id="restaurant"
                name="restaurant"
                type="number"
                defaultValue={product?.postDetail?.restaurant}
              />
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
