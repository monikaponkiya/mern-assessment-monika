import { Card, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';

import { useProductList } from '../../service/hook/product';
import { IMAGE_BASE_URL } from '../../utils/constant';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useProductList();

  return (
    <>
      <h2 className="product-title">Products</h2>
      <div className="product-list-container">
        <Row gutter={[16, 16]} justify="center">
          {data?.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="product-card"
                cover={
                  <div className="product-image-container">
                    <img
                      alt={product.productName}
                      src={IMAGE_BASE_URL + product.productImage}
                      className="product-image"
                    />
                  </div>
                }
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <Meta title={product.productName} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default ProductList;
