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
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;
import { map } from "lodash";
import { Rating, ListItem, Icon } from "react-native-elements";
import Reviews from "../Tops/Reviews";
import { useFocusEffect } from "@react-navigation/native";

export default function SucursalDetalles(propiedades) {
  const { navigation, route } = propiedades;
  const { id, nombre } = route.params;

  const [sucursal, setSucursal] = useState(null);
  const { rating, setRating } = useState(0);

  //guardamos el nombre de la sucursal
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
      {sucursal ? (
        <ScrollView vertical>
          {/* Datos de la sucursal*/}
          <Informacion
            nombre={sucursal.nombre}
            direccion={sucursal.direccion}
            descripcion={sucursal.descripcion}
            rating={sucursal.rating}
          />
          {/* Comentarios de la sucursal que provienen de nuestro archivo de reviews*/}
          <Reviews
            navigation={navigation}
            id={sucursal.id}
            nombre={sucursal.nombre}
          />
        </ScrollView>
      ) : (
        <View style={styles.sucursales}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando sucursal</Text>
        </View>
      )}
    </View>
  );
}

function Informacion(propiedades) {
  const { nombre, direccion, descripcion, rating } = propiedades;
  const listaItems = [
    //direccion
    {
      text: direccion,
      iconName: "google-maps",
      iconType: "material-community",
      action: null,
    },
    //datos fijos
    {
      text: "44 3278221",
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: "mail@gmail.com",
      iconName: "at",
      iconType: "material-community",
      action: null,
    },
  ];
  //Aquí esta la forma en como se mostrar la informacion de nuestras topsucursales
  return (
    <View style={styles.viewSucursal}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.descripcion}>{descripcion}</Text>
      </View>
      <View>
        <Text style={styles.subtitle}>Comentarios: </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sucursales: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  body: {
    /* flex: 1, */
    backgroundColor: "white",
  },
  viewSucursal: {
    padding: 15,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    paddingTop: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  descripcion: {
    marginTop: 5,
    color: "grey",
  },
  direccion: {
    marginTop: 5,
    color: "grey",
  },
  direccionTitulo: {
    fontWeight: "bold",
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  listaInfo: {
    borderBottomColor: "#D8D8D8",
    borderBottomWidth: 1,
  },
});
