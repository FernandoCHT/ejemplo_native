import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import Login from "../screens/Account/Login";
import Cuentas from "../screens/Account/Cuentas";
import Registrar from "../screens/Account/Registrar";

export default function RutasCuenta(){
    
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="cuentas"
            component={Cuentas}
            options={{title:"Mi Cuenta"}}
            />
         <Stack.Screen 
            name="login"
            component={Login}
            options={{title:"Iniciar Sesión"}}
            />

        <Stack.Screen 
            name="registrar"
            component={Registrar}
            options={{title:"Regístrate"}}
            />
        </Stack.Navigator>
    );
}
