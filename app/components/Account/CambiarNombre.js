import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import firebase from "firebase/compat/app";
export default function CambiarNombre(propiedades) {
  /*Recuperamos el nombre del usuario, el componente modal que nos dará para mostrar
el formulario como ventana emergente, toast y el estado para recargar
los datos en la ventana de usuario*/
  const { displayName, setShowModal, toastRef, setRealoadUserInfo } =
    propiedades;
  //Como este componente se encargara de registrar y actualizar nombre generamos su estado
  const [newDisplayName, setNewDisplayName] = useState(null);
  //estado para manejar errores
  const [error, setError] = useState(null);
  //estado para conocer si un proceso esta activo
  const [isLoading, setIsLoading] = useState(false);
  //si damos clic en el botón de cambiar nombre se ejecuta el submit
  const onSubmit = () => {
    setError(null);
    //Validaciones
    if (!newDisplayName) {
      setError("El nombre no puede estar vacio.");
    } else if (displayName === newDisplayName) {
      setError("El nombre no puede ser igual al actual.");
    } else {
      //inicia el proceso de actualización de nombre
      setIsLoading(true);
      const update = {
        //se actualiza el estado con el nuevo nombre
        displayName: newDisplayName,
      };
      //se accede a los datos del usuario y de actualiza el nombre en firebase
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          /*si todo es correcto es estado de carga se coloca en false
 se indica la recarga la información del usuario
 y se indica el cierre de la ventana emergente (modal)*/
          setIsLoading(false);
          setRealoadUserInfo(true);
          setShowModal(false);
        })
        .catch(() => {
          setError("Error al actualizar el nombre.");
          setIsLoading(false);
        });
    }
  };
  return (
    <View style={styles.view}>
      {/*Nuestro formulario en esta ocasión solo permitirá registrar el nombre del usuario */}
      <Input
        placeholder="Nombre y apellidos"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        /*Si ya existe un nombre registrado lo muestra si no se ve el texto
    Nombre y Apellido*/
        defaultValue={displayName || "Nombre y apellido"}
        //Si se modifica se cambia la variable de estado que contiene el nombre del user
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        errorMessage={error}
      />
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        //Se ejecuta la función onSubmit
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#0A6ED3",
  },
});
