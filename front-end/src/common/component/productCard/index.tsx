import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

import { IProduct } from '../../../service/api/product/type';
import { IMAGE_BASE_URL } from '../../../utils/constant';

const { Meta } = Card;

interface IProps {
  product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
  const navigate = useNavigate();
  return (
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
  );
};

export default ProductCard;
