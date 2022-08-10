const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // opacity: 0.25,
    // titleBarStyle: "hidden",
    // frame: false,
    // kiosk: true,
    autoHideMenuBar: true,
  });

  // debugging
  // win.webContents.openDevTools({ mode: "detach" });

  win.setIcon('public/folderIcon.png')
  win.loadFile("public/index.html");
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  ipcMain.handle("get-home-path", () => {
    // return homedir;
    // https://www.electronjs.org/docs/latest/api/app
    return app.getPath("home");
  });

  ipcMain.handle("goBackPath", (event, args) => {
    return path.dirname(args);
  });

  ipcMain.handle("onOpen", (event, parent, child) => {
    const newPath = path.join(parent, child);
    return newPath;
  });

  ipcMain.handle("get-contents", (event, p, showHidden = false) => {
    const files = fs
      .readdirSync(p)
      .map((file) => {
        const filePath = path.join(p, file);
        let stats;
        try {
          stats = fs.statSync(filePath);
        } catch (e) {
          // permission denied
          // console.log(e);
        }

        return {
          name: file,
          size: stats?.isFile() ? stats?.size : null,
          directory: stats?.isDirectory(),
        };
      })
      .sort((a, b) => {
        if (a.directory === b.directory) {
          return a.name.localeCompare(b.name);
        }
        return a.directory ? -1 : 1;
      })
      .filter((f) => (showHidden ? true : f.name[0] !== "."));

    return files;
  });

  ipcMain.handle("get-quick-link", (event, link) => {
    return app.getPath(link);
  });

  ipcMain.on("openFile", (event, filePath) => {
    console.log(filePath);
    shell.openPath(filePath);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
