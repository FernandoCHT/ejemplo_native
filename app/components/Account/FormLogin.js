import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
//Importamos
import { Input, Icon, Button } from "react-native-elements";

//Validar campos
import {validarEmail} from "../../utils/validaciones";
import {size, isEmpty} from "lodash";

//Agregaremos la funcionalidad de redireccionamiento del usuario Logeado
import {useNavigation} from "@react-navigation/native"

import firebase from 'firebase/compat/app'

export default function FormLogin(toast){
    const {toastRef}=toast

    //Activando visualización de Contraseña
    const [mostrar, setMostrar]=useState(false);

    //ALMACENANDO USUARIO EN UN ESTADO
    const [datos, setDatos] = useState(valoresLogin);

    const navigation =useNavigation();

    //Modificaremos el método onSubmit para agregar las validaciones
    const onSubmit = () => {
            //Verificamos que no se envíen datos vacíos
            if(isEmpty(datos.email) || isEmpty(datos.password)) {
                toastRef.current.show("No puedes dejar campos vacios")
            }//Validados la estructura del email
            else if(!validarEmail(datos.email)){
                toastRef.current.show("Estructura del email incorrecta")
            }
            else{
                firebase.auth().signInWithEmailAndPassword(datos.email,datos.password)
                .then(respuesta =>{
                    navigation.navigate("cuentas");
                })
                .catch(()=>{
                    toastRef.current.show("El correo electrónico o la contraseña son incorrectos")
                });
            }
    };

    const onChange = (e, type) => {
        setDatos({...datos, [type]:e.nativeEvent.text});
    }

    return(
        //Generacion del formulario
        <View style={StyleSheet.formContainer}>
            <Input
            placeholder="Correo Electrónico" 
            containerStyle={StyleSheet.inputForm}
            //activará el evento de recuperación anterior
            onChange={(e)=> onChange(e,"email")}
            //Agregando iconos
            rightIcon={
                <Icon
                type="material-community-icon"
                name="alternate-email"
                iconStyle={styles.icono}
                /> 
                }
            />
            <Input
            placeholder="Contraseña"
            containerStyle={styles.inputForm}
            password={true}
            secureTextEntry={mostrar?false:true}
            onChange={(e)=> onChange(e,"password")}
            //Agregando iconos
            rightIcon={
                <Icon
                type="material-community-icon"
                //Activando visualización de Contraseña
                name={mostrar?"visibility":"visibility-off"}
                iconStyle={styles.icono}
                onPress={() => setMostrar(!mostrar)}
                />
                }
            />

            <Button
            title="Iniciar Sesión"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            //Agregamos el evento onPress al botón para activar el evento on Submit que nos imprime el resultado del estado en consola
            onPress={onSubmit}
            />
        </View>
    )
}

function valoresLogin(){
    return{
        email:"",
        password:"",
    };
}

//Generacion del formulario
const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:30,
    },
    inputForm: {
        width:"100%",
        marginTop:20,
    },
    btnContainer: {
        marginTop:20,
        width:"100%",
    },
    btn: {
        backgroundColor:"#0A6ED3",
    },
    icono: {
        color:"#c1c1c1"
        }
}) 