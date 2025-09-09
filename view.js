// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDqtrSFObjzIC-MZ_fGbBK0iVwXpH-hKX8",
  authDomain: "dad-upload.firebaseapp.com",
  projectId: "dad-upload",
  storageBucket: "dad-upload.appspot.com",
  messagingSenderId: "617576089214",
  appId: "1:617576089214:web:dd6284ba410fe865cbfa2f",
  measurementId: "G-Z3XVKP235H"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
var storageRef = storage.ref("uploads/");

var fileListUl = document.getElementById("fileList");

// List all files in 'uploads/' folder
storageRef.listAll().then(function(res) {
    res.items.forEach(function(itemRef) {
        itemRef.getDownloadURL().then(function(url) {
            var li = document.createElement("li");
            li.innerHTML = `<a href="${url}" target="_blank">${itemRef.name}</a>`;
            fileListUl.appendChild(li);
        });
    });
}).catch(function(error) {
    console.error(error);
    fileListUl.innerHTML = "<li>Error loading files.</li>";
});
