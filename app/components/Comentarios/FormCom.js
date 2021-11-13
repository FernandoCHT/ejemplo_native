import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import uuid from "random-uuid-v4";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

export default function FormCom(toast) {
  const [comentario, setComentario] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { toastRef } = toast;

  const navegacion = useNavigation();

  const agregar = () => {
    if (!comentario || !descripcion) {
      toastRef.current.show("No puedes dejar campos vacios");
    } else {
      db.collection("comentarios")
        .add({
          comentario: comentario,
          descripcion: descripcion,
          creado: new Date(),
          creadoPor: firebase.auth().currentUser.uid,
        })
        .then(() => {
          navegacion.navigate("comentario");
        })
        .catch(() => {
          toastRef.current.show("No es posible registrar el comentario");
        });
    }
  };
  return (
    <ScrollView style={styles.scroll}>
      <Formulario
        setComentario={setComentario}
        setDescripcion={setDescripcion}
      />
      <Button title="Registrar" buttonStyle={styles.btn} onPress={agregar} />
    </ScrollView>
  );
}

function Formulario(propiedades) {
  const { setComentario, setDescripcion } = propiedades;

  return (
    <View style={styles.vista}>
      <Input
        placeholder="Comentario"
        containerStyle={styles.form}
        onChange={(e) => setComentario(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setDescripcion(e.nativeEvent.text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    height: "100%",
  },
  form: {
    marginLeft: 10,
    marginRight: 10,
  },
  vista: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },

  btn: {
    backgroundColor: "#0A6ED3",
    margin: 20,
  },
});
