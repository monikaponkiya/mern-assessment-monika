import { Button, Descriptions, Image, Rate, Space, Tabs, Tag, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import OrderDetails from '../../common/component/orderDetail';
import ProductCoupon from '../../common/component/productCoupon';
import UserModal from '../../common/modal/user';
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
      const defaultSize = data.sizeWiseColorPriceArray[0]._id;
      setSelectedSize(defaultSize);
      const defaultColor = data.sizeWiseColorPriceArray[0].colorAndSizeArray;
      setSelectedColor(defaultColor[0].colorId);
      setAvailableColors(defaultColor);
      setPrice(defaultColor[0].price);
      setProductEntryId(defaultColor[0].productEntryId);
    }
  }, [data]);

  const handleSizeChange = (sizeId: string) => {
    const sizeData = data?.sizeWiseColorPriceArray.find((item) => item._id === sizeId);
    if (sizeData) {
      setSelectedSize(sizeId);
      setAvailableColors(sizeData.colorAndSizeArray);
      const defaultColor = sizeData.colorAndSizeArray[0].colorId;
      setSelectedColor(defaultColor);
      setPrice(sizeData.colorAndSizeArray[0].price);
      setInputCode('');
      setOrderDetails(null);
      setSelectedCoupon(null);
    }
  };

  const handleChangeColor = (colorId: string) => {
    const colorData = availableColors.find((item) => item.colorId === colorId);
    if (colorData) {
      setSelectedColor(colorData.colorId);
      setPrice(colorData.price);
      setProductEntryId(colorData.productEntryId);
      setInputCode('');
      setOrderDetails(null);
      setSelectedCoupon(null);
    }
  };

  const sizeItems = useMemo(
    () =>
      data?.sizeWiseColorPriceArray.map((size) => ({
        key: size._id,
        label: size.size,
        children: null
      })),
    [data]
  );

  // check user applied coupon availability
  const handleApplyCoupon = () => {
    if (!inputCode) {
      message.error('Please select coupon code');
      return;
    }
    if (!userEmail) {
      setVisible(true);
      return;
    }
    const couponDetails: ICouponReq = {
      productEntryId: productEntryId,
      couponId: selectedCoupon?._id ?? null,
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

  // user confirm order
  const handleConfirmOrder = () => {
    if (!userEmail) {
      setVisible(true);
      return;
    }
    const orderData: IOrderReq = {
      productEntryId: productEntryId,
      couponId: orderDetails?.isCoupon_applied ? selectedCoupon?._id : null,
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

  const handleFinish = (values: IUser) => {
    setVisible(false);
    setUserEmail(values.email);
  };

  const setCoupleValue = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setInputCode(coupon.code);
    setOrderDetails(null);
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
                onChange={(key) => handleSizeChange(key)}
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
                      onClick={() => handleChangeColor(color.colorId)}
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

            <ProductCoupon
              inputCode={inputCode}
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              setCoupleValue={setCoupleValue}
              handleApplyCoupon={handleApplyCoupon}
              orderDetails={orderDetails}
            />

            <OrderDetails
              price={price}
              orderDetails={orderDetails}
              handleConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </div>

      {/* User email modal */}
      {visible && (
        <UserModal visible={visible} handleCancel={handleCancel} onFinish={handleFinish} />
      )}
    </div>
  );
};

export default ProductDetail;
