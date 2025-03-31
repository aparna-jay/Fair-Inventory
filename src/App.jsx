import { useState, useEffect } from "react";
import './App.css';

function App() {
  // Initialize inventory from local storage or set default values
  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem("inventory");
    return savedInventory ? JSON.parse(savedInventory) : {
      "Chili Powder 500 g": { quantity: 6, price: 540 },
      "Chili Powder 250 g": { quantity: 12, price: 300 },
      "Curry Powder 250 g": { quantity: 12, price: 360 },
      "Curry Powder 100 g": { quantity: 12, price: 140 },
      "Meat Curry Powder 100g": { quantity: 1, price: 220 },
      "Chilly Pieces 100 g": { quantity: 12, price: 120 },
      "Turmeric Powder 50g": { quantity: 12, price: 240 },
      "Pepper Powder 50 g ": { quantity: 12, price: 200 },
      "Clove 20 g": { quantity:	12,price: 100 },
      "Mustard 50g": { quantity: 12, price: 35 },
      "Fenugreek 50g": { quantity: 12, price: 35 },
      "Kurakkan Flour 400g": { quantity: 6, price: 300 },
      "Signal Toothpaste 160g": { quantity: 3, price: 220 },
      "Fortune Coconut Oil 1Ltr": { quantity: 3, price: 975 },
      "Sunquick 300 ml": { quantity: 5, price: 580 },
      "Viva 400g": { quantity: 5, price: 650 },
      "Tea 200g": { quantity: 5, price: 575 },
      "Yahaposha 500g": { quantity: 2, price: 360 },
      "Sunlight Washing Power 1 kg": { quantity: 3, price: 300 },
      "Tomato Sauce 405g": { quantity: 5, price: 450 },
      "Vim Dish-wash 500 ml": { quantity: 8, price: 350 },
    };
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [totalSales, setTotalSales] = useState(() => {
    const savedTotalSales = localStorage.getItem("totalSales");
    return savedTotalSales ? JSON.parse(savedTotalSales) : 0;
  });
  const [salesHistory, setSalesHistory] = useState(() => {
    const savedSalesHistory = localStorage.getItem("salesHistory");
    return savedSalesHistory ? JSON.parse(savedSalesHistory) : [];
  });

  // Update local storage whenever inventory, cart, totalSales, or salesHistory changes
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("totalSales", JSON.stringify(totalSales));
  }, [totalSales]);

  useEffect(() => {
    localStorage.setItem("salesHistory", JSON.stringify(salesHistory));
  }, [salesHistory]);

  const addToCart = (item, quantity) => {
    // Check if quantity is valid
    if (quantity > inventory[item].quantity) {
      alert(`You cannot add more than ${inventory[item].quantity} items of ${item} to the cart.`);
      return;
    }
    if (quantity <= 0) {
      alert(`Please select the quantity`);
      return;
    }


    // Check if the item already exists in the cart
    const existingItem = cart.find((cartItem) => cartItem.name === item);

    if (existingItem) {
      // Update quantity if the item already exists in the cart
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.name === item
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      // Add a new item to the cart
      setCart((prevCart) => [
        ...prevCart,
        { name: item, price: inventory[item].price, quantity },
      ]);
    }

    // Update inventory after adding to the cart
    setInventory((prev) => {
      const newInventory = {
        ...prev,
        [item]: {
          ...prev[item],
          quantity: prev[item].quantity - quantity,
        },
      };
      return newInventory;
    });

    // Update total sales
    setTotalSales((prevSales) => prevSales + inventory[item].price * quantity);
  };

  const removeFromCart = (itemName) => {
    const itemToRemove = cart.find((item) => item.name === itemName);
  
    if (itemToRemove) {
      // Return the quantity back to the inventory
      setInventory((prevInventory) => ({
        ...prevInventory,
        [itemName]: {
          ...prevInventory[itemName],
          quantity: prevInventory[itemName].quantity + itemToRemove.quantity,
        },
      }));
  
      // Remove item from cart
      setCart((prevCart) => prevCart.filter((item) => item.name !== itemName));
  
      // Update total sales accordingly
      setTotalSales((prevSales) => prevSales - itemToRemove.price * itemToRemove.quantity);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const resetCart = () => {
    // Save the current cart as a completed sale in the sales history
    if (cart.length > 0) {
      const saleTotal = calculateTotalPrice();
      setSalesHistory((prevHistory) => [
        { cart, total: saleTotal, date: new Date().toLocaleString() },
        ...prevHistory, // Add the latest sale at the top
      ]);
    }

    // Reset the cart after the sale is recorded
    setCart([]);
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>Inventory Tracker</h1>
        <div className="inventory">
          {Object.keys(inventory).map((item) => (
            <div key={item} className="item">
              <span className="item-name">{item} -  Rs. {inventory[item].price} each</span>
              <span className="item-quantity">
                {inventory[item].quantity} left
              </span>
              
              <span className="item-price"></span>

              <input
                type="number"
                min="1"
                max={inventory[item].quantity}
                id={`quantity-${item}`}
                defaultValue={1}
              />
              <br />
              <button
                onClick={() => {
                  const quantity = parseInt(
                    document.getElementById(`quantity-${item}`).value
                  );
                  addToCart(item, quantity);
                }}
                disabled={inventory[item].quantity === 0}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="right-section">
        <hr />

        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name} (Rs. {item.price} x {item.quantity})</span> = Rs.{" "}
                {item.price * item.quantity}
                <button className="remove-btn" onClick={() => removeFromCart(item.name)}>X</button>
              </div>
            ))}
          </div>
        )}

        

        <div className="totals">
          <h3>Total Bill: Rs. {calculateTotalPrice()}</h3>
        </div>

        <button className="reset-btn" onClick={resetCart}>
          Next Customer
        </button>
        <hr />

        {/* Display Sales History */}
        <h2>Sales History</h2> <h3>Total Sales: Rs. {totalSales}</h3>
        {salesHistory.length === 0 ? (
          <p>No sales history available.</p>
        ) : (
          salesHistory.reverse().map((sale, index) => (
            <div key={index} className="sale-entry">
              <h4>Order #{salesHistory.length - index} - {sale.date}</h4> {/* Proper Sale Numbering */}
              {sale.cart.map((item, idx) => (
                <div key={idx}>
                  <span>{item.name} (Rs. {item.price} x {item.quantity})</span> = Rs.{" "}
                  {item.price * item.quantity}
                </div>
              ))}
              <br />
              <strong>Total: Rs. {sale.total}</strong>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
