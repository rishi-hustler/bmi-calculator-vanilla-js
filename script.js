const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const calculateBtn = document.getElementById("calculate");
const resultDiv = document.getElementById("result");
const categoryDiv = document.getElementById("category");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

const unitRadios = document.querySelectorAll('input[name="unit"]');

let history = JSON.parse(localStorage.getItem("bmiHistory")) || [];

function saveHistory() {
  localStorage.setItem("bmiHistory", JSON.stringify(history));
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date} — BMI: ${entry.bmi} (${entry.category})`;
    historyList.appendChild(li);
  });
}

function getCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calculateBMI() {
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const unit = document.querySelector('input[name="unit"]:checked').value;

  if (!weight || !height || weight <= 0 || height <= 0) {
    resultDiv.textContent = "Please enter valid values.";
    categoryDiv.textContent = "";
    return;
  }

  let bmi;
  if (unit === "metric") {
    const heightMeters = height / 100;
    bmi = weight / (heightMeters * heightMeters);
  } else {
    bmi = (weight / (height * height)) * 703;
  }

  bmi = bmi.toFixed(1);
  const category = getCategory(bmi);

  resultDiv.textContent = `BMI: ${bmi}`;
  categoryDiv.textContent = category;

  history.unshift({
    bmi,
    category,
    date: new Date().toLocaleDateString()
  });

  history = history.slice(0, 10); // keep last 10 entries
  saveHistory();
  renderHistory();
}

calculateBtn.addEventListener("click", calculateBMI);

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  saveHistory();
  renderHistory();
});

renderHistory();
