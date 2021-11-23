import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import firebase from "firebase/compat/app";
import { reautenticar } from "../../utils/api";

export default function CambiarPassword(propiedades) {
  /*Recuperamos el componente modal que nos dará
    para mostrar el formulario como ventana emergente y toast*/
  const { setShowModal, toastRef } = propiedades;
  /*como el password es una atributo de inicio de sesión es necesario
    que el usuario se reutentique por lo que requerimos el password que se
    procesará en este estado y podrá ser visible o no*/
  const [showPassword, setShowPassword] = useState(false);
  //estados para almacenar datos del formulario
  const [formData, setFormData] = useState(defualtValue());
  //estado para manejar errores
  const [errors, setErrors] = useState({});
  //estado para conocer si un proceso esta activo
  const [isLoading, setIsLoading] = useState(false);
  //Si cambia el texto de los campos del formulario se actualiza es estado
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };
  const onSubmit = async () => {
    /*validaciones, a diferencia de las validaciones anteriores el estado de errores
        Almacenará el error de cada campo de tal forma que los imprimiremos como texto
        bajo el campo del formulario correspondiente*/
    let isSetErrors = true;
    let errorsTemp = {};
    setErrors({});
    if (
      !formData.password ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      errorsTemp = {
        password: !formData.password
          ? "La contraseña no puede estar vacía."
          : "",
        newPassword: !formData.newPassword
          ? "La contraseña no puede estar vacia."
          : "",
        repeatNewPassword: !formData.repeatNewPassword
          ? "La contraseña no puede estar vacía."
          : "",
      };
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      errorsTemp = {
        newPassword: "Las contraseñas no son iguales",
        repeatNewPassword: "Las contraseñas no son iguales",
      };
    } else if (size(formData.newPassword) < 6) {
      errorsTemp = {
        newPassword: "La contraseña tiene que ser mayor a 5 caracteres.",
        repeatNewPassword: "La contraseña tiene que ser mayor a 5 caracteres.",
      };
    } else {
      //inicia el proceso de actualización de password
      setIsLoading(true);
      /*Se emplean el correo actual y password ingresados para reautenticar
                reautenticar es una función contenida en el archivo api.js*/
      await reautenticar(formData.password)
        .then(async () => {
          /*Si la reautenticación fue correcta se inicia el proceso
                de actualización de password*/
          await firebase
            .auth()
            .currentUser.updatePassword(formData.newPassword)
            .then(() => {
              /*si todo es correcto se limpian los errors, es estado de carga
                se coloca en false, se indica el cierre de la ventana emergente (modal)
                y se cierra cesión actual ya que la contraseña cambio*/
              isSetErrors = false;
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
            })
            .catch(() => {
              errorsTemp = {
                other: "Error al actualizar la contraseña",
              };
              setIsLoading(false);
            });
        })
        .catch(() => {
          errorsTemp = {
            password: "La contraseña no es correcta.",
          };
          setIsLoading(false);
        });
    }
    isSetErrors && setErrors(errorsTemp);
  };
  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errors.password}
      />
      <Input
        placeholder="Nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "newPassword")}
        errorMessage={errors.newPassword}
      />
      <Input
        placeholder="Repetir nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "repeatNewPassword")}
        errorMessage={errors.repeatNewPassword}
      />
      <Button
        title="Cambiar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
      <Text>{errors.other}</Text>
    </View>
  );
}
//Se inicializa el estado de datos vacios por default
function defualtValue() {
  return {
    password: "",
    newPassword: "",
    repeatNewPassword: "",
  };
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
