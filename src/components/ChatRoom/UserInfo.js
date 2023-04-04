import { Avatar, Button, Typography } from 'antd'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import { auth, db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';

const WrapperStyled = styled.div`
   display: flex;
   justify-content: space-between;
   padding: 12px 16px;
   border-bottom: 1px solid rgba(82, 38, 83);
   .username{
    color: white;
    margin-left: 5px;
   }
`;
export default function UserInfo() {
  useEffect(()=>{
      // db.collection('users').onSnapshot((snapshot)=>{
      //   const data = snapshot.docs.map(doc=>({
      //     ...doc.data(),
      //     id: doc.id
      //   }))
      //   console.log({data})
      // })
  },[])
  const handleLogout = async () => {
  try {
    await auth.signOut();
    console.log("Đăng xuất thành công");
  } catch (error) {
    console.error("Đăng xuất thất bại", error);
  }
};
 const {user:{
  displayName,
  photoURL
 }}= React.useContext(AuthContext)
  return (
    <WrapperStyled>
      <div><Avatar src={photoURL}>
        {photoURL? '':displayName?.charAt(0)?.toUpperCase()}
      </Avatar>
      <Typography.Text className='username'>{displayName}</Typography.Text></div>
      <Button ghost onClick={handleLogout}>Đăng xuất</Button>
    </WrapperStyled>
  )
}
