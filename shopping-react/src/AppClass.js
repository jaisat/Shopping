import React,{Component} from 'react';
import web3 from './web3';
import customer from './customer';
import retailer from './retailer';
import CustomerClass from './CustomerClass';
import RetailerClass from './RetailerClass';
import styles from './appStyles.module.css';



class AppClass extends Component{
	constructor(props){
		super(props);
		this.state={
			userType:'',
			searchText:'',
			loading:true
		}
	}

	
	async componentDidMount(){
		// console.log(web3.version);
		const accounts=await window.ethereum.enable();
		// console.log(accounts);

		if(await retailer.methods.isValidUser().call({from:accounts[0]})){
			this.setState({userType:'Retailer'})
		}
		else if(await customer.methods.isValidUser().call({from:accounts[0]})){
			this.setState({userType:'Customer'})
		}
		this.setState({loading:false})
		

	}
		render(){
			let templateUser=<div></div>
			if(this.state.userType=='Retailer'){
				templateUser=<div><RetailerClass /></div>
			}
			else 
			{
				
				templateUser=<div><CustomerClass/></div>
			}
			if(this.state.loading){
				return <div><i id={styles.mid_buffer} class="fa fa-spinner fa-spin"></i><h1>Loading..</h1></div>;
			}
			else{
				return (
					<div>
						{templateUser}
					</div>

					)	
			}
			
		}		
	

}

export default AppClass;