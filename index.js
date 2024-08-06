if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");}
function requestNotificationPermission() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      // you can now send notifications
    } else {
      console.log("Notification permission denied.");
    }
  });
}
document.querySelectorAll('.flashcard').forEach(card => {
  card.addEventListener('click', function () {
      card.classList.toggle('is-flipped');
  });
});
function sendNotification() {
    if (Notification.permission === "granted") {
      var notification = new Notification("Hi there!", {
        body: "Here's a notification from your website.", // body text of the notification
        icon: "url_to_an_icon" // optional icon URL
      });
  
      // Play sound
      var audio = new Audio('I Phone – Notification Ringtone Download - MobCup.Com.Co.mp3'); // Path to your sound file
      audio.play();
  
      // Optional: Handle the notification click event
      notification.onclick = function () {
        window.open("https://www.example.com"); // Open a URL upon clicking the notification
      };
    } else {
      console.log("Permission to send notifications is denied.");
    }
  }



  


  document.getElementById("viewRes").style.display = "none";



window.onload = function() {
  console.log("window is loaded");
  var username = localStorage.getItem('code');
  console.log(username); 
  console.log(username.length);
  if(username.length > 0){
    console.log("code is not null");
    document.getElementById("reg").style.display = "none";
    document.getElementById("viewRes").style.display = "block";

  }
  else{
    document.getElementById("viewRes").style.display = "none";
  }

};  

document.getElementById("viewRes").addEventListener("click" , ()=>{
})