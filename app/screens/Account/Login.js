import React, {useRef} from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";

//Importamos el formulario
import FormLogin from "../../components/Account/FormLogin";

//importamos la dependencia de toast
import Toast from 'react-native-easy-toast'

export default function Login(){
    
    const toastRef=useRef()
    return(
       <ScrollView>
           <Image
                source={require("../../../assets/img/user.png")}
                resizeMethod="auto"
                style={styles.usuario}
             />
           <View style={styles.contenedor}>
               <FormLogin toastRef={toastRef}/>
                <CrearCuenta/>
           </View>
           <Toast ref={toastRef} position="center" opacity={0.9}/>
           <Divider style={styles.divider} />
           <Text>Social Login</Text>
       </ScrollView>
    );
}

function CrearCuenta(){
    const navegacion=useNavigation();
    return (
        <Text style={styles.textRegistrar}>
            ¿Aún no tienes una cuenta?{" "}
            <Text
            style={styles.link}
            onPress={() => navegacion.navigate("registrar")}
            >
                Regístrate
            </Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    usuario: {
        width:"100%",
        height:150,
        marginTop:20,
    },
    contenedor: {
        marginRight:40,
        marginLeft:40,
    },
    textRegistrar: {
        marginTop:15,
        marginLeft:10,
        marginRight:10,
    },
    link: {
        color:"#0A6ED3",
        fontWeight:"bold",
    },
    divider: {
        backgroundColor:"#0A6ED3",
        margin:40,
    },
})