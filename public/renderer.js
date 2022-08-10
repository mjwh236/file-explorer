const QUICK_LINKS = [
  "home",
  "desktop",
  "documents",
  "downloads",
  "music",
  "pictures",
  "videos",
  // "recent", // windows only
];

// global vars
let currentPath;

let startPath = await window.electronAPI.getHomePath();
directoryPath.innerText = startPath;

const filesContainer = document.getElementById("filesContainer");
const backButton = document.getElementById("backButton");
backButton.addEventListener("click", async () => {
  let newPath = await window.electronAPI.goBackPath(directoryPath.innerText);
  directoryPath.innerText = newPath;
  const newContent = await window.electronAPI.getContents(newPath);
  updateFiles(filesContainer, newContent);
});

const filesContents = await window.electronAPI.getContents(
  directoryPath.innerText
);

const documentsLink = document.getElementById("documentsLink");
documentsLink.addEventListener("click", async () => {
  const newPath = await window.electronAPI.getQuickLink("documents");
  directoryPath.innerText = newPath;
  const newContent = await window.electronAPI.getContents(newPath);
  updateFiles(filesContainer, newContent);
});

const desktopLink = document.getElementById("desktopLink");
desktopLink.addEventListener("click", async () => {
  const newPath = await window.electronAPI.getQuickLink("desktop");
  directoryPath.innerText = newPath;
  const newContent = await window.electronAPI.getContents(newPath);
  updateFiles(filesContainer, newContent);
});

const downloadsLink = document.getElementById("downloadsLink");
downloadsLink.addEventListener("click", async () => {
  const newPath = await window.electronAPI.getQuickLink("downloads");
  directoryPath.innerText = newPath;
  const newContent = await window.electronAPI.getContents(newPath);
  updateFiles(filesContainer, newContent);
});

const homeLink = document.getElementById("homeLink");
homeLink.addEventListener("click", async () => {
  const newPath = await window.electronAPI.getQuickLink("home");
  directoryPath.innerText = newPath;
  const newContent = await window.electronAPI.getContents(newPath);
  updateFiles(filesContainer, newContent);
});

const updateFiles = (parent, newFiles = []) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
  for (let i = 0; i < newFiles.length; i++) {
    const f = newFiles[i];
    const newDiv = document.createElement("div");
    newDiv.id = "filesContainerItem";
    const newContent = document.createTextNode(
      `${f.name} ${f.directory ? "📁" : ""} ${
        f.directory ? "" : f.size + " bytes"
      }`
    );
    
    newDiv.addEventListener("click", async () => {
      const newPath = await window.electronAPI.onOpen(
        directoryPath.innerText,
        f.name
      );

      if (!f.directory) {
        // open app in default program ?
        window.electronAPI.openFile(newPath);
        return;
      }

      directoryPath.innerText = newPath;
      const newContents = await window.electronAPI.getContents(newPath);
      updateFiles(filesContainer, newContents);
    });

    newDiv.appendChild(newContent);
    parent.append(newDiv);
  }
};

updateFiles(filesContainer, filesContents);
