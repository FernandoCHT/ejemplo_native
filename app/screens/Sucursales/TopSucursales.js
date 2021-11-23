import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import ListaTop from "../../components/Sucursales/ListaTop";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

export default function TopSucursales() {
  const navegacion = useNavigation();

  //useState para arreglo de Sucursales
  const [reviews, setReviews] = useState([]);
  //useState para contar sucursales
  const [totalRev, setTotalRev] = useState(0);
  //useState para mantener el control de las sucursales a mostrar
  const [puntero, setPuntero] = useState(null);
  console.log(reviews);

  //useState de sesión
  const [usuario, setUsuario] = useState(null);
  //validamos sesión existente
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      //si existe una sesión activa asignamos los datos de sesión al useState usuario
      setUsuario(userInfo);
    });
  }, []);

  //Consultando sucursales
  useEffect(() => {
    /*accedemos a la colección de sucursales, consultamos los registros
  con get y atrapamos la respuesta (se retorna una promesa con la lista sucursales)
  contamos y asignamos el total de sucursales al useState totalSuc*/
    db.collection("reviews")
      .where("idSucursal", "==", id)
      .get()
      .then((res) => {
        setTotalRev(res.size);
      });
    const arrReviews = [];
    db.collection("reviews")
      .where("idSucursal", "==", id)
      .get()
      .then((res) => {
        setPuntero(res.docs[res.docs.length - 1]);
        res.forEach((doc) => {
          //extraemos cada documento y lo almacenamos en un objeto sucursal
          const review = doc.data();
          //la clave de la sucursal no asigna a menos que lo indiquemos
          review.id = doc.id;
          //almacenamos cada sucursal en un arreglo.
          arrReviews.push(review);
        });
        //Al terminar de recuperar todos los documentos los almacenamos en el useState sucursales
        setReviews(arrReviews);
      });
  }, []);
  return (
    <View style={styles.vista}>
      <ListaTop reviews={reviews} />
      {/*Colocaremos un botón de agregar nueva sucursal
    solo será visible si tenemos una sesión activa*/}
      {usuario && (
        <Icon
          reverse
          type="material_community"
          name="add"
          color="#0A6ED3"
          containerStyle={styles.btn}
          //Vinculamos el envio a la ruta agregar-suc
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
