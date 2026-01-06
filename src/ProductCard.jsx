import React from 'react';


const ProductCard = ({ item, onAdd }) => {
  // Verificación de seguridad para evitar errores de "undefined"
  if (!item) return null;

  return (
    <div className="product-card-container" style={{
      background: '#1e211e', 
      borderRadius: '15px', 
      overflow: 'hidden',
      border: '1px solid #333', 
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
        <img 
          src={item.img} 
          alt={item.nombre} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.5s' 
          }} 
          // Si la imagen de internet falla, se mantiene el fondo oscuro
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Especias'; }}
        />
      </div>
      
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '10px' }}>
          {item.nombre}
        </h3>
        
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>
          {item.desc}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#f59e0b', fontSize: '1.6rem', fontWeight: 'bold' }}>
            ${item.precio}
          </span>
          <button 
            onClick={() => onAdd(item)}
            style={{ 
              background: '#4ade80', 
              color: '#000',
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              transition: '0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#22c55e'}
            onMouseOut={(e) => e.target.style.background = '#4ade80'}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;