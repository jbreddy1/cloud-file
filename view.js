// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDqtrSFObjzIC-MZ_fGbBK0iVwXpH-hKX8",
  authDomain: "dad-upload.firebaseapp.com",
  projectId: "dad-upload",
  storageBucket: "dad-upload.firebasestorage.app",
  messagingSenderId: "617576089214",
  appId: "1:617576089214:web:dd6284ba410fe865cbfa2f",
  measurementId: "G-Z3XVKP235H"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

var fileList = document.getElementById("fileList");

// Function to list all files
function listFiles() {
    fileList.innerHTML = "";
    var listRef = storage.ref("uploads/");

    listRef.listAll()
        .then(function(res) {
            if (res.items.length === 0) {
                fileList.innerHTML = "<tr><td colspan='3'>No files uploaded.</td></tr>";
            }

            res.items.forEach(function(itemRef) {
                itemRef.getDownloadURL().then(function(url) {
                    var tr = document.createElement("tr");

                    tr.innerHTML = `
                        <td>${itemRef.name}</td>
                        <td><a href="${url}" target="_blank">Download</a></td>
                        <td><button onclick="deleteFile('${itemRef.fullPath}', this)">Delete</button></td>
                    `;

                    fileList.appendChild(tr);
                });
            });
        })
        .catch(function(error) {
            console.error(error);
            fileList.innerHTML = "<tr><td colspan='3'>Failed to load files.</td></tr>";
        });
}

// Function to delete a file
function deleteFile(path, btn) {
    if (!confirm("Are you sure you want to delete this file?")) return;

    storage.ref(path).delete()
        .then(function() {
            // Remove the row from the table
            var row = btn.closest("tr");
            row.remove();
        })
        .catch(function(error) {
            console.error(error);
            alert("Failed to delete file: " + error.message);
        });
}

// Initial load
listFiles();
