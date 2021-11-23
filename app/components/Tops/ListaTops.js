import { size } from "lodash";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Rating } from "react-native-elements";

export default function ListaTops(propiedades) {
  const { sucursales } = propiedades;
  const { rating, setRating } = useState(0);
  //A continuacion se devuelve la vita de nuestras top sucursales
  return (
    <View>
      {size(sucursales) > 0 ? (
        <FlatList
          data={sucursales}
          renderItem={(sucursales) => <Sucursales sucursales={sucursales} />}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.sucursales}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando Sucursales</Text>
        </View>
      )}
    </View>
  );
}

function Sucursales(propiedades) {
  const { sucursales } = propiedades;
  /* Incorporamos el valor de rating de las sucursales */
  const { imagenes, nombre, direccion, descripcion, id, rating } =
    sucursales.item;
  const navegacion = useNavigation();
  //si el usuario selecciona uan sucursal nos llevará a la vita a detalle de esa sucursal
  const consultar = () => {
    navegacion.navigate("sucursalDetalles", { id, nombre });
  };

  return (
    <TouchableOpacity onPress={consultar}>
      <View style={styles.lista}>
        {/* Con la etiqueta rating se genera la vita con las esterllas*/}
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
        <View style={styles.viewImagen}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#0000ff" />}
            source={
              imagenes[0]
                ? { uri: imagenes[0] }
                : require("../../../assets/img/no-encontrada.png")
            }
            style={styles.imagen}
          />
        </View>
        <View>
          <Text style={styles.nombre}>{nombre}</Text>

          <Text style={styles.direccion}>{direccion}</Text>
          <Text style={styles.descripcion}>
            {descripcion.substring(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sucursales: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  lista: {
    flexDirection: "row",
    margin: 10,
  },
  viewImagen: {
    marginRight: 15,
  },
  imagen: {
    width: 80,
    height: 80,
  },
  nombre: {
    fontWeight: "bold",
  },
  direccion: {
    paddingTop: 2,
    color: "grey",
  },
  descripcion: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  rating: {
    position: "absolute",
    right: 0,
  },
});
