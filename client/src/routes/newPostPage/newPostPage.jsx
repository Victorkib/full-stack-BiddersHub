import { useState } from 'react';
import './newPostPage.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiRequest from '../../lib/apiRequest';
import UploadWidget from '../../components/uploadWidget/UploadWidget';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

function NewPostPage() {
  const [value, setValue] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState('flowers'); // Add state for property type

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Add conditional logic for size
    const postDetail = {
      desc: value, //stay
      size: inputs.size ? parseInt(inputs.size) : undefined, // Conditional size
      rating: parseInt(inputs.rating), //replace with deposit
      condition: inputs.condition, //stay
      functionality: inputs.functionality, //stay
    };

    // Remove size if not applicable
    if (propertyType !== 'house') {
      delete postDetail.size;
    }

    try {
      setLoading(true);
      const res = await apiRequest.post('/posts', {
        postData: {
          title: inputs.title, //stay
          basePrice: parseInt(inputs.basePrice), //stay
          deposit: parseInt(inputs.deposit), //stay
          address: inputs.address, //stay
          city: inputs.city, //stay
          property: inputs.property, //stay
          latitude: '-1.2860648473335243', //stay
          longitude: '36.794800775775435', //stay
          images: images, //stay
        },
        postDetail: postDetail,
      });
      setLoading(false);
      navigate('/' + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="basePrice">
                BasePrice(The start amount of bidding an Item)
              </label>
              <input id="basePrice" name="basePrice" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="deposit">
                Deposit(miminum amount to enter a bid room)
              </label>
              <input id="deposit" name="deposit" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">Item City Location</label>
              <input id="city" name="city" type="text" required />
            </div>

            <div className="item">
              <label htmlFor="property">Product Type</label>
              <select
                name="property"
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
                <input min={0} id="size" name="size" type="number" required />
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
                required
              />
            </div>
            <div className="item">
              <label htmlFor="condition">Condition</label>
              <select name="condition" required>
                <option value="brandNew">Brand New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="functionality">Functionality</label>
              <select name="functionality" required>
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="useable">Useable</option>
              </select>
            </div>
            <button className="sendButton">Add</button>
            {error && <span>{error.message}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {loading ? (
          <ThreeDots color="#333" height={80} width={80} />
        ) : (
          <>
            {images.map((image, index) => (
              <img src={image} key={index} alt="" />
            ))}
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
          </>
        )}
      </div>
    </div>
  );
}

export default NewPostPage;
