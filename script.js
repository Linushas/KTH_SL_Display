document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("bus-data");
    let showOnlyMessages = false;

    function fetchAndUpdateBusData() {
        fetch("http://localhost:5000/getBusData")
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = "";

                data.forEach(bus => {
                    const row = document.createElement("tr");

                    if (showOnlyMessages && bus.message !== "null") {
                        row.innerHTML = 
                        `
                            <td colspan="4" id="message">${bus.message}</td>
                        `;
                    } else {
                        row.innerHTML = 
                        `
                            <td id="line">${bus.line || "-"}</td>
                            <td id="destination">${bus.destination}</td>
                            <td id="display">${bus.display}</td>
                        `;
                    }
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching bus data:", error));
    }

    fetchAndUpdateBusData();

    // Show message interval every 10 seconds
    setInterval(() => {
        showOnlyMessages = !showOnlyMessages;
        fetchAndUpdateBusData();
    }, 10000);

    // 60 000 ms
    setInterval(fetchAndUpdateBusData, 60000);
});