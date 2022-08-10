const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getHomePath: () => ipcRenderer.invoke("get-home-path"),
  goBackPath: (p) => ipcRenderer.invoke("goBackPath", p),
  getContents: (p) => ipcRenderer.invoke("get-contents", p),
  onOpen: (p, ch) => ipcRenderer.invoke("onOpen", p, ch),
  openFile: (f) => ipcRenderer.send("openFile", f),
  getQuickLink: (str) => ipcRenderer.invoke("get-quick-link", str),
});
