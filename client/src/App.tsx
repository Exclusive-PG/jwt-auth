import { observer } from "mobx-react-lite";
import React, { FC, useContext, useEffect, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import { Context } from './index';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    if(localStorage.getItem("token")){
        store.checkAuth();
        console.log("render component")
    }

  }, []);
  
  async function getUsers(){
    try{
        const response = await UserService.getUsers();
        setUsers(response.data)
    }catch(e){
      console.log(e)      
    }
  }
  if(store.isLoading){
    return(
      <>
        Loading...
      </>
    )
  }

  if(!store.isAuth){
    return(
      <>
        <LoginForm/>
        <button onClick={getUsers}>Get Users</button>
      </>
    )
  }

  return (
    <div className="App">
        <h1>{store.isAuth ? `User was authorized - ${store.user.email}` : "User NOT auth"}</h1>
        <h1>{store.user.isActivated ? "User email: activated" : "ACTIVATE YOUR EMAIL"}</h1>
        <button onClick={()=> store.logout()}>Log out</button>
        <button onClick={getUsers}>Get Users</button>
        <div>
          {
            users.map(user=>
                <div key={user.email}>{user.email}</div>
              )
          }
        </div>
    </div>
  );
};

export default observer(App);
