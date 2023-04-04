import React, { useContext, useMemo, useState } from 'react'
import {Form, Modal, Spin, Select, Avatar} from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider';
import { debounce } from 'lodash';
import { collection, query, where, orderBy, limit, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/config';
function DebounceSelect({fetchOptions, debounceTimeout = 300,...props}){
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const debounceFetcher = useMemo(()=>{
        const loadOptions = (value)=>{
            setOptions([]);
            setFetching(true);
            fetchOptions(value, props.curMembers).then(newOptions=>{
                setOptions(newOptions);
                setFetching(false);
            })
        }
        return debounce(loadOptions, debounceTimeout);
    },[debounceTimeout, fetchOptions]);
    console.log(options)
    return(
        <Select
           labelInValue
           filterOption={false}
           onSearch={debounceFetcher}
           notFoundContent={fetching? <Spin size='small'/>:null}
           {...props}
        >
            {
                options.map(opt=>{
                    return(
                    <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                        <Avatar size='small' src={opt.photoURL}>
                            {opt.photoURL ? '':opt.label?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {`${opt.label}`}
                    </Select.Option>)
                })
            }
        </Select>

    )
}
async function fetchUserList(search, curMembers) {
    const q = query(
      collection(db, "users"),
      where("keywords", "array-contains", search),
      orderBy("displayName"),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      label: doc.data().displayName,
      value: doc.data().uid,
      photoURL: doc.data().photoURL,
    })).filter(opt=>!curMembers.includes(opt.value));
  }
export default function InviteMemberModal() {
    const {isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom} = useContext(AppContext);
    const [form] = Form.useForm();
    const {user:{uid}} = useContext(AuthContext);
    const [value, setValue] = useState();
    console.log("selectedRoom",selectedRoom)
    console.log("selectedRoomId",selectedRoomId)
    const handleOk = (e) => {
        form.resetFields();
         //update members in current room
    if (selectedRoom) { // Kiểm tra nếu selectedRoom đã được định nghĩa
        const roomRef = doc(db, "rooms", selectedRoomId); // Sử dụng doc method để lấy tham chiếu của room
        const updatedMembers = [...selectedRoom.members, ...value.map(val => val.value)]; // Tạo mảng member mới
        updateDoc(roomRef, { members: updatedMembers }); // Sử dụng updateDoc method để cập nhật members của room
    }
    setIsInviteMemberVisible(false); 
      }
    const handleCancel = (e)=>{
        setIsInviteMemberVisible(false);
        form.resetFields();
    }
    console.log("hihi",selectedRoom.members)
  return (
    <div>
      <Modal
       title="Mời thêm thành viên"
       visible={isInviteMemberVisible}
       onOk={handleOk}
       onCancel={handleCancel}
       >
        <Form form={form} layout='vertical'>
            <DebounceSelect
            mode="multiple"
            label="Tên các thành viên"
            value={value}
            placeholder = "Nhập tên thành viên"
            fetchOptions={fetchUserList}
            onChange = {newValue => setValue(newValue)}
            style={{width: '100%'}}
            curMembers={selectedRoom.members}
            >
            </DebounceSelect>
        </Form>
      </Modal>
    </div>
  )
}
