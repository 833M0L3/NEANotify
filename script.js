console.log("Hello world")

const data1 = document.getElementById("online")
const button1 = document.getElementById("button")
const status1 = document.getElementById("status")
const outagehrs = document.getElementById("outagehrs")

async function logMovies() {
    const response = await fetch("https://results.bimal1412.com.np/nea");
    const movies = await response.json();
    const elec = await movies["current_status"]
    const last_online = await movies["last_online"];
    function repeat() {
        StatusCheck(elec,last_online);
    } 
    setInterval(repeat, 1000);
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


document.addEventListener("DOMContentLoaded", function () {
    const dataSelector = document.getElementById("dataSelector");
    const displayContainer = document.getElementById("displayContainer");
    displayData("neabht")

    dataSelector.addEventListener("click", () => {
        const selectedData = dataSelector.value;
        displayData(selectedData);
    });

    function displayData(selectedData) {
        fetch("https://results.bimal1412.com.np/neaposts/")
            .then(response => response.json())
            .then(data => {
                const selectedArray = data.find(item => item[selectedData]);
                if (selectedArray) {
                    const dataArray = selectedArray[selectedData];
                    const displayHTML = dataArray.map(item => `
                        <div class="p-1 col-sm-6">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${item.id}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">${new Date(item.time * 1000).toLocaleString()}</h6>
                                    <p class="card-text">${item.text}</p>
                                    <a href="${item.images ? item.images : '#'}" class="card-link">Images</a>
                                    <a href="${item.url ? item.url : '#'}" class="card-link">Post Link</a>
                                </div>
                            </div>
                        </div>
                    `).join("");
    
                    displayContainer.innerHTML = displayHTML;
                } else {
                    displayContainer.innerHTML = "<p>No data found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching data: " + error);
            });
    }
    
});

function processData(data){
    const collectionDate = {}
    const outageByDate = {};
            for (let i = 0; i < data.outage_dates.length; i++) {
                const date = data.outage_dates[i].split(" ")[0];
                const outageHourParts = data.outage_hrs[i].match(/(\d+) hours, (\d+) minutes, (\d+) seconds/);

                const hours = parseInt(outageHourParts[1], 10);
                const minutes = parseInt(outageHourParts[2], 10);
                const seconds = parseInt(outageHourParts[3], 10);

                if (outageByDate[date]) {
                    outageByDate[date].hours += hours;
                    outageByDate[date].minutes += minutes;
                    outageByDate[date].seconds += seconds;
                } else {
                    outageByDate[date] = { hours, minutes, seconds };
                }
            }
            for (const date in outageByDate) {
                let { hours, minutes, seconds } = outageByDate[date];

                minutes += Math.floor(seconds / 60);
                seconds %= 60;
                hours += Math.floor(minutes / 60);
                minutes %= 60;

                let outageTime = "";
                if (hours > 0) {
                    outageTime += `${hours} hrs `;
                }
                if (minutes > 0) {
                    outageTime += `${minutes} min `;
                }
                if (seconds > 0 && hours === 0 && minutes === 0) {
                    outageTime += `${seconds} sec`;
                }
                collectionDate[date] = { hours, minutes, seconds };
                const targetDate = new Date(date);
                const currentDate = new Date();
                const isMatchingDate = targetDate.toDateString() === currentDate.toDateString();
                if (isMatchingDate) {
                    outagehrs.innerText = "Total Outage Today : " + outageTime
                }
                
            }
    const sortedDates = Object.keys(collectionDate).sort((a, b) => new Date(b) - new Date(a));        
    Graph(collectionDate,sortedDates);
 }

 async function DifferenceHrs() {
    const response = await fetch("https://results.bimal1412.com.np/neadates");
    const hrsdata = await response.json();
    processData(hrsdata)
 }


const outageData = {
    labels: [],
    datasets: [
        {
            label: 'Outage Hours',
            data: [], 
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderWidth: 1,
        },
    ],
};

DifferenceHrs();

const ctx = document.getElementById('outageChart').getContext('2d');
const MAX_ENTRIES = 7;
function Graph(outageByDate,sortedDates) {

    for (let i = 0; i < Math.min(MAX_ENTRIES, sortedDates.length); i++) {
        const date = sortedDates[i];
        outageData.labels.push(date);
    
        let { hours, minutes, seconds } = outageByDate[date];
    
        minutes += Math.floor(seconds / 60);
        seconds %= 60;
        hours += Math.floor(minutes / 60);
        minutes %= 60;
    
        outageData.datasets[0].data.push(hours + minutes / 60);
    }

    new Chart(ctx, {
        type: 'bar',
        data: outageData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}
