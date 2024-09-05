// Selecionando os elementos do DOM
const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

// Recuperando transações do localStorage ou inicializando com um array vazio
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
let transactions = localStorageTransactions;

// Função para remover uma transação
const removeTransaction = id => {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
};

// Função para adicionar uma transação no DOM
const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+';
  const CSSClass = amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onclick="removeTransaction(${id})">x</button>
  `;
  transactionsUl.appendChild(li);
};

// Função para calcular as despesas
const getExpenses = transactionsAmounts =>
  Math.abs(
    transactionsAmounts
      .filter(value => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

// Função para calcular as receitas
const getIncome = transactionsAmounts =>
  transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

// Função para calcular o saldo total
const getTotal = transactionsAmounts =>
  transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2);

// Função para atualizar os valores de saldo, receita e despesa
const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transactionsAmounts);
  const income = getIncome(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

// Função para inicializar a interface
const init = () => {
  transactionsUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

// Função para atualizar o localStorage
const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Função para gerar um ID único
const generateID = () => Math.round(Math.random() * 1000);

// Função para adicionar uma nova transação ao array
const addTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  });
};

// Função para limpar os inputs após adicionar uma transação
const cleanInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
};

// Função para lidar com o envio do formulário
const handleFormSubmit = event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

  if (isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação');
    return;
  }

  addTransactionsArray(transactionName, transactionAmount);
  init();
  updateLocalStorage();
  cleanInputs();
};

// Adicionando o evento de envio do formulário
form.addEventListener('submit', handleFormSubmit);