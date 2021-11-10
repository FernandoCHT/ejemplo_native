import React, {useEffect} from 'react';
//Importamos la estructura de navegación creada
import Navegacion from './app/navigations/Navegacion';
import {firebaseApp} from './app/utils/firebase';


import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default function App() {
  useEffect(()=>{
    firebase.auth().onAuthStateChanged((user)=>{
      console.log(user);
  })
}, []);

  {/* retornamos como vista la estructura de navegación,
  por default se abrirá la página de Sucursales ya que
  es la definida en nuestro menú*/}
  return <Navegacion/>
}