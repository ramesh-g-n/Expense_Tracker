/*we need to define a state of the application 
state is nothing but data which is going to change
here
    balance,income,expense and transaction history all are state values

1st we need to create a variable state and add object for that

instead of writting all the variables separately it was good to have state as a object

objects are always a combination of names and values

the state values are those the values we are written in html can be replaced by using a javascript
*/
var state = {
    balance:0,
    income:2200,
    expense:200,
    //we have multiple values in transaction history in an array, and array having object
    transactions:[
       
    ]
}

//we need to target individual elements from html write in javascript, and place within init function
//we need to create a variable here to make them global scope bcz we need to use then in further
var balanceEl = document.getElementById('balance');
var incomeEl = document.getElementById('income');
var expenseEl = document.getElementById('expense');
//create a var to the transaction history
var transactionsEl = document.getElementById('transaction');
//to access the buttons create variable
var incomebtnEl = document.getElementById('income_btn');
var expensebtnEl = document.getElementById('expense_btn');
//now you should target name and amount so that entries can be get
var nameInputEl = document.getElementById('name');
var amountInputEl = document.getElementById('amount');

/*now we need to create a function init and call the above variables inside it now we are using
``(back-ticks), nothing but template literals representted as (${}), used to combine string with js variables*/

function init(){
    var localstate = JSON.parse(localStorage.getItem('ExpenseTrackerState'));
    if(localstate !== null){
        state=localstate;
    }
    updateState();
    initListners();
    
    
}
function uniqueId(){
    return Math.round(Math.random()*100000);
}
function initListners(){
    incomebtnEl.addEventListener('click', onAddincomeclick);
    expensebtnEl.addEventListener('click', onAddexpenseclick)
}
function addTransaction(name, amount, type){
    if(name !== '' && amount !== ''){
        var transaction = {
            id:uniqueId(),
            name : name,
            amount: parseInt(amount),
            type:type
        };
//we need to update this in to the state transactions to get in transaction history
        state.transactions.push(transaction);
 //then we need to update a state for that
         updateState();
    }else{
        alert('Please Enter Valid Input')
    }
    nameInputEl.value = '';
    amountInputEl.value= '';
}
function onAddincomeclick(){
    addTransaction(nameInputEl.value, amountInputEl.value, 'income');  
}
function onAddexpenseclick(){
    addTransaction(nameInputEl.value, amountInputEl.value, 'expense');
}

function onDeleteclick(event){
    var id = parseInt(event.target.getAttribute('data_id'));
    var deleteindex;
    for (var i=0; i<state.transactions.length; i++){
        if(state.transactions[i].id===id){
            deleteindex = i;
            break;
        }
    }
    state.transactions.splice(deleteindex, 1);

    updateState();
}
function updateState(){
    var balance=0,
        income=0,
        expense=0,
        item;

    for (var i=0; i < state.transactions.length; i++){
        item=state.transactions[i];

        if(item.type==='income'){
            income += item.amount;
        }else if (item.type ==='expense'){
            expense += item.amount;
        }
    }
//To make balance, income, expense calculate
        balance= income - expense;

        state.balance = balance;
        state.income = income;
        state.expense = expense;
// we called render function within a update if things are updatted this get call render then we can get result in UI
        render();

//we need to create local storage so that we will get our entries later
    localStorage.setItem('ExpenseTrackerState',JSON.stringify(state));

}

function render(){
    balanceEl.innerHTML = `$${state.balance}`;
    incomeEl.innerHTML = `$${state.income}`;
    expenseEl.innerHTML = `$${state.expense}`;

    //we need to clear a transaction history so that if new entry added it will not double the entries
    transactionsEl.innerHTML = '';

    //create a elements for the transaction history using JS, using forloop, loop all the above transactions whithin function
    var transactionEl, item, containerEl, amountEl, btnEl;

    for (var i=0; i<state.transactions.length; i++){
        item = state.transactions[i];
        transactionEl = document.createElement('li');
        transactionEl.append(item.name);
//we are declared a transactionsEl variable above and loop the transactionEl then append it to transactionsEl
        transactionsEl.appendChild(transactionEl);

//create a container div for above and span for amount
        containerEl = document.createElement('div');
        amountEl = document.createElement('span');
        if(item.type === 'income'){
            amountEl.classList.add('income_amt')
        }else if (item.type === 'expense'){
            amountEl.classList.add('expense_amt');
        }
//To add amount with respect to above transaction
            amountEl.innerHTML = `$${item.amount}`;

// Amount element is a span container is a div so
        containerEl.appendChild(amountEl);
//now we need to append container to individual transaction
        transactionEl.appendChild(containerEl);

//then we need to create a button and add them 
            btnEl = document.createElement('button');
            btnEl.setAttribute('data_id', item.id);
            btnEl.innerHTML = 'X';
            containerEl.appendChild(btnEl);

            btnEl.addEventListener('click', onDeleteclick);

/* based on above Transactions we need to calculate Balance, income and expense. 
cut the whole code and pase it into a render function and call the render function in init() function*/
    }
}
init();

