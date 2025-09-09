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

// DOM Elements
var fileInput = document.getElementById("fileInput");
var uploadBtn = document.getElementById("uploadBtn");
var status = document.getElementById("status");

// Upload function
uploadBtn.onclick = function() {
    var file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    var storageRef = storage.ref("uploads/" + file.name);
    var uploadTask = storageRef.put(file);

    status.innerText = "Uploading...";

    uploadTask.on(
        "state_changed",
        function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            status.innerText = "Upload is " + progress.toFixed(0) + "% done";
        },
        function(error) {
            console.error(error);
            status.innerText = "Upload failed: " + error.message;
        },
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                status.innerHTML = `Upload successful! <br> <a href="${downloadURL}" target="_blank">Download File</a>`;
            });
        }
    );
};
