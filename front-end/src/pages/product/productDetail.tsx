import { CheckCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Rate,
  Space,
  Tabs,
  Tag,
  message
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  IColorAndSizeArray,
  ICoupon,
  ICouponApplied,
  ICouponReq,
  IOrderReq,
  IUser
} from '../../service/api/product/type';
import {
  useCouponApplied,
  useCouponList,
  useOrderConfirmed,
  useProductDetails
} from '../../service/hook/product';
import { IMAGE_BASE_URL } from '../../utils/constant';
import { ROUTES } from '../../utils/routes';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [availableColors, setAvailableColors] = useState<IColorAndSizeArray[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [productEntryId, setProductEntryId] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<ICouponApplied | null>(null);

  const { data } = useProductDetails(id ?? '');
  const { data: coupons } = useCouponList(id ?? '');
  const { mutate: couponAppliedMutate } = useCouponApplied();
  const { mutate: orderConfirmedMutate } = useOrderConfirmed();

  useEffect(() => {
    if (data) {
      const defaultSize = data.productSize[0]._id;
      setSelectedSize(defaultSize);
    }
  }, [data]);

  useEffect(() => {
    if (data && selectedSize) {
      const sizeData = data.sizeWiseColorPriceArray.find((item) => item._id === selectedSize);
      if (sizeData) {
        setAvailableColors(sizeData.colorAndSizeArray);
        const defaultColor = sizeData.colorAndSizeArray[0].colorId;
        setSelectedColor(defaultColor);
        setPrice(sizeData.colorAndSizeArray[0].price);
        setInputCode('');
        setOrderDetails(null);
        setSelectedCoupon(null);
      }
    }
  }, [data, selectedSize]);

  useEffect(() => {
    if (data && selectedSize && selectedColor) {
      const sizeData = data.sizeWiseColorPriceArray.find((item) => item._id === selectedSize);
      if (sizeData) {
        const colorData = sizeData.colorAndSizeArray.find((item) => item.colorId === selectedColor);
        if (colorData) {
          setPrice(colorData.price);
          setProductEntryId(colorData.productEntryId);
        }
      }
    }
  }, [data, selectedSize, selectedColor]);

  const sizeItems = data?.productSize.map((size) => ({
    key: size._id,
    label: size.name,
    children: null
  }));

  const handleApplyCoupon = () => {
    if (!inputCode) {
      message.error('Please select coupon code');
      return;
    }
    if (!userEmail) {
      setVisible(true);
      return;
    }
    const coupon = coupons?.find((c) => c.code === inputCode);
    if (!coupon) {
      message.error('Invalid coupon code!');
      return;
    }
    const couponDetails: ICouponReq = {
      productEntryId: productEntryId,
      couponId: coupon._id,
      email: userEmail
    };
    couponAppliedMutate(couponDetails, {
      onSuccess: (res) => {
        setOrderDetails(res);
      },
      onError: (error) => {
        setOrderDetails(null);
        message.error(error.message ?? 'Failed to apply coupon');
      }
    });
  };

  const handleConfirmOrder = () => {
    if (!userEmail) {
      setVisible(true);
      return;
    }
    const orderData: IOrderReq = {
      productEntryId: productEntryId,
      couponId: orderDetails && orderDetails.isCoupon_applied ? selectedCoupon?._id : null,
      email: userEmail,
      orderValue: orderDetails?.amount_payable ?? price
    };
    orderConfirmedMutate(orderData, {
      onSuccess: (res) => {
        navigate(`/order/${res._id}`);
      },
      onError: () => {}
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values: IUser) => {
    setVisible(false);
    setUserEmail(values.email);
  };

  const setCoupleValue = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setInputCode(coupon.code);
  };

  return (
    <div className="product-detail-page">
      <Button className="back-btn" type="primary" onClick={() => navigate(ROUTES.productList)}>
        Back
      </Button>
      <div className="product-detail-container">
        <div className="product-detail-card">
          <div className="pro-img">
            <Image
              alt={data?.productName}
              src={IMAGE_BASE_URL + data?.productImage}
              width="100%"
              height={400}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="desc-card">
            <h2>{data?.productName}</h2>
            <div className="desc-item">
              <p>{data?.productDescription}</p>
              <div>
                <Rate disabled value={data?.productRate} />
              </div>
              <h2>₹{price}</h2>
            </div>

            <Descriptions.Item className="desc-item">
              <Tabs
                size="small"
                defaultActiveKey={selectedSize}
                onChange={(key) => setSelectedSize(key)}
                items={sizeItems}
              />
            </Descriptions.Item>
            <Descriptions.Item className="desc-item" label="Available Colors">
              {availableColors.length > 0 ? (
                <Space size="small">
                  {availableColors.map((color) => (
                    <Tag
                      key={color.colorId}
                      color={color.colorId === selectedColor ? 'blue' : 'default'}
                      onClick={() => setSelectedColor(color.colorId)}
                      style={{ width: 50, textAlign: 'center', cursor: 'pointer' }}
                    >
                      {color.color}
                    </Tag>
                  ))}
                </Space>
              ) : (
                'Select a size to see available colors'
              )}
            </Descriptions.Item>
            <div className="coupon-container">
              <p>Available Coupons</p>
              <Space size="middle" direction="horizontal">
                {coupons?.map((coupon) => (
                  <Tag
                    style={{ width: 132, textAlign: 'center', cursor: 'pointer' }}
                    key={coupon._id}
                    color={
                      coupon.code === (selectedCoupon && selectedCoupon?.code) ? 'green' : 'default'
                    }
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
          </div>
        </div>
      </div>
      {/* User email modal */}
      <Modal open={visible} title="" onCancel={handleCancel} footer={[]}>
        <div className="container-add">
          <Form
            layout="vertical"
            name="add-user"
            style={{
              maxWidth: 500,
              width: 400
            }}
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              wrapperCol={{ md: 24 }}
              label="User Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter email'
                },
                {
                  type: 'email',
                  message: 'Please enter valid email'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
