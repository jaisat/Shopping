import {Link} from 'react-router-dom';
import {Button,Spinner} from 'react-bootstrap';
import React,{Component} from 'react';
import retailer from './retailer';
import customer from './customer';
import web3 from './web3';

class RetailerOrder extends Component{

  constructor(props){
    super(props);
    this.state={
      orders:[],
      wait:false

  }  
}

  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    const obj=await retailer.methods.getOrders().call({from:accounts[0]});
    // obj.sort((a,b)=>a.orderId>b.orderId);
    // this.setState({orders:obj});
    this.setState({orders:obj});
    // console.log(this.state.orders);
  }

  dispatchOrder=(id)=>async(event)=>{

  	const accounts=await web3.eth.getAccounts();
  	const orderInfo=await retailer.methods.getOrderInfo(id).call({from:accounts[0]});
    try{
      this.setState({wait:true});
      await customer.methods.setOrderStatusDispatched(orderInfo.addrCustomer,id).send({from:accounts[0],gas:10000000});
      alert('sucessfully dispatched');
    }
    catch{
      alert('metamask error');
    }

  	this.setState({wait:false});
    
  }

  render(){
    if(!this.state.orders.length){
      return (<div>you have not any items</div>);
    }
    else{

      return (
        <div>
        <h2><b>My Orders</b></h2>
          {this.state.orders.slice().sort((a,b)=>a.orderId<b.orderId?1:-1).map(order=>(
            <div style={{backgroundColor:order.orderStatus=="6" || order.orderStatus=="5"?'#D5FEB6':order.orderStatus=='3'?'#A1FCD3':'#A1CDFC',margin:"10px 10px 10px 10px"}} key={order.orderId}>
            <Link style={{textDecoration: "none",color:"black",textAlign:"left"}} to={`/order/${order.itemId}/${order.addrRetailer}`}>
            
              <div style={{marginLeft:"10px"}}><b>OrderId:</b> {order.orderId}</div>
              <div style={{marginLeft:"10px"}}><b>Price:</b> {order.price/1000000000000000000} ether</div>
              <div style={{marginLeft:"10px"}}><b>Quantity:</b> {order.quantity}</div>
              <div style={{marginLeft:"10px"}}><b>Order Status:</b> {order.orderStatus}</div>
              <div style={{marginLeft:"10px"}}><b>ItemId :</b> {order.itemId}</div>
              <div style={{marginLeft:"10px"}}><b>Delivery Address :</b> {order.deliveryAddress}</div>
             
              <div style={{marginLeft:"10px"}}><b>Retailer:</b> {order.addrRetailer}</div>
              <div style={{marginLeft:"10px"}}><b>Customer:</b> {order.addrCustomer}</div>
          
            </Link>
            {(order.orderStatus==1 || order.orderStatus==2)?
                (<div>{this.state.wait?(<><Spinner animation="border" variant="info" /></>):(<><Button onClick={this.dispatchOrder(order.orderId)}>Dispatch</Button></>)}</div>):
                (<div>{order.orderStatus==3?(<div>order Dispatched</div>):(<div>{(order.orderStatus==5 || order.orderStatus==6)?
                  (<div>sucessfully delivered</div>):(<div></div>)}</div>)}</div>)}
                  </div>

            ))}

        </div>
      ); 
    }
    
  }
  
}

export default RetailerOrder;
