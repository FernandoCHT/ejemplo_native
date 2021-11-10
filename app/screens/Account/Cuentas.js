import React, {useState,useEffect} from "react";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import { View, Text } from "react-native";

import Logged from "./Logged";
import Invitado from "./Invitado";

export default function Cuentas(){
    const [login, setLogin]=useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user)=>{
            !user ? setLogin(false): setLogin(true)
        });
    },[]);

    if(login === null) return <Text>Cargando...</Text>;
        return login ? <Logged/>: <Invitado/>;
       
}