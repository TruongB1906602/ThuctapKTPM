import React, { useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getTableDetails,} from "../../actions/TableActions";
import MetaData from "../../more/Metadata";
import "./Productdetails.css";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../more/Loader";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { getProduct } from "../../actions/ProductActions";
import RemoveIcon from '@mui/icons-material/Remove';
import { encode } from "base-64";
const TableDetails = ({ match }) => {
 
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  
  const { products,  error} = useSelector(
    (state) => state.products
  );
  const { table, loading } = useSelector(
    (state) => state.tableDetails
  );


  useEffect(() => {
    dispatch(getProduct());
    dispatch(getTableDetails(match.params.id));
  }, [dispatch, match.params.id, error]);
  

  const handleFoodChange = (event) => {
    const productId = event.target.value;
    const product = products.find((product) =>product._id === productId );

    const quantity = parseInt(event.target.dataset.quantity);
    console.log(productId)
    const existingItem = orderItems.find((item) => item.product._id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = {
        product,
        quantity,
      };
      console.log(newItem)
      setOrderItems([...orderItems, newItem]);
    }

    setTotal(total + product.price * quantity);


  };

  const handleRemoveItem = (index) => {
    const removedItem = orderItems[index];
    const newItems = orderItems.filter((item, i) => i !== index);
    setOrderItems(newItems);
    setTotal(total - removedItem.product.price * removedItem.quantity);
  };
  const handleSubmitOrder = () => {

    if (orderItems.length === 0) {
      alert("Vui lòng chọn món.");
      return;
    }

    const key = encode('1237wefhbhdyqwdyads712812bdqwuwhduqw')
    console.log(process.env.REACT_APP_ORDER);
    const order = {
      table: table.number,
      items: orderItems,
      total,
    };
    axios
      .post(`/api/v3/orders?key=${key}`, order)
      .then((response) => {
        alert("Order placed successfully.");
        
        setOrderItems([]);
        setTotal(0);
      })
      .catch((error) => console.log(error));
 
  };
  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  };
  const increate = (index, quantity) => {
    const updatedItems = [...orderItems];
          updatedItems[index].quantity += quantity;
          setOrderItems(updatedItems);
          setTotal(calculateTotal(updatedItems));
  
  };
  const decreate = (index, quantity) => {
    const updatedItems = [...orderItems];

  if (updatedItems[index].quantity > 1) {
    updatedItems[index].quantity -= 1;
    setOrderItems(updatedItems);
    setTotal(calculateTotal(updatedItems));
  };

}
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title={`Đặt bàn ${table.number}`} />
          <div className="Table">
          <h2 >Bàn số {table.number}</h2>
          <h3>Menu</h3>
      <div className="productsWrapper">
        {products.map((product) => (
          <div className="product"  key={product._id}>
            <h7>{product.name}</h7>
            
  
           <p> Giá {`${ new Intl.NumberFormat('de-DE',{style: 'currency',currency: 
            'VND'}).format( product.price)}`}</p>
         
            <div>
              <a href="#"> <img  style ={{width:"80px"}} src={product.images}  /></a>
             
            </div>


            <div id="btn"> 
              <button
                onClick={handleFoodChange}
                value={product._id}
                data-quantity={1}
              >
                Đặt món
              </button>
              
            </div>
          </div>
        ))}
      </div>
            
          </div>
      <div className="order">
              <h2>Hóa đơn </h2>
          {orderItems.length === 0 ? (
            <p>Chưa có đặt món.</p>
          ) : (
            <div className="cartPage">
              {orderItems.map((item, index) => (
                <div key={index} className="cartContainer">
                 <div className="CartItemCard">
                 <img   style ={{width:"90px", marginRight:"10px"}}  src={item.product.images}  alt="" />
                  <div >


                  <h3>{item.product.name}</h3>
                   
                      <div>
                          
                    <p onClick={() => handleRemoveItem(index)}>Xóa</p>


                      </div>


                 </div>
                  <div className="cartInput">
                              
                        <AddIcon className="icon" onClick={() => increate(index, 1)}>
                                                                    </AddIcon> 

                                                                    {item.quantity}
                        <RemoveIcon  className="icon" onClick={() => decreate(index, 1)}>
                                                                  </RemoveIcon>
                
                  </div>
                  <span>Tạm tính: {`${ new Intl.NumberFormat('de-DE',{style: 'currency',currency: 
                        'VND'}).format( item.product.price * item.quantity)}`}
            
                    </span>
                  </div>
                </div>

                
              ))}

              
            </div>
          )}
        
         
          <div className="cartGrossProfit">
          
              <div className="cartGrossProfitBox">
                <p>Tổng tiền</p>
                <p>{`${
                 new Intl.NumberFormat('de-DE',{style: 'currency',currency: 'VND'}).format(total)
               }`}</p>
               
              </div>      
            </div>

            <div className="order">
              <button className="button2" onClick={handleSubmitOrder}>Đặt hàng</button>
              </div>
          </div>
            


     
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        


         
        </>
      )}
    </>
  );
};

export default TableDetails;