import { Col, Row } from 'antd';

import ProductCard from '../../common/component/productCard';
import { useProductList } from '../../service/hook/product';

const ProductList: React.FC = () => {
  const { data } = useProductList();

  return (
    <>
      <h2 className="product-title">Products</h2>
      <div className="product-list-container">
        <Row gutter={[16, 16]} justify="center">
          {data?.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default ProductList;
