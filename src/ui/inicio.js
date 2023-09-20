const { ipcRenderer } = require("electron");
// const abrirInterface = async()=> {
//    const result=  ipcRenderer.send('abrirInterface',"src/ui/index.html");
//   }
const usuarioUsuario = document.getElementById("usuario");
const usuarioClave = document.getElementById("clave");
// Funcion de inicio de session
// ----------------------------------------------------------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = usuarioUsuario.value;
  const clave = usuarioClave.value;
  await ipcRenderer.invoke("validarUsuarios", {
    usuario,
    clave,
  });
  loginForm.reset();
  usuarioUsuario.focus();
});
// ----------------------------------------------------------------
// Funcion de recepcion de respuesta al intentar logearse
// ----------------------------------------------------------------
ipcRenderer.on("loginResponse", (event, response) => {
  if (response.success) {
    console.log("Incio de session correcto");
  } else {
    if (response.message === "No existe este usuario") {
      console.log("Usuario incorrecto");
      usuarioUsuario.focus();
    } else if (response.message === "Credenciales incorrectas") {
      console.log("Contraseña incorrecta");
      usuarioClave.value = "";
    } else {
      console.log("mensaje", response.message);
      console.log("No se ha podido iniciar session");
    }
  }
});
// ----------------------------------------------------------------
// Funciones de cierre de sesion
// ----------------------------------------------------------------
function cerrarSesion() {
  ipcRenderer.send('cerrarSesion');
}

ipcRenderer.on('sesionCerrada', async () => {
  const url = "src/ui/login.html";
  await ipcRenderer.send("abrirInterface", url);
  
});
// ----------------------------------------------------------------
// Esta funcion abre el formulario para el inicio de sesion
// ----------------------------------------------------------------
function mostrarLogin() {
  const dialog = document.getElementById("loginDialog");
  dialog.showModal();
}
// loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const url = "src/ui/usuarios.html";
//   const result = ipcRenderer.send("abrirInterface", url);
// });
const abrirInicio = async () => {
  const url = "src/ui/principal.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirSocios = async () => {
  const url = "src/ui/socios.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirUsuarios = async () => {
  const url = "src/ui/usuarios.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirPagos = async () => {
  const url = "src/ui/planillas.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirPlanillas = async () => {
  const url = "src/ui/planillas-cuotas.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirParametros = async () => {
  const url = "src/ui/planillas.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirImplementos = async () => {
  const url = "src/ui/implementos.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirContratos = async () => {
  const url = "src/ui/contratos.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirServicios = async () => {
  const url = "src/ui/servicios.html";
  await ipcRenderer.send("abrirInterface", url);
};
