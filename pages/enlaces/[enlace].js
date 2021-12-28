/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
import Layout from "../../components/Layout";
import clienteAxios from "../../config/axios";
import React, { useState, useContext } from "react";
import appContext from "../../context/app/appContext";
import Alerta from "../../components/Alerta";

export async function getServerSideProps({ params }) {
  const { enlace } = params;
  console.log(enlace)
  const resultado = await clienteAxios.get(`/api/enlaces/${enlace}`);
  return {
    props: {
      enlace: resultado.data,
    },
  };
}
export async function getServerSidePaths() {
  const enlaces = await clienteAxios.get("/api/enlaces");
  return {
    paths: enlaces.data.enlaces.map((enlace) => ({
      params: { enlace: enlace.url },
    })),
    fallback: false,
  };
}

export default ({ enlace }) => {
  const { mostrarAlerta, mensaje_archivo } = useContext(appContext);
  const [tienePassword, setTienePassword] = useState(enlace.password);
  const [loadEnlace, setLoadEnlace] = useState(enlace);
  const [password, setPassword] = useState("");
  console.log(enlace)
  const verificarPassword = async (e) => {
    e.preventDefault();

    try {
      const data = {
        password,
      };
      const resultado = await clienteAxios.post(`/api/enlaces/${enlace.enlace}`, data);
      setTienePassword(resultado.data.password)
    } catch (error) {
      mostrarAlerta(error.response.data.msg)
    }
  };

  useEffect(() => {
    
  }, [tienePassword])

  return (
    <Layout>
      {tienePassword ? (
        <>
          <p className="text-center">
            Este enlace esta protegido por un password, colocalo a continuación
          </p>
          { mensaje_archivo && <Alerta /> }
          <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
              <form
                onSubmit={(e) => verificarPassword(e)}
                className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              >
                <div className="mb-4">
                  <label
                    className="block text-black text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="nombre"
                    placeholder="Password del enlace"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="submit"
                    className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white font-bold uppercase cursor-pointer"
                    value="Validar password"
                  />
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl text-center text-gray-700">
            Descarga tu archivo:
          </h1>
          <div className="flex items-center justify-center mt-10">
            <a
              href={`${process.env.backendURL}/api/archivos/${loadEnlace.archivo}`}
              className="bg-red-500 text-center px-10 py-3 rounded uppercase font-bold text-white cursor-pointer"
            >
              Aquí
            </a>
          </div>
        </>
      )}
    </Layout>
  );
};
