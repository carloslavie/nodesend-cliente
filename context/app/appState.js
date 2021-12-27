import React, { useReducer } from "react";
import appContext from "./appContext";
import appReducer from './appReducer';
import {
  MOSTRAR_ALERTA,
  LIMPIAR_ALERTA,
  SUBIR_ARCHIVO_EXITO,
  SUBIR_ARCHIVO_ERROR,
  CREAR_ENLACE_EXITO,
  CREAR_ENLACE_ERROR,
  SUBIR_ARCHIVO,
  LIMPIAR_STATE
} from "../../types";
import clienteAxios from "../../config/axios";

const AppState = ({children}) =>{

  const initialState = {
    mensaje_archivo: '',
    nombre:'',
    nombre_original:'',
    cargando: null, 
    descargas: 1,
    password: '',
    autor: null,
    url:''
  }

  const [state, dispatch] = useReducer(appReducer, initialState)

  const mostrarAlerta = msg =>{
    console.log(msg)
    dispatch({
      type:MOSTRAR_ALERTA,
      payload: msg
    })
    setTimeout(() => {
      dispatch({
        type:LIMPIAR_ALERTA
      })
    }, 3000);
  }

  const subirArchivo = async (formData, nombreArchivo) =>{
    dispatch({
      type:SUBIR_ARCHIVO
    })
    try {
      const resultado = await clienteAxios.post("/api/archivos", formData);
      console.log(resultado.data)
      
      dispatch({
        type: SUBIR_ARCHIVO_EXITO,
        payload: {
          nombre: resultado.data.archivo,
          nombre_original: nombreArchivo
        }
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type:SUBIR_ARCHIVO_ERROR,
        payload:error.response.data.msg
      })
    }
  }

  const crearEnlace = async () => {
    const data = {
      nombre: state.nombre,
      nombre_original: state.nombre_original,
      descargas: state.descargas,
      passowrd: state.password,
      autor: state.autor
    }
    try {
      const resultado = await clienteAxios.post('/api/enlaces', data)
      dispatch({
        type:CREAR_ENLACE_EXITO,
        payload:resultado.data.msg
      })
    } catch (error) {
      console.log(error)
    }
  };

  const limpiarState = ()=>{
    dispatch({
      type: LIMPIAR_STATE
    })
  }
  return(
    <appContext.Provider
      value={{
        mensaje_archivo: state.mensaje_archivo,
        nombre: state.nombre,
        nombre_original: state.nombre_original,
        cargando: state.cargando,
        descargas: state.descargas,
        password: state.pàssword,
        autor: state.autor,
        url: state.url,
        mostrarAlerta,
        subirArchivo,
        crearEnlace,
        limpiarState
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export default AppState;