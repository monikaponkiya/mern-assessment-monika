import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag } from 'antd';
import React from 'react';

import { ICoupon, ICouponApplied } from '../../../service/api/product/type';

interface IProps {
  inputCode: string;
  coupons: ICoupon[] | undefined;
  selectedCoupon: ICoupon | null;
  setCoupleValue: (coupon: ICoupon) => void;
  handleApplyCoupon: () => void;
  orderDetails: ICouponApplied | null;
}

const ProductCoupon: React.FC<IProps> = ({
  inputCode,
  coupons,
  selectedCoupon,
  setCoupleValue,
  handleApplyCoupon,
  orderDetails
}) => {
  return (
    <div className="coupon-container">
      <p>Available Coupons</p>
      <Space size="middle" direction="horizontal">
        {coupons?.map((coupon) => (
          <Tag
            style={{ width: 132, textAlign: 'center', cursor: 'pointer' }}
            key={coupon._id}
            color={coupon.code === (selectedCoupon && selectedCoupon?.code) ? 'green' : 'default'}
            onClick={() => setCoupleValue(coupon)}
          >
            {coupon.code} - {coupon.discountPercentage}% off
          </Tag>
        ))}
      </Space>
      {selectedCoupon && <p className="coupon-desc">{selectedCoupon.description}</p>}
      <div className="coupon-input">
        <Input placeholder="Enter coupon code" value={inputCode} style={{ width: 200 }} />
        <Button type="primary" onClick={handleApplyCoupon}>
          Apply
        </Button>
        {orderDetails?.isCoupon_applied && (
          <CheckCircleOutlined style={{ color: 'green', marginLeft: 5 }} />
        )}
      </div>
      <p
        className="coupon-desc"
        style={{ color: orderDetails?.isCoupon_applied ? 'green' : 'red' }}
      >
        {orderDetails ? orderDetails.message : ''}
      </p>
    </div>
  );
};

export default ProductCoupon;
