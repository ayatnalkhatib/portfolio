
document.querySelectorAll(".time").forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        document.querySelectorAll(".time").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        document.querySelectorAll(".tab-content").forEach(content => content.style.display = "none");

        const target = document.querySelector(`.tab-content[data-category="${filter}"]`);
        if (target) target.style.display = "block";

        const city = document.getElementById("location").value.trim();
        if (city) loadUVData(city, filter);
    });
});

let myCharts;

function getUVColor(uv) {
    if (uv <= 2) return "#2ECC71";    
    if (uv <= 5) return "#F1C40F";    
    if (uv <= 7) return "#E67E22";    
    if (uv <= 10) return "#E74C3C";   
    return "#8E44AD";                 
}

function getUVCategory(uv) {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
}

async function loadUVData(city, filter = "past") {
    if (!city) {
        alert("Please enter a city.");
        return;
    }

    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    let geoResp = await fetch(geoUrl);
    let geoData = await geoResp.json();

    if (!geoData.results || geoData.results.length === 0) {
        alert("No location found.");
        return;
    }

    let lat = geoData.results[0].latitude;
    let lon = geoData.results[0].longitude;

    let pastDays = filter === "past" ? 5 : 0;
    let forecastDays = 5;

    let uvUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&daily=uv_index_max&hourly=uv_index&timezone=auto&past_days=${pastDays}&forecast_days=${forecastDays}`;

    let uvResp = await fetch(uvUrl);
    if (!uvResp.ok) {
        alert("Failed to fetch UV data.");
        return;
    }

    let uvData = await uvResp.json();

 
    let uvdaily = uvData.daily;
    let times = uvdaily.time.slice(0, 5);
    let uvMax = uvdaily.uv_index_max.slice(0, 5);

    let uvTable = `<table>
        <caption><strong>Daily UV Index</strong></caption>
        <tr><th>Date</th><th>UV Index</th></tr>`;

    times.forEach((date, i) => {
        const color = getUVColor(uvMax[i]);
        const category = getUVCategory(uvMax[i]);
        uvTable += `<tr>
            <td>${date}</td>
            <td style="background-color:${color}; color:white; font-weight:bold;" title="${category}">
                ${uvMax[i]}
            </td>
        </tr>`;
    });

    uvTable += "</table>";

    const tableId = filter === "past" ? "past-table" : "future-table";
    document.getElementById(tableId).innerHTML = uvTable;

    let hourlyTimes = uvData.hourly.time;
    let hourlyUV = uvData.hourly.uv_index;

    let hourlyLabels = [];
    let hourlyValues = [];

    hourlyTimes.forEach((t, i) => {
        let dt = new Date(t);
        let hour = dt.getHours();

        if (hour >= 7 && hour <= 18) {
            hourlyLabels.push(t);
            hourlyValues.push(hourlyUV[i]);
        }
    });


    const canvasId = filter === "past" ? "past-chart" : "future-chart";
    const ctx = document.getElementById(canvasId).getContext("2d");

    if (myCharts) myCharts.destroy();

    myCharts = new Chart(ctx, {
        type: "line",
        data: {
            labels: hourlyLabels,
            datasets: [{
                label: "Hourly UV (Daylight Only)",
                data: hourlyValues,
                borderColor: "#000",           
                backgroundColor: "#0001",
                borderWidth: 3,
                pointRadius: 0,
                fill: true,
                tension: 0.3,

                segment: {
                    borderColor: ctx => {
                        let uv = hourlyValues[ctx.p1DataIndex];
                        return getUVColor(uv);
                    },
                    backgroundColor: ctx => {
                        let uv = hourlyValues[ctx.p1DataIndex];
                        return getUVColor(uv) + "33";
                    }
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let uv = context.raw; 
                            let category = getUVCategory(uv);
                            return `UV: ${uv} (${category})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function (val, idx) {
                            const d = new Date(hourlyLabels[idx]);
                            return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;
                        },
                        maxRotation: 60,
                        minRotation: 60
                    }
                },
                y: {
                    beginAtZero: true,
                    max:11,
                    
                }
            }
        }
    });
}


function clearForm() {
    document.getElementById("location").value = "";
    document.getElementById("past-table").innerHTML = "";
    document.getElementById("future-table").innerHTML = "";

    if (myCharts) {
        myCharts.destroy();
        myCharts = null;
    }
}
