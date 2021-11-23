import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
/*Importamos el componente modal que mostrará acorde a la selección
el formulario de actualización de datos*/
import Modal from "../Sucursales/Modal";
//Importmos cada uno de los formulario de actualización de datos.
import CambiarNombre from "./CambiarNombre";
import CambiarEmail from "./CambiarEmail";
import CambiarPassword from "./CambiarPassword";

export default function OpcionesCuenta(propiedades) {
  /*Recordemos que este componente se incrusta en la ventana de Logged,
    por los que recibimos la información del usuario, toast y el estado que
    indicará que al terminar un cambio se actualice el contenido en la
    ventana de Logged*/
  const { userInfo, toastRef, setRealoadUserInfo } = propiedades;
  //Estado que define si el modal es visible o no
  const [showModal, setShowModal] = useState(false);
  //Estado que controlará cual de los 3 componentes de cambio será visible
  const [renderComponent, setRenderComponent] = useState(null);
  /*Cada opción de actualización tiene una clave (Key) la cual se
 emplea en esta función para definir cual ventana debe ser visible*/
  const selectedComponent = (key) => {
    switch (key) {
      //Si la opción es actualizar el displayName
      case "displayName":
        //Se almacena el componente de CambiarNombre en el estado de renderización
        setRenderComponent(
          <CambiarNombre
            //Enviamos los parámetros que el componente requiere
            displayName={userInfo.displayName}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setRealoadUserInfo={setRealoadUserInfo}
          />
        );
        //Indicamos que el modal debe visualizarse
        setShowModal(true);
        break;
      //Si la opción es actualizar email
      case "email":
        //Se almacena el componente de CambiarEmail en el estado de renderización
        setRenderComponent(
          <CambiarEmail
            //Enviamos los parámetros que el componente requiere
            email={userInfo.email}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setRealoadUserInfo={setRealoadUserInfo}
          />
        );
        //Indicamos que el modal debe visualizarse
        setShowModal(true);
        break;
      //Si la opción es actualizar password
      case "password":
        //Se almacena el componente de CambiarEmail en el estado de renderización
        setRenderComponent(
          <CambiarPassword
            //Enviamos los parámetros que el componente requiere
            setShowModal={setShowModal}
            toastRef={toastRef}
          />
        );
        //Indicamos que el modal debe visualizarse
        setShowModal(true);
        break;
      default:
        /*Si no es ninguna de las opciones se limpia el estado de renderizado
    y el estado que indica que el modal debe ocultarse*/
        setRenderComponent(null);
        setShowModal(false);
        break;
    }
  };
  /*Los accesos a los formularios se mostrarán en un menú tipo lista
 cada opción del menú se obtiene de la función generateOptions que recibe
 el selectedComponent para activarlos al dar clic en un elemento de la lista*/
  const menuOptions = generateOptions(selectedComponent);
  return (
    <View>
      {/*La función map permite recorrer la lista de menú para estructurar
 su visualizaciómn */}
      {map(menuOptions, (menu, index) => (
        /*Para cada elemento del menú se asigna la clave, evento clic,
 iconos, texto a mostrar y estilos*/
        <ListItem
          key={index}
          containerStyle={styles.menuItem}
          onPress={menu.onPress}
        >
          <Icon
            name={menu.iconNameLeft}
            type={menu.iconType}
            color={menu.iconColorLeft}
          />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            name={menu.iconNameRight}
            type={menu.iconType}
            color={menu.iconColorRight}
          />
        </ListItem>
      ))}
      {/*Si el estado encargado de contener el componente a renderizar contiene algo
 se activa el componente Modal, el cual se hace visible y recibe el componente
 que debe visualizar*/}
      {renderComponent && (
        <Modal isVisible={showModal} setIsVisible={setShowModal}>
          {renderComponent}
        </Modal>
      )}
    </View>
  );
}

//Función encargada de definir la lista de opciones que se mostrará en pantalla
function generateOptions(selectedComponent) {
  return [
    {
      title: "Cambiar Nombre y Apellidos",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      /*Al seleccionar el elemento de la lista se activa el evento selectedComponent enviando la clave
    del formulario que se debe mostrar*/
      onPress: () => selectedComponent("displayName"),
    },
    {
      title: "Cambiar Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComponent("email"),
    },
    {
      title: "Cambiar contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComponent("password"),
    },
  ];
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
});
