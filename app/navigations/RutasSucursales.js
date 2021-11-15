import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddReview from "../screens/Sucursales/AddReview";

const Stack = createNativeStackNavigator();

import Sucursales from "../screens/Sucursales/Sucursales";
import AgregarSuc from "../screens/Sucursales/AgregarSuc";
import Sucursal from "../screens/Sucursales/Sucursal";

export default function RutasSucursales() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="sucursal"
        component={Sucursales}
        options={{ title: "Sucursales" }}
      />
      <Stack.Screen
        name="agregar-suc"
        component={AgregarSuc}
        options={{ title: "Nueva Sucursal" }}
      />
      <Stack.Screen name="ver_sucursal" component={Sucursal} />

      <Stack.Screen name="add-review-sucursal" component={AddReview} />
    </Stack.Navigator>
  );
}
