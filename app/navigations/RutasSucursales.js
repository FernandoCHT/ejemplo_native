import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import Sucursales from "../screens/Sucursales/Sucursales"
import AgregarSuc from "../screens/Sucursales/AgregarSuc";
export default function RutasSucursales(){
    
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="sucursal"
            component={Sucursales}
            options={{title:"Sucursales"}}
            />
         <Stack.Screen 
            name="agregar-suc"
            component={AgregarSuc}
            options={{title:"Nueva Sucursal"}}
            />

        </Stack.Navigator>
    );
}