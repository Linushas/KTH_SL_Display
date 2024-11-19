document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("bus-data");
    let showOnlyMessages = false;
    let state = 0;
    let busData = [];
    let trainData = [];

    const stopGroups = {
        0: ["A", "B", "C", "D"],
        1: ["E", "F", "G"],
        2: ["1", "2"],
        3: ["3", "4"]
    };

    function createRow(data, isMessageRow) {
        const row = document.createElement("tr");
        if (isMessageRow) {
            row.innerHTML = `<td colspan="4" class="scroll-message">${data.message}</td>`;
        } else {
            row.innerHTML = `
                <td id="line">${data.line || "-"}</td>
                <td id="destination">${data.destination}</td>
                <td id="stop">${data.stop}</td>
                <td id="display">${data.display}</td>
            `;
        }
        return row;
    }

    function updateTable() {
        tableBody.innerHTML = "";

        const currentData = state < 2 ? busData : trainData;
        const currentStops = stopGroups[state] || [];

        currentData.forEach(item => {
            if (currentStops.includes(item.stop)) {
                const isMessageRow = showOnlyMessages && item.message !== "null";
                const row = createRow(item, isMessageRow);
                tableBody.appendChild(row);
            }
        });
    }

    function fetchAndUpdateData() {
        Promise.all([
            fetch("http://localhost:5000/getBusData").then(res => res.json()),
            fetch("http://localhost:5000/getTrainData").then(res => res.json())
        ])
        .then(([bus, train]) => {
            busData = bus;
            trainData = train;
            updateTable();
        })
        .catch(error => console.error("Error fetching data:", error));
    }

    function updateStyle(){
        if(state < 2){
            document.body.style.setProperty("--text-color", "#000");
            document.body.style.setProperty("--background-color", "#384533");
            document.body.style.setProperty("--gradient-color", "rgba(134, 205, 134, 0.1)");
            document.body.style.setProperty("--text-shadow", "rgba(134, 205, 134, 0.1)");
        }
        else if(state >= 2 && state < 4){
            document.body.style.setProperty("--text-color", "#f3c325");
            document.body.style.setProperty("--background-color", "#000");
            document.body.style.setProperty("--gradient-color", "#000");
            document.body.style.setProperty("--text-shadow", "rgba(255, 208, 0, 0.2);");
        }
    }

    updateStyle();
    fetchAndUpdateData();

    setInterval(() => {
        state = (state + 1) % 4;
        updateStyle();
        updateTable();
    }, 8000);
    setInterval(fetchAndUpdateData, 60000);
});
