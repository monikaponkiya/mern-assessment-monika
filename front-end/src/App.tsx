import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production';
import { message } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Layout from './common/Layout';
import OrderDetail from './pages/product/orderDetail';
import ProductDetail from './pages/product/productDetail';
import ProductList from './pages/product/productList';
import { ROUTES } from './utils/routes';

function App() {
  const queryClient = new QueryClient();
  message.config({
    maxCount: 3
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="" element={<Layout />}>
              <Route path={ROUTES.default} element={<ProductList />} />
              <Route path={ROUTES.productList} element={<ProductList />} />
              <Route path={ROUTES.productDetail} element={<ProductDetail />} />
              <Route path={ROUTES.orderDetail} element={<OrderDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
      </QueryClientProvider>
    </>
  );
}

export default App;
