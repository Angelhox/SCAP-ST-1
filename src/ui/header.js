const { ipcRenderer } = require("electron");
// const abrirInterface = async()=> {
//    const result=  ipcRenderer.send('abrirInterface',"src/ui/index.html");
//   }
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = "src/ui/usuarios.html";
  const result = ipcRenderer.send("abrirInterface", url);
});
const abrirSocios = async () => {
  const url = "src/ui/socios.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirImplementos = async () => {
    const url = "src/ui/implementos.html";
    await ipcRenderer.send("abrirInterface", url);
  };
