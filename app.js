const firebaseConfig = {
  apiKey: "AIzaSyDqtrSFObjzIC-MZ_fGbBK0iVwXpH-hKX8",
  authDomain: "dad-upload.firebaseapp.com",
  projectId: "dad-upload",
  storageBucket: "dad-upload.firebasestorage.app",
  messagingSenderId: "617576089214",
  appId: "1:617576089214:web:dd6284ba410fe865cbfa2f",
  measurementId: "G-Z3XVKP235H"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Upload multiple files
function uploadFile() {
  const files = document.getElementById("fileInput").files;
  if (files.length === 0) return alert("Please select at least one file");

  Array.from(files).forEach((file) => {
    const storageRef = storage.ref("uploads/" + file.name);
    storageRef.put(file).then(() => {
      document.getElementById("status").innerText = "✅ Uploaded: " + file.name;
    });
  });
}

// List files for download
function listFiles() {
  const listRef = storage.ref("uploads/");
  const fileList = document.getElementById("fileList");

  if (!fileList) return; // Only run on view.html

  fileList.innerHTML = "Loading...";

  listRef.listAll().then((res) => {
    fileList.innerHTML = "";
    if (res.items.length === 0) {
      fileList.innerHTML = "<li>No files found</li>";
    }
    res.items.forEach((itemRef) => {
      itemRef.getDownloadURL().then((url) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${url}" target="_blank">${itemRef.name}</a>`;
        fileList.appendChild(li);
      });
    });
  });
}

window.onload = listFiles;
