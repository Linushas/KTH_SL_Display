document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("bus-data");

    // Funktion för att hämta och uppdatera busdata
    function fetchAndUpdateBusData() {
        fetch("http://localhost:5000/getBusData")
            .then(response => response.json())
            .then(data => {
                // Rensa den gamla tabellens innehåll
                tableBody.innerHTML = "";

                // Lägg till ny data i tabellen
                data.forEach(bus => {
                    const row = document.createElement("tr");
                    row.innerHTML = 
                    `
                        <td id="line">${bus.line || "-"}</td>
                        <td id="destination">${bus.destination}</td>
                        <td id="display">${bus.display}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching bus data:", error));
    }

    // Kör första uppdateringen direkt
    fetchAndUpdateBusData();

    // Uppdatera varje minut (60 000 ms)
    setInterval(fetchAndUpdateBusData, 60000);
});


