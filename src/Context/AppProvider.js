import React, { useMemo, useState} from 'react'
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from '../Context/AuthProvider';

export const AppContext = React.createContext();
export default function AppProvider({children}) {
   const [isAddRoomVisible, setIsAddRoomVisible]= useState(false);
   const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
   const [selectedRoomId , setSelectedRoomId] = useState('');
   const {user: {uid}} = React.useContext(AuthContext);
   const roomsCondition = useMemo(()=>{
    if(!uid){
      return null
    }
    else{return {
        fieldName: 'members',
        operator: 'array-contains',
        compareValue: uid
    }}
  },[uid])
  const rooms = useFirestore('rooms',roomsCondition);
  const selectedRoom = useMemo(()=>rooms.find((room)=> room.id===selectedRoomId)||{},
  [rooms, selectedRoomId]);
  console.log(selectedRoom)
  const usersCondition = useMemo(()=>{
    if(!selectedRoom.members){
      return null
    }
    else{return {
        fieldName: 'uid',
        operator: 'in',
        compareValue: selectedRoom.members,
    }}
  },[selectedRoom.members])
  const members = useFirestore('users', usersCondition);
  console.log(members)
  return (
      <AppContext.Provider value={{rooms,members, isAddRoomVisible, setIsAddRoomVisible,selectedRoomId , setSelectedRoomId, selectedRoom,isInviteMemberVisible, setIsInviteMemberVisible}}>
         {children}
      </AppContext.Provider>
  )
}
