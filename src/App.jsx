import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("home"); 
  const [expandedId, setExpandedId] = useState(null);

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
        <div className="header-brand">
          <h1 className="main-title" onClick={() => setView("home")}>
            Aroma<span className="highlight">Gourmet</span>
          </h1>
        </div>

        <nav className="nav-bar">
          <button 
            onClick={() => setView("home")} 
            className={`nav-btn-special ${view === "home" ? "active" : ""}`}
          >
            <span>Tienda</span>
            <div className="dot"></div>
          </button>
          
          <button 
            onClick={() => setView("about")} 
            className={`nav-btn-special ${view === "about" ? "active" : ""}`}
          >
            <span>Nosotros</span>
            <div className="dot"></div>
          </button>

          <button 
            onClick={() => document.querySelector('.modern-footer').scrollIntoView({ behavior: 'smooth' })} 
            className="nav-btn-special"
          >
            <span>Contacto</span>
            <div className="dot"></div>
          </button>
          
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Buscar sabor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </nav>
      </header>

      <main className="main-layout">
        {view === "home" ? (
          <>
            <section className="products-section">
              <h2 className="section-title">Nuestra Colección</h2>
              <div className="products-grid">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className={`card ${expandedId === prod.id ? 'expanded' : ''}`}>
                    <div className="clickable-area" onClick={() => setExpandedId(expandedId === prod.id ? null : prod.id)}>
                        {prod.image && <img src={prod.image} alt={prod.name} className="card-img" />}
                    </div>
                    <div className="card-body">
                      <div className="card-title-row" onClick={() => setExpandedId(expandedId === prod.id ? null : prod.id)}>
                        <h3>{prod.name}</h3>
                        <span className="expand-icon">{expandedId === prod.id ? '−' : '+'}</span>
                      </div>
                      
                      <div className={`description-panel ${expandedId === prod.id ? 'show' : ''}`}>
                        <p className="card-desc">{prod.description}</p>
                      </div>

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
                  {cart.length === 0 ? <p className="empty-msg">Tu carrito está esperando algo especial.</p> : cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="cart-item-subtotal">${item.price * item.quantity}</span>
                      </div>
                      <div className="cart-controls-modern">
                        <button className="modern-ctrl-btn" onClick={() => removeFromCart(item.id)}>−</button>
                        <span className="modern-qty">{item.quantity}</span>
                        <button className="modern-ctrl-btn" onClick={() => addToCart(item)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="cart-total-container">
                    <p className="total-label">Total: <span className="total-amount">${total}</span></p>
                    <button onClick={enviarWhatsApp} className="btn-whatsapp-send">Finalizar Pedido</button>
                  </div>
                )}
              </div>
            </aside>
          </>
        ) : (
          <section className="about-premium">
            <div className="about-hero">
                <span className="about-badge">San Miguel de Tucumán</span>
                <h2 className="about-main-title">Pasión por el Detalle</h2>
                <p className="about-lead">En AromaGourmet, entregamos experiencias sensoriales que transforman tu cocina.</p>
            </div>
            
            <div className="about-grid">
                <div className="about-card">
                    <div className="about-card-header">
                      <span className="about-card-number">01</span>
                      <h4>¿Por qué elegirnos?</h4>
                    </div>
                    <p>Porque en <strong>AromaGourmet</strong> entendemos que un gran plato comienza mucho antes de llegar a la cocina: empieza en la elección del condimento perfecto.
                    <br/><br/>
                    Somos perfeccionistas por convicción. Seleccionamos cada materia prima con una rigurosidad absoluta. Trabajamos únicamente con ingredientes de calidad superior, pensados para realzar el sabor auténtico.</p>
                </div>

                <div className="about-card">
                    <div className="about-card-header">
                      <span className="about-card-number">02</span>
                      <h4>Sabor Exquisito</h4>
                    </div>
                    <p>Nuestros productos conservan intacta la esencia pura de cada ingrediente, respetando su origen y su aroma natural.
                    <br/><br/>
                    Cada mezcla está pensada para ofrecer una experiencia refinada, donde los matices se perciben con claridad y elevan cada preparación a su máxima expresión.</p>
                </div>

                <div className="about-card">
                    <div className="about-card-header">
                      <span className="about-card-number">03</span>
                      <h4>Dedicación total</h4>
                    </div>
                    <p>Orgullosamente tucumanos, elaboramos cada pedido con el compromiso de quienes honran su origen y respetan la excelencia.
                    <br/><br/>
                    Combinamos la tradición local con un estándar gourmet exigente. Cada preparación es tratada como única, porque el verdadero valor está en hacer las cosas bien.</p>
                </div>
            </div>
          </section>
        )}
      </main>

      <footer className="modern-footer">
        <div className="footer-content">
            <div className="footer-col">
                <h3 className="footer-logo">Aroma<span>Gourmet</span></h3>
                <p>La excelencia de Tucumán en tu mesa.</p>
            </div>
            <div className="footer-col">
                <h4>Contacto</h4>
                <div className="contact-info-footer">
                  <p>📍 San Miguel de Tucumán</p>
                  <p>📞 381 685120</p>
                </div>
            </div>
            <div className="footer-col">
                <h4>Nuestras Redes</h4>
                <div className="social-links-container">
                  <a href="https://wa.me/549381685120" target="_blank" rel="noreferrer" className="social-card wa">
                    <div className="social-icon-wrapper">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" />
                    </div>
                    <div className="social-info">
                      <span className="social-label">Chat Directo</span>
                      <span className="social-name">WhatsApp</span>
                    </div>
                  </a>
                  <a href="https://instagram.com/aroma_gourmet_tuc" target="_blank" rel="noreferrer" className="social-card ig">
                    <div className="social-icon-wrapper">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="IG" />
                    </div>
                    <div className="social-info">
                      <span className="social-label">Seguinos</span>
                      <span className="social-name">Instagram</span>
                    </div>
                  </a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AromaGourmet. Hecho con ❤️ en Tucumán.</p>
          <p>Alexis Trejo

          </p>
        </div>
      </footer>

      <a href="https://wa.me/549381685120" className="whatsapp-float-btn" target="_blank" rel="noopener noreferrer">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="whatsapp-icon-img" />
      </a>
    </div>
  );
};

export default App;