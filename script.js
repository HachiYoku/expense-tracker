// Initialize transactions from localStorage safely
let transactions = [];
try {
  const stored = localStorage.getItem("transactions");
  transactions = stored ? JSON.parse(stored) : [];
} catch {
  transactions = [];
}

// DOM Elements
const transactionList = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const mainContent = document.getElementById("main-content");
const usernameDisplay = document.getElementById("usernameDisplay");
const signOutBtn = document.getElementById("signOutBtn");

// Dummy Login Info
const DUMMY_EMAIL = "demo@gmail.com";
const DUMMY_PASSWORD = "password123";

// Login Form Submit
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
    usernameDisplay.textContent = email;
    loginSection.style.display = "none";
    mainContent.style.display = "block";
    signOutBtn.style.display = "inline-block";
  } else {
    alert("Invalid credentials. Try demo@gmail.com / password123");
  }
});

// Sign Out
signOutBtn.addEventListener("click", function () {
  usernameDisplay.textContent = "";
  loginSection.style.display = "block";
  mainContent.style.display = "none";
  signOutBtn.style.display = "none";
});

// Add Transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.querySelector('input[name="type"]:checked').value;
  const value = parseFloat(amount.value);
  if (!value) return;

  const transaction = {
    id: Date.now(),
    text: text.value.trim(),
    amount: type === "expense" ? -Math.abs(value) : Math.abs(value),
    date: new Date().toLocaleString(),
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();

  text.value = "";
  amount.value = "";
});


// Render All Transactions
function renderTransactions() {
  transactionList.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach(t => {
    const isExpense = t.amount < 0;
    const sign = isExpense ? "-" : "+";
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center transaction-item";

    listItem.innerHTML = `
      <div>
        <strong>${t.text}</strong><br/>
        <small class="text-muted">${t.date || "No date"}</small>
      </div>
      <div>
        <span class="${isExpense ? "expense" : "income"} history-amount">
          ${sign}$${Math.abs(t.amount).toFixed(2)}
        </span>
        <button class="btn btn-sm btn-danger ms-3" onclick="deleteTransaction(${t.id})">x</button>
      </div>
    `;

    transactionList.appendChild(listItem);
    isExpense ? (expense += t.amount) : (income += t.amount);
  });

  balanceEl.textContent = `$${(income + expense).toFixed(2)}`;
  incomeEl.textContent = `$${income.toFixed(2)}`;
  expenseEl.textContent = `$${Math.abs(expense).toFixed(2)}`;
}

// Delete Transaction
function deleteTransaction(id) {
  showConfirmModal("Are you sure, <br> you want to delete this transaction?", () => {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    renderTransactions();
  });
}

function showConfirmModal(message, onConfirm) {
  const modal = document.getElementById("confirmModal");
  const messageEl = document.getElementById("confirmMessage");
  const yesBtn = document.getElementById("confirmYes");
  const noBtn = document.getElementById("confirmNo");

  messageEl.innerHTML = message;
  modal.style.display = "block";

  
  yesBtn.onclick = () => {
    modal.style.display = "none";
    onConfirm();
  };
  
  noBtn.onclick = () => {
    modal.style.display = "none";
  };
}

// Save to LocalStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Download CSV with Date
function downloadCSV() {
  if (transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Description,Amount,Date\n";
  transactions.forEach(t => {
    csvContent += `${t.text},${t.amount},"${t.date}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// Initial Render
renderTransactions();
