import React, { useReducer } from "react";
import authContext from "./authContext";
import authReducer from "./authReducer";
import {
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  LIMPIAR_ALERTA,
  LOGIN_ERROR,
  LOGIN_EXITOSO,
  USUARIO_AUTENTICADO, 
  CERRAR_SESION,
} from "../../types";
import clienteAxios from "../../config/axios";
import tokenAuth from "../../config/auth";

const AuthState = ({ children }) => {
  const initialState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : "",
    autenticado: null,
    usuario: null,
    mensaje: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const cleanAlert = () => {
    setTimeout(() => {
      dispatch({
        type: LIMPIAR_ALERTA,
      });
    }, 3000);
  };
  const registrarUsuario = async (datos) => {
    try {
      const result = await clienteAxios.post("/api/usuarios", datos);
      dispatch({
        type: REGISTRO_EXITOSO,
        payload: result.data.msg,
      });
    } catch (error) {
      dispatch({
        type: REGISTRO_ERROR,
        payload: error.response.data.msg,
      });
    }
    cleanAlert();
  };

  const iniciarSesion = async (datos) => {
    try {
      const result = await clienteAxios.post("/api/auth", datos);
      dispatch({
        type: LOGIN_EXITOSO,
        payload: result.data.token,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg,
      });
    }
    cleanAlert();
  };

  const usuarioAutenticado = async () => {
    const token = localStorage.getItem('token');
    if(token){
      tokenAuth(token)
    }
    try {
      const respuesta = await clienteAxios('/api/auth')
      dispatch({
        type: USUARIO_AUTENTICADO,
        payload: respuesta.data.usuario
      })
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg,
      });
    }
    cleanAlert();
    }
  

  const cerrarSesion = () =>{
    dispatch({
      type:CERRAR_SESION
    })
  }

  return (
    <authContext.Provider
      value={{
        token: state.token,
        autenticado: state.autenticado,
        usuario: state.usuario,
        mensaje: state.mensaje,
        usuarioAutenticado,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
export default AuthState;
