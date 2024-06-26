import { Button, Form, Input, Modal } from 'antd';

import { IUser } from '../../../service/api/product/type';

interface IProps {
  visible: boolean;
  handleCancel: () => void;
  onFinish: (values: IUser) => void;
}

const UserModal: React.FC<IProps> = ({ visible, handleCancel, onFinish }) => {
  return (
    <Modal open={visible} title="" onCancel={handleCancel} footer={null}>
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
  );
};

export default UserModal;
