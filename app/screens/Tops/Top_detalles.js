import React from "react";
import { View, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import CarouselImagenes from "../../components/CarouselImagenes";
const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;
import { map } from "lodash";
import { Rating, ListItem, Icon } from "react-native-elements";
import Reviews from "../../components/Sucursales/Reviews";
import { useFocusEffect } from "@react-navigation/native";

export default function Top_detalles(propiedades) {
  const { navigation, route } = propiedades;
  const { id, nombre } = route.params;

  const [sucursal, setSucursal] = useState(null);
  const { rating, setRating } = useState(0);

  useEffect(() => {
    navigation.setOptions({ title: nombre });
  }, []);

  //useFocusEffect muestra automáticamente la
  useFocusEffect(
    useCallback(() => {
      db.collection("sucursales")
        .doc(id)
        .get()
        .then((resp) => {
          const datos = resp.data();
          datos.id = resp.id;
          setSucursal(datos);
        });
    }, [])
  );
  return (
    <View>
      <Text> Tops !!</Text>
    </View>
  );
}
