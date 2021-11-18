
import React,{Component} from 'react';
import retailer from './retailer';
import customer from './customer';
import web3 from './web3';
import {Button,Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class CustomerOrder extends Component{

  constructor(props){
    super(props);
    this.state={
      orders:[],
      wait:false

  }  
}

  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    // const obj=await customer.methods.getOrders().call({from:accounts[0]});
    // console.log(obj);
    // obj.slice().sort((a,b)=>Number(a.orderId)>Number(b.orderId)?-1:1);
    // console.log(obj)
    // this.setState({orders:obj});
    this.setState({orders:await customer.methods.getOrders().call({from:accounts[0]})})
  }
  onDeliver=(id)=>async(event)=>{
    const accounts=await web3.eth.getAccounts();
    const orderInfo=await customer.methods.getOrderInfo(id).call({from:accounts[0]});
    // console.log(orderInfo.price);
    // console.log(orderInfo.addrRetailer);
    if(orderInfo.payStatus){
      try{
        this.setState({wait:true});
        await customer.methods.deliveryWithoutPay(orderInfo.orderId,orderInfo.addrRetailer)
          .send({from:accounts[0],gas:10000000});
        alert('sucessfully delivered');       
      }
      catch{
        alert('metamask error');
      }
      this.setState({wait:false});

    }
    else{
      try{
        this.setState({wait:true});
        await customer.methods.deliveryOnPay(orderInfo.orderId,orderInfo.addrRetailer)
          .send({from:accounts[0],gas:10000000,value:orderInfo.price});
        alert('sucessfully delivered');        
      }
      catch{
        alert('metamask error');
      }
      this.setState({wait:false});

    }
  }


  render(){
    if(!this.state.orders.length){
      return (<div>you have not ordered any items</div>);
    }
    else{
      return (
        <div style={{padding:"1px"}}>
        <h2><b>My Orders</b></h2>
          {this.state.orders.slice().sort((a,b)=>a.orderId<b.orderId?1:-1).map(order=>(
            

            <div style={{backgroundColor:order.orderStatus=="6" || order.orderStatus=="5"?'#D5FEB6':order.orderStatus=='3'?'#A1FCD3':'#A1CDFC',margin:"10px 10px 10px 10px"}} key={order.orderId}>
              <Link style={{textDecoration: "none",color:"black",textAlign:"left"}} to={`/order/${order.itemId}/${order.addrRetailer}`}>
              <div style={{marginLeft:"10px"}}>OrderId: {order.orderId}</div>
              <div style={{marginLeft:"10px"}}>Total Cost: {order.price/1000000000000000000} ether</div>
              <div style={{marginLeft:"10px"}}>Quantity: {order.quantity}</div>
              <div style={{marginLeft:"10px"}}>Order Status: {order.orderStatus}</div>
              <div style={{marginLeft:"10px"}}>ItemId : {order.itemId}</div>
              <div style={{marginLeft:"10px"}}>Delivery Address : {order.deliveryAddress}</div>
              <div style={{marginLeft:"10px"}}>Retailer: {order.addrRetailer}</div>
              <div style={{marginLeft:"10px"}}>Customer: {order.addrCustomer}</div>
              
              
            </Link>
            {(order.orderStatus==3)?
                (<div>{this.state.wait?(<><Spinner animation="border" variant="primary" /></>):(<><Button onClick={this.onDeliver(order.orderId)}>Deliver</Button></>)}</div>):
                (<div>{(order.orderStatus==5 || order.orderStatus==6)?
                (<div style={{color:"green"}}>Order Delivered</div>):
                (<div>{(order.orderStatus==1 || order.orderStatus==2)?
                  (<div>Waiting retailer to dispatch</div>):(<div></div>)}</div>)
                }</div>)
              }
            </div>
           


            ))}

        </div>
      ); 
    }
    
  }
  
}

export default CustomerOrder;
