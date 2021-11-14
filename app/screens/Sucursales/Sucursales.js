import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import ListaSucursales from "../../components/Sucursales/ListaSucursales";
import { useFocusEffect } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

export default function Sucursales() {
  const navegacion = useNavigation();

  const [sucursales, setSucursales] = useState([]);
  const [totalSuc, setTotalSuc] = useState(0);
  const [puntero, setPuntero] = useState(null);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUsuario(userInfo);
    });
  }, []);

  //Visualizar nuevas sucursales registradas

  useFocusEffect(
    useCallback(() => {
      /*accedemos a la colección de sucursales, consultamos los registros
    con get y atrapamos la respuesta (se retorna una promesa con la lista sucursales)
    contamos y asignamos el total de sucursales al useState totalSuc*/
      db.collection("sucursales")
        .get()
        .then((res) => {
          setTotalSuc(res.size);
        });

      const arrSucursales = [];
      db.collection("sucursales")
        .orderBy("creado", "desc")
        .limit(10)
        .get()
        .then((res) => {
          setPuntero(res.docs[res.docs.length - 1]);
          res.forEach((doc) => {
            //extraemos cada documento y lo almacenamos en un objeto sucursal
            const sucursal = doc.data();
            //la clave de la sucursal no asigna a menos que lo indiquemos
            sucursal.id = doc.id;
            //almacenamos cada sucursal en un arreglo.
            arrSucursales.push(sucursal);
          });
          //Al terminar de recuperar todos los documentos los almacenamos en el useState sucursales
          setSucursales(arrSucursales);
        });
    }, [])
  );

  //Consultando sucursales

  return (
    <View style={styles.vista}>
      <ListaSucursales sucursales={sucursales} />

      {usuario && (
        <Icon
          reverse
          type="material_community"
          name="add"
          color="#0A6ED3"
          containerStyle={styles.btn}
          onPress={() => navegacion.navigate("agregar-suc")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  vista: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
  btn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
