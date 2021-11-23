import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TopSucursales from "../screens/Tops/TopSucursales";
import SucursalDetalles from "../screens/Tops/sucursalDetalles";
const Stack = createNativeStackNavigator();

export default function RutasComentarios() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="topsSucursales"
        component={TopSucursales}
        options={{ headerTitle: "Las 5 mejores sucursales" }}
      />
      <Stack.Screen
        name="sucursalDetalles"
        component={SucursalDetalles}
        /* options={{ headerShown: false }} */
      />
    </Stack.Navigator>
  );
}
