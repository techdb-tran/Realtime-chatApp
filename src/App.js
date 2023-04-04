import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoomModal from './components/Modals/AddRoomModal';
import InviteMemberModal from './components/Modals/InviteMemberModal';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <AuthProvider>
        <AppProvider>
        <Routes>
          <Route element={<Login/>} path='/login'></Route>
          <Route element={<ChatRoom/>} path="/"></Route>
        </Routes>
        <AddRoomModal/>
        <InviteMemberModal/>
        </AppProvider>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
