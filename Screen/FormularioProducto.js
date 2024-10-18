import React,{useState} from "react";
import { Text, SafeAreaView, TextInput, Button } from "react-native";

function FormularioProducto(){
    const [nombreProducto, setNombreProducto] = useState("")
    const [url, setUrl] = useState("")
    const [ingredientes, setIngredientes] = useState([{}])

    const crearProducto = () =>{
        console.log(nombreProducto)
        console.log(url)
    }


    return(
        <SafeAreaView>
            <TextInput
            onChangeText={setNombreProducto}
            value={nombreProducto}
            />
            <TextInput
            onChangeText={setUrl}
            value={url}
            placeholder="useless placeholder"
            keyboardType="numeric"
            />
            <Button title="Tócame" onPress={crearProducto} />
      </SafeAreaView>
    )
}

export default FormularioProducto