import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import Comentarios from "../screens/Comentarios/Comentarios"
import AgregarCom from "../screens/Comentarios/AgregarCom";
export default function RutasComentarios(){
    
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="comentario"
            component={Comentarios}
            options={{title:"Comentarios"}}
            />
         <Stack.Screen 
            name="agregar-com"
            component={AgregarCom}
            options={{title:"Nuevo Comentario"}}
            />

        </Stack.Navigator>
    );
}