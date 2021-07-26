import React,{useEffect, useState} from "react"

import axios from 'axios'

function Persona(props){
   const persona_id = props.persona_id;
   const personaUrl = "http://localhost:4200/persona"
   const [persona,setPersona] = useState("");

   useEffect(async()=>{
     if(persona_id !== null){
      try {
        const response = await axios.get(personaUrl)
        if(response.status==200){
          setPersona(response.data.Respuesta[0].alias)
      }
    } catch (error) {
      alert("Error inesperado")
      console.error(error)
    } 
     }
   },[])
   
    //Buscar persona si no existe libro no esta prestado
   if(persona == ""){
    return(<div>Este libro no esta prestado</div>)
   } else{
    return(<div>{persona}</div>)
   }

}
export default Persona