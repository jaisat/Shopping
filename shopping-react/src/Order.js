
import React,{useState,useEffect,useCallback} from 'react';
import retailer from './retailer';
import customer from './customer';
import web3 from './web3';
import { useParams} from 'react-router-dom'
import {Button,Card,Spinner} from 'react-bootstrap';



const Order=()=>{ 
  const parms= useParams();
  const [address,setAddress]=useState('');
  const [quantity,setQuantity]=useState(0);
  const [price,setPrice]=useState(0);
  const [item,setItem]= useState({});
  const [wait,setWait]=useState(false);

  function handleInputChange(event){
    setAddress(event.target.value)
  }
  function handleQuantity(event){
    setQuantity(event.target.value);
    // setPrice(prev=>item.price*quantity/1000000000000000000);
  }

  const payLaterOrder = useCallback(async () => {
    const accounts=await web3.eth.getAccounts();
    if(!await customer.methods.isValidUser().call({from:accounts[0]})){
      alert('signup first');
    }
    else if(!address.length){
      alert('enter address');
    }
    else if(quantity<=0){
      alert('enter valid quantity');
    }
    else{

      const itemInfo=await retailer.methods.getItemInfo(parms.id,parms.addr).call();
      if(itemInfo.quantity-quantity>=0){
        setWait(true);
        try{
         await customer.methods.cashOnDeliveryOrder(parms.addr,itemInfo.price,parms.id,address,quantity).send({
          from:accounts[0],gas:10000000
        })
         alert('order done');
       }
         catch{
          alert('metamask error');
         }
        setWait(false);
      }
      else{
        alert('item quantity not available');

      }
      
    }
  },[handleInputChange,handleQuantity]);

  const payOrder = useCallback(async () => {
    const accounts=await web3.eth.getAccounts();  
    if(!await customer.methods.isValidUser().call({from:accounts[0]})){
      alert('signup first');
    }
    else if(!address.length){
      alert('enter address');
    }
    else if(quantity<=0){
      alert('enter valid quantity');
    }
    else{
      const itemInfo=await retailer.methods.getItemInfo(parms.id,parms.addr).call();
      if(itemInfo.quantity-quantity>=0){
        setWait(true);
        try{
            await customer.methods.payOnOrder(parms.addr,itemInfo.price,parms.id,address,quantity).send({
            from:accounts[0],gas:10000000,value:itemInfo.price*quantity
          })
          alert('order done');
        }
        catch{
          alert('metamask error');
        }

        setWait(false);
      }
      else{
        alert('item quantity not available');
      }
      
    }
  },[handleInputChange,handleQuantity]);

  useEffect(()=>{
    async function result(){
      const accounts=await web3.eth.getAccounts();
      const itemInfo=await retailer.methods.getItemInfo(parms.id,parms.addr).call({from:accounts[0]});
      setItem(itemInfo);
      console.log('yes')
    }
    result();
    
  },[]);

  


   return (
    <div style={{margin:"10px 10px 10px 10px"}}>

      <div  className="d-flex justify-content-around">
        <Card style={{backgroundColor:"#FEC5F7",width:"1500px",height: "auto"}}>
        <Card.Img style={{width:"360px",height:"250px",marginLeft:"auto",marginRight:'auto'}} variant="top" src={item.imgLink} />
          <Card.Body >
            <Card.Title >{item.title}</Card.Title>
            <Card.Text style={{textAlign:'left'}}>
             <div>><b>price :</b> {item.price/1000000000000000000} ether</div>
             <div>><b>Available quantity :</b> {item.quantity} </div>
               <div >><b>Detail:</b> {item.description}</div>
              <div><b>Delivery Address:</b></div>
               <div ><textarea style={{backgroundColor:"#FAFDEC",width:"450px",height:"100px"}} type="text" onChange={handleInputChange}></textarea></div>
               <div>Quntity:<input type="number" onChange={handleQuantity}/> Price: {quantity*item.price/1000000000000000000} ether</div>
            </Card.Text>
            {item.availableCashOnDelivery?(<div>{wait?(<> <Spinner animation="border" variant="success" /></>):(<><Button onClick={payOrder}> Pay and Order</Button><br/><br/>
                <Button onClick={payLaterOrder}>Order and pay later</Button></>)}</div>):(<div>{wait?(<><Spinner animation="border" variant="success" /></>):(<><Button onClick={payOrder}>pay and Order</Button></>)}</div>)}
          </Card.Body>
        </Card>
      </div>

    </div>
  );
};

export default Order;
