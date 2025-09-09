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
var fileStatus = document.getElementById("fileStatus");

uploadBtn.onclick = function() {
    var files = fileInput.files;
    if (!files.length) {
        alert("Please select at least one file!");
        return;
    }

    fileStatus.innerHTML = ""; // Clear previous status

    var totalFiles = files.length;
    var completedFiles = 0;

    Array.from(files).forEach(function(file) {
        // Create DOM elements for each file
        var container = document.createElement("div");
        container.className = "file-container";
        container.innerHTML = `<strong>${file.name}</strong>`;

        var progressContainer = document.createElement("div");
        progressContainer.className = "progressContainer";

        var progressBar = document.createElement("div");
        progressBar.className = "progressBar";
        progressBar.innerText = "0%";

        progressContainer.appendChild(progressBar);
        container.appendChild(progressContainer);
        fileStatus.appendChild(container);

        progressContainer.style.display = "block";

        // Upload file
        var storageRef = storage.ref("uploads/" + file.name);
        var uploadTask = storageRef.put(file);

        uploadTask.on(
            "state_changed",
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.style.width = progress.toFixed(0) + "%";
                progressBar.innerText = progress.toFixed(0) + "%";
            },
            function(error) {
                console.error(error);
                progressBar.style.backgroundColor = "red";
                progressBar.innerText = "Failed";
            },
            function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    progressBar.style.width = "100%";
                    progressBar.innerText = "Completed";

                    completedFiles++;
                    // Check if all files are uploaded
                    if (completedFiles === totalFiles) {
                        setTimeout(function() {
                            alert("All files uploaded successfully!");
                            window.location.href = "index.html";
                        }, 200);
                    }
                });
            }
        );
    });
};
