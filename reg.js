import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getDatabase , ref , set,get} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo5F5bXdTmwxoCOeRyl4JAEttdAhIsZZ8",
  authDomain: "btmain-22c21.firebaseapp.com",
  projectId: "btmain-22c21",
  storageBucket: "btmain-22c21.appspot.com",
  messagingSenderId: "388170695350",
  databaseURL: "https://btmain-22c21-default-rtdb.asia-southeast1.firebasedatabase.app",
  appId: "1:388170695350:web:4a1e7e32ea0f4889869c17",
  measurementId: "G-FSJGFQPR6T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
let fetchedData ;
document.getElementById("loading").style.display = "none";
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('emailBtn').addEventListener('click', function() {
        let usermail = document.getElementById('email').value;
        const dataToSend = { message: usermail }; // Example data to send
        fetch('http://localhost:3110/s', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),

    })
    .then(response => {
        console.log('Response status:', response.status); // Log the response status
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
      })
    

})


let text = 'Lets Beat Diabetes Together!';
let index = 0;
function email() {
    if (index < text.length) {
        document.getElementById('mail').innerHTML += text.charAt(index);
        index++;
        setTimeout(type, 100); // Adjust the speed of typing here, lower values will type faster
    }
}
let code;
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('finishButton').addEventListener('click', function() {
    //send email::
    let usermail = document.getElementById('email').value;
    let dataCheck = '';
    if(dataCheck == ''){
        document.getElementById('codeOuter').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
       
    
    }

    fetch('http://localhost:3119/sendmail', {
      method: 'GET',
      mode: 'no-cors',
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let receivedCode;
    fetch('http://localhost:3119/sendmail')
    .then(response => response.json())
    .then(data => {
        receivedCode = data.code;
        console.log('Received variable from server:', receivedCode);
        document.getElementById('code').innerHTML = receivedCode;
        dataCheck = receivedCode;
        code = receivedCode;
        const dataRef = ref(database, receivedCode);
        if (dataCheck != '') {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('codeOuter').style.display = 'block';
        }

        get(dataRef).then((snapshot) => {
            if (snapshot.exists()) {
                console.log('Data exists:', snapshot.val());
                const dataToSend = { message: true };
                fetch('http://localhost:9999/s', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Response from server:', data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            } else {
                console.log('No data available');
                const postListRef = ref(database,"codes"+"/"+ receivedCode);
                const newPostRef = (postListRef);
                set(newPostRef, {
                  email: document.getElementById('email').value,
                  phone: document.getElementById('phone').value,
                  shirtSize: document.getElementById('shirtSize').value,
                  timestamp:Date.now()
                    // ...
                });
                localStorage.setItem('code', receivedCode);


            }
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    console.log('Data sent to Firebase Realtime Database');
  })



    
});
