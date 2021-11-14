import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import ListaComentarios from "../../components/Comentarios/ListaComentarios";
import { useFocusEffect } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

export default function Comentarios() {
  const navegacion = useNavigation();

  //useState para arreglo de Comentarios
  const [comentarios, setComentarios] = useState([]);
  //useState para contar comentarios
  const [totalCom, setTotalCom] = useState(0);
  //useState para mantener el control de los comentarios a mostrar
  const [puntero, setPuntero] = useState(null);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUsuario(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("comentarios")
        .get()
        .then((res) => {
          setTotalCom(res.size);
        });

      const arrComentarios = [];
      db.collection("comentarios")
        .orderBy("creado", "desc")
        .limit(50)
        .get()
        .then((res) => {
          setPuntero(res.docs[res.docs.length - 1]);
          res.forEach((doc) => {
            //extraemos cada documento y lo almacenamos en un objeto comentario
            const comentario = doc.data();
            //la clave del comentario no asigna a menos que lo indiquemos
            comentario.id = doc.id;
            //almacenamos cada comentario en un arreglo.
            arrComentarios.push(comentario);
          });
          //Al terminar de recuperar todos los documentos los almacenamos en el useState comentarios
          setComentarios(arrComentarios);
        });
    }, [])
  );

  //Consultando comentarios

  return (
    <View style={styles.vista}>
      <ListaComentarios comentarios={comentarios} />

      {/*Colocaremos un botón de agregar nuevo COMENTARIO
        solo será visible si tenemos una sesión activa*/}
      {usuario && (
        <Icon
          reverse
          type="material_community"
          name="add"
          color="#0A6ED3"
          containerStyle={styles.btn}
          onPress={() => navegacion.navigate("agregar-com")}
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
