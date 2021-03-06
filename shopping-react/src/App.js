import './App.css';
import AppClass from './AppClass';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import SideNav from './components/SideNav';
import Signup from './Signup';
import NavBar from './NavBar';
import AddItem from './AddItem';
import RetailerOrder from './RetailerOrder';
import CustomerOrder from './CustomerOrder';
import Order from './Order';
import ItemInfo from './ItemInfo';
import RetailerInfo from './RetailerInfo';
import CustomerInfo from './CustomerInfo';


function App() {
  return (
    <div className="App">
    <NavBar/>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={AppClass}exact/>
          <Route path="/second" component={SideNav}/>
          <Route path="/additem" component={AddItem}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/ret_order" component={RetailerOrder}/>
          <Route path="/cust_order" component={CustomerOrder}/>
          <Route path="/order/:id/:addr" component={Order}/>
          <Route path="/item_info/:id/:addr" component={ItemInfo}/>
          <Route path="/ret_info" component={RetailerInfo}/>
          <Route path="/cust_info" component={CustomerInfo}/>

          
        </Switch>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
