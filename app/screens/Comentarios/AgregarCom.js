import React, { useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast from "react-native-easy-toast";

import FormCom from "../../components/Comentarios/FormCom";

export default function AgregarCom() {
  const toastRef = useRef();
  return (
    <View>
      <FormCom toastRef={toastRef} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
}

const styles = StyleSheet.create({});
