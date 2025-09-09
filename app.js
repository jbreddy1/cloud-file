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
var preview = document.getElementById("preview");

var selectedFiles = [];

// Show thumbnails when files are chosen
fileInput.addEventListener("change", function() {
    preview.innerHTML = "";
    selectedFiles = Array.from(fileInput.files);

    selectedFiles.forEach(function(file) {
        var card = document.createElement("div");
        card.className = "file-card";

        var img = document.createElement("img");
        if(file.type.startsWith("image/")) {
            img.src = URL.createObjectURL(file);
        } else {
            img.src = "https://via.placeholder.com/140x140?text=FILE"; // generic placeholder
        }
        card.appendChild(img);

        var fileName = document.createElement("div");
        fileName.innerText = file.name;
        card.appendChild(fileName);

        var progressContainer = document.createElement("div");
        progressContainer.className = "progressContainer";

        var progressBar = document.createElement("div");
        progressBar.className = "progressBar";
        progressBar.innerText = "0%";

        progressContainer.appendChild(progressBar);
        card.appendChild(progressContainer);

        preview.appendChild(card);
    });
});

// Upload function
uploadBtn.onclick = function() {
    if (!selectedFiles.length) {
        alert("Please select at least one file!");
        return;
    }

    var totalFiles = selectedFiles.length;
    var completedFiles = 0;

    selectedFiles.forEach(function(file, index) {
        var storageRef = storage.ref("uploads/" + file.name);
        var uploadTask = storageRef.put(file);

        var progressBar = preview.children[index].querySelector(".progressBar");
        var progressContainer = preview.children[index].querySelector(".progressContainer");
        progressContainer.style.display = "block";

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
