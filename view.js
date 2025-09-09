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

var gallery = document.getElementById("gallery");

// Function to list all files in gallery
function listFiles() {
    gallery.innerHTML = "";
    var listRef = storage.ref("uploads/");

    listRef.listAll()
        .then(function(res) {
            if (res.items.length === 0) {
                gallery.innerHTML = "<p>No files uploaded.</p>";
            }

            res.items.forEach(function(itemRef) {
                itemRef.getDownloadURL().then(function(url) {
                    // Create image card
                    var card = document.createElement("div");
                    card.className = "image-card";

                    // Image element
                    var img = document.createElement("img");
                    img.src = url;
                    img.alt = itemRef.name;

                    // Clicking image triggers download
                    img.onclick = function() {
                        var a = document.createElement("a");
                        a.href = url;
                        a.download = itemRef.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    };

                    // Delete button
                    var delBtn = document.createElement("button");
                    delBtn.className = "btn-delete";
                    delBtn.innerText = "Delete";
                    delBtn.onclick = function() {
                        if (!confirm("Are you sure you want to delete this file?")) return;
                        storage.ref(itemRef.fullPath).delete()
                            .then(function() {
                                card.remove();
                            })
                            .catch(function(err) {
                                console.error(err);
                                alert("Failed to delete file: " + err.message);
                            });
                    };

                    card.appendChild(img);
                    card.appendChild(delBtn);

                    gallery.appendChild(card);
                });
            });
        })
        .catch(function(error) {
            console.error(error);
            gallery.innerHTML = "<p>Failed to load files.</p>";
        });
}

// Delete all files
function deleteAllFiles() {
    if (!confirm("Are you sure you want to delete ALL files?")) return;

    var listRef = storage.ref("uploads/");
    listRef.listAll()
        .then(function(res) {
            var promises = [];
            res.items.forEach(function(itemRef) {
                promises.push(storage.ref(itemRef.fullPath).delete());
            });

            Promise.all(promises)
                .then(function() {
                    alert("All files deleted!");
                    listFiles();
                })
                .catch(function(err) {
                    console.error(err);
                    alert("Failed to delete some files: " + err.message);
                });
        });
}

// Initial load
listFiles();
