let myPieChart;
let getProjectedCosts;
const calculateButton = document.getElementById('calculateBtn');
calculateButton.addEventListener('click', ProjectedCostsandSavings);

let averageSpendingPerDay = 0; 
let totalProjectedCosts = 0;   
let totalPossibleSavings = 0;

let lines = [];

// Calculate the costs
function ProjectedCostsandSavings() {
    lines = [];
    let totalSavings = 0;
    const startDate = new Date(document.getElementById("inputStart").value);
    const gradDate = new Date(document.getElementById("inputGrad").value);
    const timeLeft = Math.abs(gradDate - startDate) / (1000 * 60 * 60 * 24); // time in days

    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const timeSpent = Math.abs(currentDate - startDate) / (1000 * 60 * 60 * 24); // time in days

    let totalCost = 0;

    const expenseIds = [
        "Transport",
        "Food",
        "Tuition",
        "Housing",
        "Hobbies",
        "Gym",
        "Phone",
        "Subscriptions",
        "Textbook",
        "Care"
    ];

    let differenceTotal = 0;

    //Average daily expenses for a BC student
    const threshold = { 
        transport: 1.5,
        food: 16.50,
        tuition: 16.50,
        housing: 66.50,
        hobbies: 6.50,
        gym: 2,
        phone: 2,
        subscriptions: 6.50,
        textbook: 4.50,
        care: 2
    };

    //Average daily expense total for students
    let average_daily = 125;

    expenseIds.forEach(expenseId => {
        const input = document.getElementById(`input${expenseId}`);
        const frequency = document.querySelector(`input[name="${expenseId.toLowerCase()}_button"]:checked`).value;
        let divisor = 1;
    
        switch (frequency) {
        case 'daily':
            divisor = 1;
            break;
        case 'weekly':
            divisor = 7;
            break;
        case 'monthly':
            divisor = 30; // approximating a month to 30 days
            break;
        case 'semester':
            divisor = 120;
            break;
        }
    
        const subtotal = Number(input.value) / divisor;
        let name = expenseId.toLowerCase()

        if(subtotal > threshold[name]){

            let difference = subtotal - threshold[name];
            totalSavings += difference * timeLeft; 

            const roundedDifference = Math.round(difference);
            const formattedDifference = roundedDifference.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            var line = `You are spending ${formattedDifference} over the average per day for your ${expenseId} expense`;
            lines.push(line);

            differenceTotal += difference;
        }

        totalCost += subtotal;
    });
    totalPossibleSavings = totalSavings;
    const projectedCost = totalCost * (timeLeft + 1);
    const roundedprojectedCost = Math.round(projectedCost);
    
    let DailyOver = totalCost - average_daily;
    if(DailyOver >= 0){

        document.getElementById("savingsBox").style.display = "block";
        const roundedDailyOver = Math.round(DailyOver);
        const FormattedDailyOver = roundedDailyOver.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("savingsOvertime").innerText = `Daily Spending Over Average: ${FormattedDailyOver}`;

        let projectedOver = roundedDailyOver * (timeLeft + 1);

        const projectedCostsWithSavings = roundedprojectedCost - projectedOver;
        const formattedProjectedCostsWithSavings = projectedCostsWithSavings.toLocaleString('en-US', { style: 'currency', currency: 'CAD' });
        document.getElementById("projectedCostsWithSavings").innerText = formattedProjectedCostsWithSavings;
    }
    else{

        document.getElementById("savingsBox").style.display = "none";
        
        if(lines.length != 0){

            let line = "Your total expenses are below the daily average, but you can possibly save in the the areas listed above."
            lines.push(line);
        } 

        else{

            let line = "Your total expenses and expense catagories are below the averages, well done!"
            lines.push(line);
        }
    }

    //const unroundedTotalCost = totalCost * (timeSpent - 1);
    let unroundedTotalCost = 0;
    if (timeSpent >= 1) {
        unroundedTotalCost = totalCost * Math.floor(timeSpent);
    }
    const roundedTotalCost = Math.round(unroundedTotalCost);
    const formattedTotalCost = roundedTotalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.getElementById("currentCosts").innerText = `Total cost so far: ${formattedTotalCost}`;

    const roundedaverage = Math.round(totalCost);
    const formattedaverage = roundedaverage.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.getElementById("averageSpending").innerText = `Average spending per day: ${formattedaverage}`;

    const formattedprojectedCost = roundedprojectedCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.getElementById("projectedCosts").innerText = `Projected cost until graduation: ${formattedprojectedCost}`;

    getProjectedCosts = function(){
        return projectedCost;
    }

    if(lines.length != 0){

        let savingsMessage = lines.join("\n");
        document.getElementById("summary").innerText = savingsMessage;
    }

    averageSpendingPerDay = roundedaverage;
    totalProjectedCosts = roundedprojectedCost;

    document.getElementById("downloadButton").style.display = "block";
    document.getElementById("currencyConvert").style.display = "block";
}




const apiKey = '19dcda9316be4302b76e3d864b19ffc6';

async function convertCurrencyArray(amounts, fromCurrency, toCurrency){
    
    const apiUrl = `https://open.er-api.com/v6/latest/${fromCurrency}?apikey=${apiKey}`;

    try{
        const response = await fetch(apiUrl);
        const data = await response.json();
        const exchangeRate = data.rates[toCurrency];

        return amounts.map(amount => (amount * exchangeRate).toFixed(2));
    } 
    
    catch (error){
        console.error('Error fetching exchange rates:', error);
        return null;
    }
}





function downloadCSV(data) {

    if(!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'string') {

        console.error('Invalid data format');
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");

    filename = prompt("Enter the filename for the CSV file:", "data.csv");

    if(!filename || filename.trim() === "") {
        return;
    }

    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", filename);

    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
  
document.getElementById("downloadButton").addEventListener("click", function(){

    downloadCSV(lines);
});




function getDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.abs(end - start); 
    return Math.ceil(duration / (1000 * 60 * 60 * 24)) + 1;
}
    

// Function to generate dates between start and end
function getDates(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray.map(date => date.toISOString().split('T')[0]);
}


// Get input data
function getInputValue(id) {
    let value = parseFloat(document.getElementById(id).value);
    return isNaN(value) ? 0 : value;
}



// Visualize income data as a bar-chart
function drawChart(timeframe = 'daily') {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    const startDate = new Date(document.getElementById("inputStart").value);
    const gradDate = new Date(document.getElementById("inputGrad").value);
    const dateLabels = getDates(startDate, gradDate); // This is part of the previous setup code

    let duration = getDuration(startDate, gradDate); // This is part of the previous setup code

    // If the chart already exists, destroy it
    if (myPieChart) { // This is part of the previous setup code
        myPieChart.destroy(); // This is part of the previous setup code
    } // This is part of the previous setup code

    // New logic to handle the timeframe
    let divisor;
    switch (timeframe) {
        case 'daily':
            divisor = 1; // No change, as it's already daily
            break;
        case 'weekly':
            divisor = 7;
            break;
        case 'totalDuration':
            divisor = duration; // Use the total duration
            break;
    }

    const adjustedSpending = averageSpendingPerDay * divisor;
    const adjustedSavingPerDay = totalPossibleSavings / duration;
    const adjustedSavings = adjustedSavingPerDay * divisor;

    const data = {
        labels: ['Costs'],
        datasets: [
            {
                label: 'Estimated Costs ($)',
                data: [adjustedSpending],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Optimized Costs ($)',
                data: [adjustedSpending - adjustedSavings],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };
    

    // Create a new chart instance
    myPieChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
