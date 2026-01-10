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
        const listaEspecies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().title,
          price: doc.data().price,
          description: doc.data().descripción,
          image: doc.data().image 
        }));
        setProducts(listaEspecies);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar:", error);
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const addToCart = (product) => {
    setCart(currItems => {
      const isItemInCart = currItems.find((item) => item.id === product.id);
      if (isItemInCart) {
        return currItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(currItems => {
      const item = currItems.find((i) => i.id === id);
      if (item?.quantity === 1) {
        return currItems.filter((i) => i.id !== id);
      } else {
        return currItems.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
    });
  };

  const deleteFromCart = (id) => {
    setCart(currItems => currItems.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Función corregida con formato internacional 549...
  const enviarWhatsApp = () => {
    const telefono = "549381685120"; 
    const mensajeItems = cart.map(i => `- ${i.name} x${i.quantity}: $${i.price * i.quantity}`).join('%0A');
    const mensajeFinal = `Hola AromaGourmet! Quiero realizar un pedido:%0A%0A${mensajeItems}%0A%0A*Total a pagar: $${total}*`;
    
    const url = `https://wa.me/${telefono}?text=${mensajeFinal}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="loading">Cargando AromaGourmet...</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Aroma<span className="highlight">Gourmet</span></h1>
      </header>

      <main className="main-layout">
        <section className="products-section">
          <h2 className="section-title">Nuestros Condimentos</h2>
          <div className="products-grid">
            {products.map((prod) => (
              <div key={prod.id} className="card">
                {prod.image && <img src={prod.image} alt={prod.name} className="card-img" />}
                <div className="card-body">
                  <h3>{prod.name}</h3>
                  <p className="card-desc">{prod.description}</p>
                  <div className="card-footer">
                    <span className="price">${prod.price}</span>
                    <button onClick={() => addToCart(prod)} className="btn-add">Agregar +</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="cart-sidebar">
          <div className="cart-sticky">
            <h2>🛒 Mi Carrito</h2>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-msg">No hay productos seleccionados</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-subtotal">${item.price * item.quantity}</span>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => removeFromCart(item.id)}>-</button>
                      <span className="qty">{item.quantity}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                      <button onClick={() => deleteFromCart(item.id)} className="btn-del">×</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-total">
                <div className="total-line">
                  <span>Total:</span>
                  <span className="total-amount">${total}</span>
                </div>
                <button onClick={enviarWhatsApp} className="btn-finalizar">
                   Finalizar Pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Enlace corregido para evitar "Número inválido" */}
      <a 
        href="https://wa.me/+549381685120" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
      </a>
    </div>
  );
};

export default App;