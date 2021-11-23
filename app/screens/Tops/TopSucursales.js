import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
//Lista tops nos ayudara a el muestreo de las topsucursales
import ListaTops from "../../components/Tops/ListaTops";
const db = firebase.firestore(firebaseApp);

export default function TopSucursales() {
  const navegacion = useNavigation();
  //useState de sesion
  const [usuario, setUsuario] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [totalSuc, setTotalSuc] = useState(0);
  const [puntero, setPuntero] = useState(null);
  //Use eseEffect para consulta a sucursales en la especificamos que nos devuelva el rting
  useFocusEffect(
    useCallback(() => {
      db.collection("sucursales")
        .get()
        .then((res) => {
          setTotalSuc(res.size);
        });

      const arrSucursales = [];
      db.collection("sucursales")
        /* ordenando las sucursales*/
        .orderBy("rating", "desc")
        /*máximo de 5 sucursales */
        .limit(5)
        .get()
        .then((res) => {
          setPuntero(res.docs[res.docs.length - 1]);
          res.forEach((doc) => {
            const sucursal = doc.data();
            sucursal.id = doc.id;
            arrSucursales.push(sucursal);
          });
          setSucursales(arrSucursales);
        });
    }, [])
  );
  return (
    <View>
      <ListaTops sucursales={sucursales} />
    </View>
  );
}
