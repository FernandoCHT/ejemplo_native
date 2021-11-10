import React, {useState, useRef} from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast from "react-native-easy-toast";

import FormSuc from "../../components/Sucursales/FormSuc";

export default function AgregarSuc(){

    const toastRef = useRef();
    return(
        <View>
            <FormSuc
            toastRef={toastRef}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </View>
    )
}

const styles = StyleSheet.create({})