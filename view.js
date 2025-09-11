// Firebase configuration




firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

var gallery = document.getElementById("gallery");

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
                    var card = document.createElement("div");
                    card.className = "image-card";

                    var img = document.createElement("img");
                    img.src = url;
                    img.alt = itemRef.name;

                    var downloadBtn = document.createElement("button");
                    downloadBtn.className = "btn download";
                    downloadBtn.innerText = "Download";

                    downloadBtn.onclick = async function() {
                        try {
                            const response = await fetch(url);
                            const blob = await response.blob();
                            const a = document.createElement("a");
                            const objectUrl = URL.createObjectURL(blob);
                            a.href = objectUrl;
                            a.download = itemRef.name;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(objectUrl);
                        } catch (err) {
                            console.error(err);
                            alert("Download failed: " + err.message);
                        }
                    };

                    var delBtn = document.createElement("button");
                    delBtn.className = "btn delete";
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
                    card.appendChild(downloadBtn);
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

listFiles();
