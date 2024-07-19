import { Await, Link, useLoaderData, useNavigate } from 'react-router-dom';
import List from '../../components/list/List';

import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import { Suspense } from 'react';
import './Product.scss';
import '../profilePage/profilePage.scss';
const Products = () => {
  const data = useLoaderData();

  const handleError = (message) => {
    toast.error(message);
  };
  return (
    <div className="products">
      <ToastContainer />
      <div className="title">
        <h1>My Products</h1>
        <Link to="/add">
          <button>New Product</button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="loader">
            <ThreeDots
              className="threeDots"
              color="#00BFFF"
              height={80}
              width={80}
            />
          </div>
        }
      >
        <Await
          resolve={data.postResponse}
          errorElement={<p>Error loading Products!</p>}
          onError={(error) => handleError('Error loading Products!')}
        >
          {(postResponse) => <List posts={postResponse.data.userPosts} />}
        </Await>
      </Suspense>
    </div>
  );
};

export default Products;
