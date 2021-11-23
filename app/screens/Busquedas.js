import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon, Avatar } from "react-native-elements";
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { FireSQL } from "firesql";

const db = firebase.firestore(firebaseApp);
const fireSQL = new FireSQL(db, { includeId: "id" });

export default function Busquedas(propiedades) {
  const { navigation } = propiedades;
  const [search, setSearch] = useState("");
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM sucursales WHERE nombre LIKE '${search}%'`)
        .then((respose) => {
          setSucursales(respose);
        });
    }
  }, [search]);
  return (
    <View>
      <SearchBar
        placeholder="Busca una sucursal..."
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />

      {sucursales.length === 0 ? (
        <NoFound />
      ) : (
        <FlatList
          data={sucursales}
          renderItem={(sucursal) => (
            <Sucursal sucursal={sucursal} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function NoFound() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/sin-resultados.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

function Sucursal(propiedades) {
  const { sucursal, navigation } = propiedades;

  const { id, nombre, imagenes } = sucursal.item;

  return (
    <ListItem
      onPress={() => navigation.navigate("ver_sucursal", { id, nombre })}
    >
      <Avatar
        source={
          imagenes[0]
            ? { uri: imagenes[0] }
            : require("../../assets/img/no-encontrada.png")
        }
      />
      <ListItem.Content>
        <ListItem.Title>{nombre}</ListItem.Title>
      </ListItem.Content>
      <Icon type="material-community" name="chevron-right" />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
});
