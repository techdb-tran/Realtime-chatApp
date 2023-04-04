import React, { useContext } from 'react'
import {Form, Modal, Input} from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { addDocument } from '../../firebase/service';
import { AuthContext } from '../../Context/AuthProvider';
export default function AddRoomModal() {
    const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext);
    const [form] = Form.useForm();
    const {user:{uid}} = useContext(AuthContext);
    const handleOk =(e)=>{
        console.log({formData: form.getFieldValue()});
        addDocument('rooms',{...form.getFieldValue(), members: [uid]})
        setIsAddRoomVisible(false);
        form.resetFields();
    }
    const handleCancel = (e)=>{
        setIsAddRoomVisible(false);
        form.resetFields();
    }
  return (
    <div>
      <Modal
       title="Tạo phòng"
       visible={isAddRoomVisible}
       onOk={handleOk}
       onCancel={handleCancel}
       >
        <Form form={form} layout='vertical'>
            <Form.Item label="Tên phòng" name='name'>
                <Input placeholder='Nhập tên phòng'/>
            </Form.Item>
            <Form.Item label="Mô tả" name='description'>
                <Input placeholder='Nhập mô tả'/>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
