import React, {useState} from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import * as Permission from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

//Importamos la función map para recuperar las imagenes del arreglo
import {map, size, filter} from "lodash";

import uuid from "random-uuid-v4";
import {firebaseApp} from "../../utils/firebase";
import firebase from 'firebase/compat/app';
import "firebase/compat/storage";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);


const WidthScreen =Dimensions.get("window").width;

export default function FormSuc(toast){

    const [nombre, setNombre]=useState("");
    const [direccion, setDireccion]=useState("");
    const [descripcion, setDescripcion]=useState("");

    const {toastRef}=toast;

    const [imagenes, setImagenes]=useState([]);

    const navegacion=useNavigation();

    const agregar= () => {
        if(!nombre|| !direccion||!descripcion) { 
            toastRef.current.show("No puedes dejar campos vacios");
        }
        else if(size(imagenes)=== 0){
            toastRef.current.show("La sucursal debe tener al menos 1 imagen");
        }
        else{
            subirImagenesStorage()
                .then((resp)=>{
                    db.collection("sucursales")
                        .add({
                            nombre:nombre,
                            direccion:direccion,
                            descripcion:descripcion,
                            imagenes:resp,
                            rating:0,
                            ratingTotal:0,
                            votos:0,
                            creado:new Date(),
                            creadoPor: firebase.auth().currentUser.uid,
                        })
                        .then(()=>{
                            navegacion.navigate("sucursal");
                        }).catch(()=>{
                            toastRef.current.show("No es posible registrar la sucursal");
                        })
                });
            }
       
        };

    const subirImagenesStorage = async ()=>{
           
            const imagenesBlob =[];
            await Promise.all(
            map(imagenes, async (imagen) => {
                const response = await fetch(imagen);
                const blob = await response.blob();
                const ref = firebase.storage().ref("sucursales").child(uuid());
                await ref.put(blob).then(async (resultado) => {
                    await firebase.storage().ref(`sucursales/${resultado.metadata.name}`)
                    .getDownloadURL()
                    .then((urlFoto)=> {
                        imagenesBlob.push(urlFoto);
                    });
                });
            })
        );
        return imagenesBlob;
    };

    return(
       <ScrollView style={styles.scroll}>
           <ImagenPrincipal imagen={imagenes[0]}/>
           <Formulario
            setNombre={setNombre}
            setDireccion={setDireccion}
            setDescripcion={setDescripcion}
           />
           <SubirImagen 
           toastRef={toastRef}
           imagenes={imagenes}
           setImagenes={setImagenes}
           />
           <Button 
           title="Registrar"
           buttonStyle={styles.btn}
           onPress={agregar}
           />
       </ScrollView>
    );
}

function Formulario(propiedades){
    const{
        setNombre,
        setDireccion,
        setDescripcion
    } = propiedades;

    return(
        <View style={styles.vista}>
            <Input
                placeholder="Nombre"
                containerStyle={styles.form}
                onChange={(e)=> setNombre(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.form}
                onChange={(e)=> setDireccion(e.nativeEvent.text)}
            />
            <Input
                placeholder="Descripción"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e)=> setDescripcion(e.nativeEvent.text)}
            />
        </View>
    )
}

function SubirImagen(propiedades){
    const {toastRef, imagenes, setImagenes } = propiedades;
    const seleccionar= async() => {
    
        
        const resultado=await Permission.askAsync(
            Permission.MEDIA_LIBRARY
        );
   
    if(resultado=== "denied"){
        toastRef.current.show("Debes permitir el acceso a la galeria", 4000);
    }
    else{
        const result =await ImagePicker.launchImageLibraryAsync({
            allowsEditing:true,
            aspect:[4,3]
        });
        
        if(result.cancelled){
            toastRef.current.show("Debes seleccionar una imagen", 3000);
        }else{
            setImagenes([...imagenes,result.uri]);
            console.log(imagenes);
            }
    }
    };

    const eliminarImagen = (imagen) =>{//Recibimos la imagen a eliminar
        const copiaArreglo = imagenes;
        Alert.alert(//Alerta para confirmar eliminación
            //titulo
            "Eliminar Imagen",
            //Subtitulo
            "¿Estás seguro de que deseas eliminar la imagen?",
            [//Opciones, en este caso 2 botones cancelar y eliminar
                {
                     text:"Cancelar",
                     style:"cancel"
                },
                {   //Si aceptamos eliminar
                    text:"Eliminar",
                    onPress:()=>{
                        setImagenes(
                        /*Extrae todas las imagenes diferentes a la que deseamos eliminar
                        y sobreescribe el arreglo original sin la imagen a eliminar*/
                        filter(copiaArreglo, (url)=> url !== imagen)
                        );
                    },
                },
            ],
            //cancelable permite definir si la alerta se cierra al dar clic en la pantalla fuera de la alerta
            {cancelable:false}
        );
    };

    

    return( 

    <View style={styles.vistaImagenes}>
        {/*Condicionamos que el icono de agregar imagen
        se oculte cuando se tengan 4 imágenes */}
        {size(imagenes)<4 &&(

            <Icon
            type="material-community"
            name="camera"
            color="#7a7a7a"
            containerStyle={styles.icono}
            onPress={seleccionar}
            />
        )}
        {map(imagenes, (imagen, index)=>(
            /*Avatar nos permitirá visualizar una miniatura la imagen
            procesada por map*/
            <Avatar
                key={index}
                style={styles.avatar}
                source={{uri:imagen}}
                onPress={()=> eliminarImagen(imagen)}
            />
        ))}
    </View>
    )
}

/*Función encargada de estructurar la imagen de encabezado
    recibe la imagen a mostrar como parámetro*/
    function ImagenPrincipal(propiedades){
        //Atrapamos la imagen a mostrar (posición 0 del arreglo)
        const {imagen} = propiedades;
        return(
            <View style={styles.foto}>
                <Image
                source={
                    /*Si la imagen a mostrar existe se muestra y si no la imagen
                    no-encontrada*/
                    imagen ?{uri: imagen} : require('../../../assets/img/no-encontrada.png')
                }
                //Indicamos que la imagen se ajuste al ancho del dispositivo
                style={{width:WidthScreen, height:200}}
                 />
            </View>
        );
    }

const styles= StyleSheet.create({
    scroll:{
        height:"100%",
    },
    form:{
        marginLeft:10,
        marginRight:10,
    },
    vista:{
        marginBottom:10,
    },
    textArea:{
        height:100,
        width:"100%",
        padding:0,
        margin:0,
    },

    btn:{
        backgroundColor:"#0A6ED3",
        margin:20,
    },

    vistaImagenes:{
        flexDirection:"row",
        marginLeft:20,
        marginRight:20,
        marginTop:30,
    },
    icono: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height:70,
        width: 70,
        backgroundColor:"#e3e3e3"
    },
    avatar: {
        width:70,
        height:70,
        marginRight:10,
        },
});
