import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import LoginForm from "./components/loginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

function App() {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers () {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) {
        return <div>Loading...</div>
    }

    if(!store.isAuth) {
        return (
            <LoginForm/>
        )
    }

    return (
        <div>
            <h1>{store.isAuth ? `You are logged into your account ${store.user.email}` : "Login to your account"}</h1>
            <h1>{store.user.isActivated ? 'Account verified' : 'Account not verified'}</h1>
            <p>{store.user.isActivated ? '' : 'To confirm your account, follow the link in your email.'}</p>
            <button onClick={() => store.logout()}>Log Out</button>
            <div>
                <button onClick={getUsers}>Get Users</button>
            </div>

            {users != undefined ? users.map(user =>
                    <div key={user.email}>{user.email}</div>
                ) : <div></div> }



        </div>
    );
}

export default observer (App);
