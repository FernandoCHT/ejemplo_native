import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import {firebaseApp} from "../../utils/firebase";
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

export default function Comentarios(){
    const navegacion = useNavigation();


    return(
        <View style={styles.vista}>
            <Text>Comentarios!!</Text>

            <Icon
                reverse
                type="material_community"
                name="add"
                color="#0A6ED3"
                containerStyle={styles.btn}
                onPress={() => navegacion.navigate("agregar-com")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    vista:{
        flex:1,
        backgroundColor:"#FFFF",
    },
    btn:{
        position:"absolute",
        bottom:10,
        right:10,
        shadowColor:"black",
        shadowOffset:{width:2, height:2},
        shadowOpacity:0.5,
    }
})