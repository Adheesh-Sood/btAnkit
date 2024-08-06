const nodemailer = require('nodemailer');
const http = require('http');
const url = require('url');
const admin = require('firebase-admin');
const serviceAccount = require('./btmain-22c21-firebase-adminsdk-71m3w-dac2f9a0a2.json'); // Update the path
const fs = require('fs');
const path = require('path');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://btmain-22c21-default-rtdb.asia-southeast1.firebasedatabase.app' // Replace with your database URL
});
const templatePath = path.join(__dirname, './mailT.html');
let emailTemplate = fs.readFileSync(templatePath, 'utf8');

let email;
let receivedData = '';
//get data from the client
const servers = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const reqUrl = url.parse(req.url, true);

    // Handle POST request to /s
    if (reqUrl.pathname === '/s' && req.method === 'POST') {
        let body = '';
        // Collect data chunks
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });
        req.on('end', () => {
            receivedData = JSON.parse(body); // Parse the received JSON
            console.log('Received data from client:', receivedData.message); // Log the received data
            res.statusCode = 200;
            email = receivedData.message;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'Data received' })); // Send a response back
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});
//end get data from the client
let result = '';
let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your preferred service
    auth: {   
        user: 'adheeshsood9@gmail.com',
        pass: 'xgrj aelv ikdm mlyz'
    }
});
// for (let i = 0; i < 7; i++) {
//     result += Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
// }
const db = admin.database();
    // Safe to access email.length
let mailOptions = {
    from: 'adheeshsood9@gmail.com',
    to: receivedData.message,
    subject: 'Your confirmation for the Beat Diabetes event held on 21 march 2025',
    text: "result" // Use the HTML template
    
};

function sendMail(){
    let mailOptions = {
        from: 'adheeshsood9@gmail.com',
        to: receivedData.message,
        subject: 'Your confirmation for the Beat Diabetes event held on 21 march 2025',
        text: 'Here is the code you should show the volunteers at the event: ' + parseInt(result)
        
    };    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            console.log(email);
        } else {
            console.log('Email sent: ' + info.response);            
        }
    });
}

let exists = false;
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const reqUrl = url.parse(req.url, true);
    var ref = db.ref("codes");
    ref.once("value", function(snapshot) {
        ref.orderByChild('timestamp').limitToLast(1).once('value', (snapshot) => {
            const latestEntry = snapshot.val();
            console.log("This is the latest entry"+latestEntry);
            const userTitles = Object.keys(latestEntry); 
            console.log(userTitles);
            
            console.log(parseInt(userTitles)+1)
            let Stdata = JSON.stringify(parseInt(userTitles)+1);
            result = Stdata;
            


          });
        console.log(snapshot.val());
        const myVariable = { code: result }; // Example variable
        // Check the URL of the incoming request
        if (reqUrl.pathname === '/sendmail' && req.method === 'GET') {
            emailTemplate = emailTemplate.replace('{{confirmationCode}}', result); // Replace the placeholder with the code
            sendMail(); // Call the function
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
            res.end(JSON.stringify(myVariable)); // Send the variable as JSON
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }   
        
    });
});

const port1 = 3119;
server.listen(port1, () => {
    console.log(`Server running at http://localhost:${port1}/`);
});

const port2 = 3110;

servers.listen(port2, () => { // Ensure 'servers' is defined correctly
    console.log(`Server running at http://localhost:${port2}/`);
});
