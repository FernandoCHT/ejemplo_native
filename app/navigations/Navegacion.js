import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import RutasSucursales from "./RutasSucursales";
import Favoritos from "../screens/Favoritos";
import TopSucursales from "../screens/TopSucursales"
import Busquedas from "../screens/Busquedas";
import RutasCuenta from "./RutasCuenta";

const Tab = createBottomTabNavigator();

export default function Navegacion(){
    return( 
        <NavigationContainer> 
            <Tab.Navigator
                
                initialRouteName="cuentas"
                tabBarStyle={ 
                    {
                        
                        tabBarInactiveTintColor:"#52585E",
                        
                        tabBarActiveTintColor:"#00a680",
                    } 
                }
                //para cada ruta cargada en el proyecto entonces =>
                screenOptions={({route})=> ({
                    /*Se asigna el color de la ruta al icono y se ejecuta la función
                    opciones que recibe la ruta del menú y color*/
                    tabBarIcon:({color})=> opciones(route,color),
                })}
            >
                {/*Muestra un botón que se vincula a nuestro componente importado*/}
                <Tab.Screen 
                name="sucursales" 
                component={RutasSucursales}
                options={{headerShown: false}}/>
                <Tab.Screen 
                name="favoritos"  
                component={Favoritos}
                options={{title:"Favoritos"}}/>
                <Tab.Screen 
                name="topsucursales" 
                component={TopSucursales}
                options={{title:"TopSucursales"}}/>
                <Tab.Screen 
                name="busquedas" 
                component={Busquedas}
                options={{title:"Busquedas"}}/>
                <Tab.Screen 
                name="cuentas" 
                component={RutasCuenta}
                options={{ headerShown: false}}/>
            </Tab.Navigator>
        </NavigationContainer>
 )
}

function opciones(ruta, color){
    let iconName;
    
    switch (ruta.name) {
        case "sucursales":
            //para buscar iconos https://materialdesignicons.com/
            iconName="home";
            break;
        case "favoritos":
            iconName="favorite";
            break;
        case "topsucursales":
            iconName="grade";
            break;
        case "busquedas":
            iconName="search";
            break;
        case "cuentas":
             iconName="person";
            break;
        default:
            break; 
    }
    return(
    <Icon type="material-comunity" name={iconName} size={22} color={color} />
    )
   }