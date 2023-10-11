console.log("Hello world")

const data1 = document.getElementById("online")
const button1 = document.getElementById("button")
const status1 = document.getElementById("status")

async function logMovies() {
    const response = await fetch("https://results.bimal1412.com.np/nea");
    const movies = await response.json();
    const elec = await movies["current_status"]
    const last_online = await movies["last_online"];
    StatusCheck(elec,last_online);
    console.log(last_online);
 }

logMovies()

function TimeDifference(specificDateStr) {
    var specificDate = new Date(specificDateStr);
    var currentDate = new Date();

    var timeDifference = currentDate - specificDate;
    var hours = Math.floor(timeDifference / (1000 * 60 * 60));
    var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    var timeComponents = [];

    if (hours > 0) {
     timeComponents.push(hours + " hours");
    }

    if (minutes > 0) {
     timeComponents.push(minutes + " minutes");
    }

    if (seconds > 0) {
     timeComponents.push(seconds + " seconds");
    }

    var timeDifferenceString = timeComponents.join(', ');
    console.log(timeDifferenceString);
    return timeDifferenceString;
}



function StatusCheck(status,time) {
    if (status) {

        button1.className = "btn btn-success";
        status1.innerText = "Online"
        data1.innerText = "Last Offline : "+TimeDifference(time)+ " ago ";

    }
       
    else{
        button1.className = "btn btn-danger";
        status1.innerText = "Offline"
        data1.innerText = "Last Online : "+TimeDifference(time)+ " ago ";
    }

}