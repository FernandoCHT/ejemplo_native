import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

export default function InfoUsuario(propiedades) {
  const {
    userInfo: { uid, photoURL, displayName, email },
    toastRef,
    setCargando,
  } = propiedades;

  const cambiarAvatar = async () => {
    const resultPermiso = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    const solicitudPermiso = resultPermiso.permissions.mediaLibrary.status;

    if (solicitudPermiso === "denied") {
      toastRef.current.show("Es necesario aceptar los permisos de la galería");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,

        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show("Has cerrado la selección de imágenes");
      } else {
        subirImagen(result.uri)
          .then(() => {
            updatePhotoUrl();
          })
          .catch(() => {
            toastRef.current.show("Error al actualizar el avatar.");
          });
      }
    }
  };

  const subirImagen = async (uri) => {
    setCargando(true);
    toastRef.current.show("Realizando cambios ...");

    const response = await fetch(uri);

    const blob = await response.blob();

    const ref = firebase.storage().ref().child(`avatar/${uid}`);

    return ref.put(blob);
  };

  const updatePhotoUrl = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };

        await firebase.auth().currentUser.updateProfile(update);

        setCargando(false);
      })
      .catch(() => {
        toastRef.current.show("Error al actualizar el avatar.");
      });
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        onPress={cambiarAvatar}
        containerStyle={styles.userInfoAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/avatar-default.jpeg")
        }
      >
        <Avatar.Accessory size={24} />
      </Avatar>
      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "Anónimo"}
        </Text>

        <Text>{email ? email : "Login Social"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30,
  },
  userInfoAvatar: {
    marginRight: 20,
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
