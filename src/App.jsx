import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore'; 
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const listaEspecias = querySnapshot.docs.map(doc => ({
          id: doc.id,
          // Cambiamos 'name' por 'title' para que coincida con tu Firebase
          name: doc.data().title, 
          price: doc.data().price,
          description: doc.data().descripción // con acento como en tu foto
        }));
        setProducts(listaEspecias);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar:", error);
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const addToCart = (product) => {
    const itemExiste = cart.find(item => item.id === product.id);
    if (itemExiste) {
      updateQuantity(product.id, 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, cambio) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.quantity + cambio;
        return { ...item, quantity: nuevaCantidad < 1 ? 1 : nuevaCantidad };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handlePayment = () => {
    if (cart.length === 0) return alert("El carrito está vacío.");
    alert(`Compra exitosa. Total: $${total}`);
    setCart([]); 
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Aroma<span className="logo-highlight">Gourmet</span></div>
      </nav>

      <main className="main-content">
        <section className="products-grid">
          <h2>Nuestros Condimentos</h2>
          {loading ? (
            <p>Cargando condimentos...</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="card-footer">
                  <span className="price">${product.price}</span>
                  <button className="btn-add" onClick={() => addToCart(product)}>
                    Agregar +
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <aside className="cart-section">
          <div className="cart-box">
            <h3>Mi Carrito</h3>
            <hr />
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.6 }}>No hay productos seleccionados</p>
            ) : (
              <ul className="cart-list">
                {cart.map(item => (
                  <li key={item.id} className="cart-item">
                    <div className="item-info">
                      <strong>{item.name}</strong>
                      <span>${item.price * item.quantity}</span>
                    </div>
                    <div className="item-controls">
                      <div className="qty-buttons">
                        <button className="btn-qty" onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button className="btn-qty" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="total-row">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <button className="btn-pay" onClick={handlePayment}>Finalizar Pago</button>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <p>Gracias por visitarnos</p>
        <div className="social-links">
          <span>Facebook</span> | <span>Instagram</span> | <span>WhatsApp</span>
        </div>
        <p className="footer-slogan">Puedes seguirnos en nuestras redes</p>
      </footer>
    </div>
  );
};

export default App;