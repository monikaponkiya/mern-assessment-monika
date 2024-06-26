import { Button } from 'antd';

import { ICouponApplied } from '../../../service/api/product/type';

interface IProps {
  price: number;
  orderDetails: ICouponApplied | null;
  handleConfirmOrder: () => void;
}

const OrderDetails: React.FC<IProps> = ({ price, orderDetails, handleConfirmOrder }) => {
  return (
    <div className="order-container">
      <h4>Order Details</h4>
      <div className="order-item">
        <span>Total:</span>
        <span>₹{price}</span>
      </div>
      {orderDetails?.isCoupon_applied && (
        <div className="order-item discount">
          <span>Discount Price:</span>
          <span>-₹{orderDetails.discountedPrice}</span>
        </div>
      )}
      <div className="order-item amount-payable">
        <span>Amount Payable:</span>
        <span>₹{orderDetails?.amount_payable ?? price}</span>
      </div>
      <Button className="buy-now" type="primary" onClick={handleConfirmOrder}>
        Confirm Order
      </Button>
    </div>
  );
};

export default OrderDetails;
