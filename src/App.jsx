import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("home"); // Estado para cambiar de página

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const listaEspecies = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const rawPrice = data.price || data.precio || 0;
          const cleanPrice = typeof rawPrice === 'string' 
            ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) 
            : rawPrice;

          return {
            id: doc.id,
            name: data.title || data.nombre || "Producto",
            price: isNaN(cleanPrice) ? 0 : cleanPrice,
            description: data.descripción || data.description || "Calidad Gourmet",
            image: data.image || ""
          };
        });
        setProducts(listaEspecies);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar:", error);
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const enviarWhatsApp = () => {
    const telefono = "549381685120"; 
    const mensajeItems = cart.map(i => `- ${i.name} x${i.quantity}: $${i.price * i.quantity}`).join('%0A');
    const mensajeFinal = `Hola AromaGourmet! Quiero realizar un pedido:%0A%0A${mensajeItems}%0A%0A*Total a pagar: $${total}*`;
    const url = `https://wa.me/${telefono}?text=${mensajeFinal}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="loading-screen">Cargando AromaGourmet...</div>;

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="main-title" onClick={() => setView("home")} style={{cursor:'pointer'}}>
            Aroma<span className="highlight">Gourmet</span>
          </h1>
          <nav className="nav-menu">
            <button onClick={() => setView("home")} className={view === "home" ? "active" : ""}>Inicio</button>
            <button onClick={() => setView("about")} className={view === "about" ? "active" : ""}>Nosotros</button>
          </nav>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Busca tus especias..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>

      <main className="main-layout">
        {view === "home" ? (
          <>
            <section className="products-section">
              <h2 className="section-title">Nuestra Colección</h2>
              <div className="products-grid">
                {filteredProducts.map((prod) => (
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
                <h2 className="cart-title">🛒 Carrito</h2>
                <div className="cart-items">
                  {cart.length === 0 ? <p className="empty-msg">Vacío</p> : cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <span>{item.name}</span>
                        <span className="cart-item-subtotal">${item.price * item.quantity}</span>
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => removeFromCart(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="cart-total-container">
                    <p>Total: ${total}</p>
                    <button onClick={enviarWhatsApp} className="btn-whatsapp-send">Pedir por WhatsApp</button>
                  </div>
                )}
              </div>
            </aside>
          </>
        ) : (
          <section className="about-page">
            <div className="about-hero">
              <h2>Nuestra Historia</h2>
              <p>En <strong>AromaGourmet</strong>, creemos que la cocina es un arte que comienza con los ingredientes correctos. Desde hace años, recorremos los mejores cultivos para traer a tu mesa especias puras, sin mezclas y de origen controlado.</p>
              <div className="about-grid">
                <div className="about-info-card">
                  <h3>Calidad Certificada</h3>
                  <p>Cada producto pasa por un control de frescura para asegurar que el aroma que llega a tu hogar sea inigualable.</p>
                </div>
                <div className="about-info-card">
                  <h3>Sustentabilidad</h3>
                  <p>Trabajamos directamente con pequeños productores, fomentando el comercio justo y técnicas de cultivo orgánico.</p>
                </div>
              </div>
              <button onClick={() => setView("home")} className="btn-back">Ver Productos</button>
            </div>
          </section>
        )}
      </main>

      <footer className="modern-footer">
        <div className="footer-top">
          <div className="footer-brand-col">
            <h2 className="footer-logo">Aroma<span>Gourmet</span></h2>
            <p>Llevando la esencia de la naturaleza a tu cocina desde 2026. Calidad premium en cada especia.</p>
          </div>
          <div className="footer-links-col">
            <h4>Navegación</h4>
            <ul>
              <li onClick={() => setView("home")}>Tienda</li>
              <li onClick={() => setView("about")}>Sobre Nosotros</li>
              <li>Términos y Condiciones</li>
            </ul>
          </div>
          <div className="footer-social-col">
            <h4>Contacto</h4>
            <p>📍 Tucumán, Argentina</p>
            <p>📞 +54 9 381 685120</p>
            <div className="social-icons-row">
              <a href="#">IG</a>
              <a href="#">FB</a>
              <a href="#">WA</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AromaGourmet. Todos los derechos reservados.</p>
        </div>
      </footer>

      <a href="https://wa.me/+549381685120" className="whatsapp-float-btn" target="_blank" rel="noopener noreferrer">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" />
      </a>
    </div>
  );
};

export default App;