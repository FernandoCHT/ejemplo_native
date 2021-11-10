import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";

export default function Invitado(){
    const navegacion=useNavigation();

    return(
        <ScrollView centerContent={true} style={styles.body}>
            <Image
                source={require("../../../assets/img/fondo.png")}
                resizeMethod="auto"
                style={styles.imagen}
            />
            <Text style={styles.titulo}>Ingresa a tu perfil</Text>
            <Text style={styles.parrafo}>
                
            </Text>
            <View>
                <Button
                title="Iniciar Sesión"
                type="solid"
                onPress={() => navegacion.navigate("login")}

                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body:{
        marginLeft:30,
        marginRight:30,
    },
    imagen:{
        height:320,
        width: "100%",
        marginBottom: 30,
        marginTop: 20,
    },
    titulo:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign:"center",
    },
    parrafo:{
        
    }
})