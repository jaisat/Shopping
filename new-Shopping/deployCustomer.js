const HDWalletProvider= require('truffle-hdwallet-provider');
const Web3=require('web3');
const {interfaceCustomer,bytecodeCustomer}=require('./compileCustomer');

const provider=new HDWalletProvider(
'fence mind note certain monster enable electric choose stumble danger leisure hazard',
'https://rinkeby.infura.io/v3/0872d5724eee4e9c83548b4c6f910aec',
0,
4
);
// const INITIAL_STRING='Hi i am sonu sharma';28960000

const web3=new Web3(provider);

const deploy = async ()=>{
	const accounts=await web3.eth.getAccounts();
	console.log('Attempting to deploy from account',accounts[0]);
	// web3.eth.getBalance(accounts[0]).then(console.log);
	// console.log(accounts[1]);
	const result = await new web3.eth.Contract(interfaceCustomer).deploy({data: bytecodeCustomer,arguments:["0xcce2a3FA46bcCC50ef1cA6053AB472e6C363BebF"]}).send({from:accounts[0],gas: 5000000});

	console.log(interfaceCustomer);
	// console.log('sonu sharma');
	console.log('Contract deployed to ',result.options.address);
};
deploy();