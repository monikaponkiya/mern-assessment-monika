import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { useOrderDetails } from '../../service/hook/product';
import { IMAGE_BASE_URL } from '../../utils/constant';
import { ROUTES } from '../../utils/routes';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderDetails } = useOrderDetails(id ?? '');
  return (
    <div className="order-details">
      <h1 style={{ textAlign: 'center' }}>Order Details</h1>
      <p>
        <strong>Product Name:</strong> {orderDetails?.productName}
      </p>
      <p>
        <strong>Product Description:</strong> {orderDetails?.productDescription}
      </p>
      <img src={IMAGE_BASE_URL + orderDetails?.productImage} alt={orderDetails?.productName} />
      <p>
        <strong>Size:</strong> {orderDetails?.size}
      </p>
      <p>
        <strong>Color:</strong> {orderDetails?.color}
      </p>
      <p>
        <strong>Price:</strong> ₹{orderDetails?.orderValue}
      </p>
      <Button type="primary" onClick={() => navigate(ROUTES.default)}>
        Back
      </Button>
    </div>
  );
};
export default OrderDetail;
