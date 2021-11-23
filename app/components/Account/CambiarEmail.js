import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import firebase from "firebase/compat/app";
import { validarEmail } from "../../utils/validaciones";
import { reautenticar } from "../../utils/api";

export default function CambiarImail(props) {
  /*Recuperamos el email del usuario, el componente modal que nos dará
    para mostrar el formulario como ventana emergente, toast y el estado
    para recargar los datos en la ventana de usuario*/
  const { email, setShowModal, toastRef, setRealoadUserInfo } = props;
  //estados para almacenar datos del formulario
  const [formData, setFormData] = useState(defaultValue());
  /*como el mail es una atributo de inicio de sesión es necesario
    que el usuario se reutentique por lo que requerimos el password que se
    procesará en este estado y podrá ser visible o no*/
  const [showPassword, setShowPassword] = useState(false);
  //estado para manejar errores
  const [errors, setErrors] = useState({});
  //estado para conocer si un proceso esta activo
  const [isLoading, setIsLoading] = useState(false);
  //Si cambia el texto del formulario se actualiza es estado
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };
  //si damos clic en el boton de cambiar email se ejecuta el submit
  const onSubmit = () => {
    /*validaciones, a diferencia de las validaciones anteriores el estado de errores
    almacenara el error de cada campo de tal forma que los imprimiremos como texto
    bajo el campo del formulario correspondiente*/
    setErrors({});
    if (!formData.email || email === formData.email) {
      setErrors({
        email: "El email no ha cambiado.",
      });
    } else if (!validarEmail(formData.email)) {
      setErrors({
        email: "Email incorrecto.",
      });
    } else if (!formData.password) {
      setErrors({
        password: "La contraseña no puede estar vacía.",
      });
    } else {
      //inicia el proceso de actualización de email
      setIsLoading(true);
      /*Se emplean el correo actual y password ingresados para reautenticar
        reautenticar es una función contenida en el archivo api.js*/
      reautenticar(formData.password)
        .then(() => {
          /*Si la reautenticación fue correcta se inicia el proceso
        de actualización de email*/
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              /*si todo es correcto es estado de carga se coloca en false
        se indica la recarga la información del usuario
        y se indica el cierre de la ventana emergente (modal)*/
              setIsLoading(false);
              setRealoadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente");
              setShowModal(false);
            })
            .catch(() => {
              setErrors({ email: "Error al actualizar el email." });
              setIsLoading(false);
            });
        })
        .catch(() => {
          setIsLoading(false);
          setErrors({ password: "La contraseña no es correcta." });
        });
    }
  };
  return (
    <View style={styles.view}>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.input}
        //Se muestra el correo actual o nada si no existe correo
        defaultValue={email || ""}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        //Si existe un error de email se muestra bajo el campo
        errorMessage={errors.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        password={true}
        //empleamos el proceso de ocultar y mostrara contraseña
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
      <Button
        title="Cambiar email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        //Se ejecuta la función onSubmit
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
}

//Se inicializa el estado de datos vacíos por default
function defaultValue() {
  return {
    email: "",
    password: "",
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
