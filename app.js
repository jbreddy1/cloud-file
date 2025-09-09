// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDqtrSFObjzIC-MZ_fGbBK0iVwXpH-hKX8",
  authDomain: "dad-upload.firebaseapp.com",
  projectId: "dad-upload",
  storageBucket: "dad-upload.firebasestorage.app", // make sure bucket matches your CORS setup
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
var progressContainer = document.getElementById("progressContainer");
var progressBar = document.getElementById("progressBar");

// Upload function
uploadBtn.onclick = function() {
    var file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    var storageRef = storage.ref("uploads/" + file.name);
    var uploadTask = storageRef.put(file);

    // Show progress bar
    progressContainer.style.display = "block";
    progressBar.style.width = "0%";
    progressBar.innerText = "0%";
    status.innerText = "Uploading...";

    uploadTask.on(
        "state_changed",
        function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = progress.toFixed(0) + "%";
            progressBar.innerText = progress.toFixed(0) + "%";
        },
        function(error) {
            console.error(error);
            status.innerText = "Upload failed: " + error.message;
            alert("Upload failed: " + error.message);
        },
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                progressBar.style.width = "100%";
                progressBar.innerText = "100%";
                status.innerHTML = `Upload successful!`;

                // Show alert and redirect
                setTimeout(function() {
                    alert("Upload successful!");
                    window.location.href = "index.html";
                }, 200);
            });
        }
    );
};
