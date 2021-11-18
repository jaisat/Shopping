import AddItem from './AddItem';
import React,{Component} from 'react';
import retailer from './retailer';
import customer from './customer';
import web3 from './web3';
import {Card,Button,Placeholder,Form,FormControl,Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';


class RetailerClass extends Component{
// 
  constructor(props){
    super(props);
    this.state={
    items:[],
    searchText:'',
    wait:false

  }  
}
  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    var _items=await retailer.methods.getItems().call({from:accounts[0]});
    this.setState({items:_items})
    // console.log(_items)
  }

  changeText=async(event)=>{
    this.setState({searchText:event.target.value.toLowerCase()});
  }
  searchClick=async(event)=>{
    event.preventDefault();
    this.setState({wait:true});
    const accounts=await web3.eth.getAccounts();
    var data=[];
    var v=await retailer.methods.getItems().call({from:accounts[0]});
    this.setState({items:v});
    if(this.state.searchText.length>2){
      var search=this.state.searchText.split(' ');
      console.log(search);
      for(var i=0;i<v.length;i++){
        var b=false;
        for(var j=0;j<search.length;j++){
          if(search[j].length>1){
             if(v[i].title.toLowerCase().includes(search[j]) || v[i].description.toLowerCase().includes(search[j])){
              b=true;
             } 
          }
          
        }
        if(b){
          data.push(v[i]);
        }
        
      }
      this.setState({items:data});      
    }
   this.setState({wait:false});

  }


  render(){
    let templateAllItems
    let templateSearch
    let templateWait
    templateSearch=<div>
      <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            onChange={this.changeText}
            className="mr-2"
            style={{borderStyle:"solid",borderColor:"blue"}}
            aria-label="Search"
          />
          <Button type="submit" onClick={this.searchClick} variant="outline-success">Search</Button>
        </Form>
    </div>
     templateWait=<div><Spinner animation="border" variant="info" /></div>
          return (
          <div>
          {templateSearch}
          {!this.state.items.length?(<>{this.state.wait?(<>{templateWait}</>):(<></>)}<br/><b style={{color:"red"}}>no item found!!!</b> </>):(

            <>
            {this.state.wait?(<>{templateWait}</>):(<></>)}
            {this.state.items.slice().sort((a,b)=>a.itemId<b.itemId?1:-1).map(item=>(

              <Link to={`/item_info/${item.itemId}/${item.addrRetailer}`}>
              <div style={{display:"contents",float:"left",margin:"10px 10px 10px  10px"}} className="d-flex justify-content-around" key={item.itemId} >
          
              
  <Card style={{width:"360px",backgroundColor:"#F5F7BB"}}>
   <Card.Img style={{width:"360px",height:"250px"}} variant="top" src={item.imgLink} />
    <Card.Body>

      <Card.Title>{item.title}</Card.Title>
      <Card.Text style={{textAlign:'left'}}>
        <div>><b>price :</b> {item.price/1000000000000000000} ether</div>
        <div style={{height:"60px",lineHeight:"20px",overflow:"hidden "}}>><b>Detail:</b> {item.description}, id: {item.itemId}</div>

       <div>{item.availableCashOnDelivery ?
                (
                  <div>><b>cash on delivery :</b>Yes</div>
                    ) : (
                      <div>><b>cash on delivery :</b>No</div>
                    )}
                </div>
            <div>><b>Available Quantity :</b> {item.quantity}</div>
      </Card.Text>
                </Card.Body>
  </Card>


                
                

              </div>
              </Link>


              ))}
            </>
            )}

          </div>
        );
  }
  
}

export default RetailerClass;
