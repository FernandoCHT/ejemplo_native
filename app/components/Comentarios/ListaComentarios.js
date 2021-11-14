import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";

export default function ListaComentarios(propiedades) {
  const { comentarios } = propiedades;

  return (
    <View>
      {size(comentarios) > 0 ? (
        <FlatList
          data={comentarios}
          renderItem={(comentarios) => (
            <Comentarios comentarios={comentarios} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.comentarios}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando Comentarios</Text>
        </View>
      )}
    </View>
  );
}

function Comentarios(propiedades) {
  //Recibe la lista de comentarios
  const { comentarios } = propiedades;
  //en cada iteración obtiene los datos del comentario
  const { comentario, descripcion } = comentarios.item;
  //Método que se ejecutará al dar clic a los items de la lista
  const consultarComentario = () => {
    console.log("consultando");
  };
  return (
    //Agregamos el clic a cada item al dar clic el item se opaca
    <TouchableOpacity onPress={consultarComentario}>
      {/*Esturctura de cada item */}
      <View style={styles.lista}>
        {/*Mostramos los datos adicionales del comentario, en el caso de la descripción dado que puede ser
        larga limitamos el texto a mostrar*/}
        <View>
          <Text style={styles.comentario}>{comentario}</Text>
          <Text style={styles.descripcion}>
            {descripcion.substring(0, 500)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  comentarios: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  lista: {
    flexDirection: "row",
    margin: 10,
  },
  comentario: {
    fontWeight: "bold",
  },
  descripcion: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
});
