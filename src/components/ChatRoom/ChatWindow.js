import { UserAddOutlined } from '@ant-design/icons';
import { Button, Avatar, Tooltip, Form, Input, Alert } from 'antd';
import React, { useContext, useMemo } from 'react';
import { useState } from 'react';
import Message from './Message';
import styled from 'styled-components';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/service';
import { AuthContext } from '../../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';


const HeaderStyled = styled.div`
 display: flex;
 justify-content: space-between;
 height: 56px;
 padding: 0 16px;
 align-items: center;
 border-bottom: 1px solid rgb(230, 230, 230);
 .header{
    &__info{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    &__title{
        margin: 0;
        font-weight: bold;
    }
    &__description{
        font-size: 12px;
    }
 }
`;
const ButtonGroupStyled = styled.div`
        display: flex;
        align-item: center;
`;
const WrapperStyled = styled.div`
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
`;
const ContentStyled = styled.div`
        height: calc(100%- 56px);
        padding: 11px;
`;
const FormStyled = styled(Form)`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 2px 2px 0;
        border: 1px solid rgb(230, 230,230);
        border-radius: 2px;
        .ant-form-item{
            flex: 1;
            margin-bottom: 0;
        }
`;
const MessageListStyled = styled.div`
        max-height: 100%;
        overflow-y: auto;   
`;
//search

export default function ChatWindow() {
    const { selectedRoom, members, setIsInviteMemberVisible} = useContext(AppContext);
    const { user:{
        uid, photoURL, displayName
    }} = useContext(AuthContext)
    const [inputValue, setInputValue]=useState('')
    const [form] = Form.useForm();
    const handleInputChange = (e)=>{
        setInputValue(e.target.value)
    }
    const handleOnSubmit =()=>{
        addDocument('messages',{
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName
        });
        form.resetFields(['message'])
    }
    const condition = useMemo(()=>({
        fieldName: 'roomId',
        operator: '==',
        compareValue: selectedRoom.id
    }),[selectedRoom.id])
    const messages = useFirestore('messages',condition)
    console.log("message",{messages})
    return (
        <WrapperStyled>
            {
                selectedRoom.id?(<>
                <HeaderStyled>
                <div className='header__info'>
                    <p className='header__title'>{selectedRoom.name}</p>
                    <span className='header__description'>{selectedRoom.description}</span>
                </div>
                <ButtonGroupStyled>
                    <Button icon={<UserAddOutlined />} onClick={()=>setIsInviteMemberVisible(true)}>Mời</Button>
                    <Avatar.Group size='small' maxCount={2}>
                        {members.map(member=>{
                        return(<Tooltip title={member.displayName} key={member.id}>
                            <Avatar src={member.photoURL}>{member.photoURL? '':member.displayName.chatAt(0)?.toUpperCase()}</Avatar>
                        </Tooltip>)})}
                    </Avatar.Group>
                </ButtonGroupStyled>
            </HeaderStyled>
            <ContentStyled>
                <MessageListStyled>
                     {
                        messages.map(mes=><Message key={mes.id} text={mes.text} photoURL={mes.photoURL} displayName={mes.displayName} createdAt={mes.createdAt.seconds}></Message>)
                     }   
                </MessageListStyled>
                <FormStyled form={form}>
                    <Form.Item name='message'>
                        <Input
                        onChange={handleInputChange}
                        onPressEnter={handleOnSubmit}
                        bordered={false} placeholder='Nhập tin nhắn' autoComplete='off'/>
                    </Form.Item>
                    <Button type='primary' onClick={handleOnSubmit}>Gửi</Button>
                </FormStyled>
            </ContentStyled></>)
            :<Alert message='Hãy chọn phòng' type='info' showIcon style={{margin: 5}} closable></Alert>
            }
        </WrapperStyled>
    )
}
