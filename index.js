let state = {
  balance: 0,
  income: 400,
  expense: 100,
  transactions: [],
};

const balanceEl = document.querySelector("#balance");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const transactionsEl = document.querySelector("#transaction");
const incomebtnEl = document.querySelector("#incomeBtn");
const expensebtnEl = document.querySelector("#expenseBtn");
let nameInputEl = document.querySelector("#name");
let amountInputEl = document.querySelector("#amount");

function init() {
  let localState = JSON.parse(localStorage.getItem("expenseTrackerState"));

  if (localState !== null) {
    state = localState;
  }
  updateState();
  initListners();
}

function uniqueId() {
  return Math.round(Math.random() * 1000000);
}

function initListners() {
  incomebtnEl.addEventListener("click", onAddIncomeClick);
  expensebtnEl.addEventListener("click", onAddExpenseClick);
}

function onAddIncomeClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, "income");
}

function addTransaction(name, amount, type) {
  if (name !== "" && amount !== "") {
    const transaction = {
      id: uniqueId(),
      name: name,
      amount: parseInt(amount),
      type: type,
    };

    state.transactions.push(transaction);

    updateState();
  } else {
    alert("please enter valid data");
  }

  nameInputEl.value = "";
  amountInputEl.value = "";
}

function onAddExpenseClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, "expense");
}

function onDeleteClick() {
  const id = parseInt(event.target.getAttribute("data-id"));
  let deleteIndex;
  for (let i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id === id) {
      deleteIndex = i;
      break;
    }
  }

  state.transactions.splice(deleteIndex, 1);

  updateState();
}

function updateState() {
  let balance = 0,
    income = 0,
    expense = 0,
    item;

  for (let i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];

    if (item.type === "income") {
      income += item.amount;
    } else if (item.type === "expense") {
      expense += item.amount;
    }
  }

  balance = income - expense;

  state.balance = balance;
  state.income = income;
  state.expense = expense;

  localStorage.setItem("expenseTrackerState", JSON.stringify(state));

  render();
}

function render() {
  balanceEl.innerHTML = `R${state.balance}`;
  incomeEl.innerHTML = `R${state.income}`;
  expenseEl.innerHTML = `R${state.expense}`;

  let listEl, containerEl, amountEl, item, btnEl;

  transactionsEl.innerHTML = "";

  for (let i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];
    listEl = document.createElement("li");
    listEl.append(state.transactions[i].name);

    transactionsEl.appendChild(listEl);

    containerEl = document.createElement("div");
    amountEl = document.createElement("span");
    if (item.type === "income") {
      amountEl.classList.add("income-amount");
    } else if (item.type === "expense") {
      amountEl.classList.add("expense-amount");
    }

    amountEl.innerHTML = `R${item.amount}`;

    btnEl = document.createElement("button");
    btnEl.setAttribute("data-id", item.id);
    btnEl.innerHTML = "X";

    btnEl.addEventListener("click", onDeleteClick);

    containerEl.appendChild(btnEl);

    listEl.appendChild(containerEl);
    containerEl.appendChild(amountEl);
  }
}

init();
