import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Rating } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { map } from "lodash";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

function Review(propiedades) {
  const { title, review, rating, createAt } = propiedades.review;
  //Convertimos la fecha Timestamp de firebase a una fecha de JavaScript
  //Con una precision de millisecond.

  const createReview = new Date(createAt.seconds * 1000);
  return (
    <View style={styles.viewReview}>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {/*Extraemeo de la fecha los valores por separado */}
          {createReview.getDate()}/{createReview.getMonth() + 1}/
          {createReview.getFullYear()} - {createReview.getHours()}:
          {createReview.getMinutes() < 10 ? "0" : ""}
          {createReview.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

export default function Reviews(propiedades) {
  //recibe la navegación de la ventana anterior
  // para regresar después de registrar la puntuación
  //y el id de la sucursal que se actualizará
  const { navigation, id, nombre } = propiedades;
  //Solo se permitirá registrar comentarios y valuación si existe sesión
  const [userLogged, setUserLogged] = useState(false);
  //estado que almacenará las puntuaciones registradas
  const [reviews, setReviews] = useState([]);
  //Validamos la existencia de sesión
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      //consultamos la colección de reviews de la sucursal y almacenamos
      // los documentos en el useState de reviews
      db.collection("reviews")
        .where("idSucursal", "==", id)
        .get()
        .then((response) => {
          const resultReview = [];
          response.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            resultReview.push(data);
          });
          setReviews(resultReview);
        });
    }, [])
  );

  return (
    <View>
      {/*Si el usuario tiene sesión activa se permite registrar la opinión y voto,
        aparecerá un botón para abrir la ventana de votación*/}
      {userLogged ? (
        <Button
          title="Escribe una opinión"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#0A6ED3",
          }}
          onPress={() =>
            navigation.navigate("add-review-sucursal", {
              id: id,
              nombre: nombre,
            })
          }
        />
      ) : (
        <View>
          {/*Si no hay sesión se solicita inicias sesión redirigiendo
            a la ventana de login */}
          <Text
            style={{ textAlign: "center", color: "#0A6ED3", padding: 20 }}
            onPress={() => navigation.navigate("login")}
          >
            Para escribir un comentario es necesario estar logeado{" "}
            <Text style={{ fontWeight: "bold" }}>
              pulsa AQUÍ para iniciar sesión
            </Text>
          </Text>
        </View>
      )}
      {/* cada review recuperado de la BD y almacenado en el useState
            Se visualizará con la estructura definida en la función Review */}
      {map(reviews, (review, index) => (
        <Review key={index} review={review} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#0A6ED3",
  },
  viewReview: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#0A6ED3",
    borderBottomWidth: 1,
    backgroundColor: "white",
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
