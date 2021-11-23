import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Rating } from "react-native-elements";
import { map } from "lodash";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);
import { useFocusEffect } from "@react-navigation/native";

export default function Reviews(propiedades) {
  const { navigation, id, nombre } = propiedades;
  const [userLogged, setUserLogged] = useState(false);
  const [reviews, setReviews] = useState([]);

  //Verificamos si hay sesión activa
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  /* useFocusEffect muestra automáticamente los comentarios
  de la sucursarl, asi como el rating al momento de registrar un
  nuevo comentario */

  useFocusEffect(
    useCallback(() => {
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
      {/* Si hay sesion activa muestra la opción agregar opinion */}

      {map(reviews, (review, index) => (
        <Review key={index} review={review} />
      ))}
    </View>
  );
}

function Review(propiedades) {
  const { title, review, rating, createAt } = propiedades.review;
  const createReview = new Date(createAt.seconds * 1000);

  /* Se devuelve el rnkimg de la sucursal*/
  return (
    <View style={styles.viewReview}>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imagenSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {createReview.getDate()}/{createReview.getMonth() + 1}/
          {createReview.getUTCFullYear()} - {createReview.getHours()}:
          {createReview.getMinutes() < 10 ? "0" : ""}
          {createReview.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    /* backgroundColor: "trasparent", */
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
