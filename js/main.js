document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("bus-data");
    let state = 0;
    let busData = [];
    let trainData = [];

    const stopGroups = {
        0: ["A", "B", "C", "D"],
        1: ["E", "F", "G"],
        2: ["4"],
        3: ["5"]
    };

    function createRow(data, isMessageRow) {
        const row = document.createElement("tr");
        if(state < 2){
            if (isMessageRow) {
                const scrollSpeed = Math.max(10, data.message.length / 10); // Justera hastighet efter meddelandelängd.
                row.innerHTML = `
                    <td colspan="4" class="scroll-message">
                        <span class="scrolling" style="animation-duration: ${scrollSpeed}s;">
                            ${data.line || "-"} ${data.destination} : ${data.display} - ${data.message}
                        </span>
                    </td>`;
            } else {
                row.innerHTML = `
                    <td id="line">${data.line || "-"}</td>
                    <td id="destination">${data.destination}</td>
                    <td id="stop">${data.stop}</td>
                    <td id="display">${data.display}</td>
                `;
            }
        }
        else{
            if (isMessageRow) {
                const scrollSpeed = Math.max(10, data.message.length / 10); // Justera hastighet efter meddelandelängd.
                row.innerHTML = `
                    <td colspan="4" class="scroll-message">
                        <span class="scrolling" style="animation-duration: ${scrollSpeed}s;">
                            ${data.line || "-"} ${data.destination} : ${data.display} - ${data.message}
                        </span>
                    </td>`;
            } else {
                row.innerHTML = `
                    <td id="line">${data.line || "-"}</td>
                    <td id="destination">${data.destination}</td>
                    <td id="display">${data.display}</td>
                `;
            }
        }
        
        return row;
    }

    function updateTable() {
        tableBody.innerHTML = "";

        const currentData = state < 2 ? busData : trainData;
        const currentStops = stopGroups[state] || [];

        currentData.forEach(item => {
            if (currentStops.includes(item.stop)) {
                const isMessageRow = item.message !== "null";
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
            document.body.style.setProperty("--font", "'DIN1451', sans-serif");
            document.body.style.setProperty("--text-size", "100px");
            document.body.style.setProperty("--text-padding", "74px");
        }
        else if(state >= 2 && state < 4){
            document.body.style.setProperty("--text-color", "#f3c325");
            document.body.style.setProperty("--background-color", "#000");
            document.body.style.setProperty("--gradient-color", "#000");
            document.body.style.setProperty("--text-shadow", "rgba(255, 208, 0, 0.2);");
            document.body.style.setProperty("--font", "'Triple Dot Digital', sans-serif");
            document.body.style.setProperty("--text-size", "45px");
            document.body.style.setProperty("--text-padding", "80px");
        }
    }
    
    updateStyle();
    fetchAndUpdateData();

    function playSound(){
        let voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(voice => voice.name === "Microsoft Sofie Online (Natural) - Swedish (Sweden)");

        busData.forEach(item => {
            var msg = new SpeechSynthesisUtterance();
            msg.voice = selectedVoice;
            msg.rate = 1;
            msg.pitch = 1;
            msg.text = "Buss " + item.line + " mot " + item.destination + " anländer om " + item.display;
            window.speechSynthesis.speak(msg);
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            state = (state + 1) % 4;
            updateStyle();
            updateTable();
        }
        if (event.key === "ArrowLeft") {
            state = (state == 0) ? 3 : (state - 1);
            updateStyle();
            updateTable();
        }
        if (event.key === " ") { 
            playSound();
        }
    });

    setInterval(() => {
        state = (state + 1) % 4;
        updateStyle();
        updateTable();
    }, 8000);
    setInterval(fetchAndUpdateData, 60000);
});