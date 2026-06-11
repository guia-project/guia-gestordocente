import React from 'react';
import logoUPM from '../assets/upm-logo.png';
import logoCAM from '../assets/logo-cam.png';

const Footer = () => {
  return (
    <footer style={{ 
        backgroundColor: '#1e1e1e', // Gris oscuro a juego con tu Top Navbar
        padding: '25px 40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexWrap: 'wrap', // Permite que se adapte en pantallas pequeñas
        gap: '40px', // Separación entre el bloque de logos y el texto
        color: '#aaa', // Texto en gris clarito para no fatigar la vista
        marginTop: 'auto',
        borderTop: '1px solid #333'
    }}>
        
        {/* ==================== BLOQUE IZQUIERDO: LOGOS ==================== */}
        <div style={{ display: 'flex', gap: '15px' }}>
            {/* Tarjeta blanca para el logo de la UPM */}
            <div style={{ backgroundColor: '#ffffff', padding: '10px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <img src={logoUPM} alt="Logo UPM" style={{ maxHeight: '55px' }} />
            </div>
            
            {/* Tarjeta blanca para el logo de la CAM */}
            <div style={{ backgroundColor: '#ffffff', padding: '10px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <img src={logoCAM} alt="Logo Comunidad de Madrid" style={{ maxHeight: '55px' }} />
            </div>
        </div>

        {/* ==================== BLOQUE DERECHO: TEXTO Y ENLACE ==================== */}
        <div style={{ maxWidth: '800px', textAlign: 'left', lineHeight: '1.6', fontSize: '0.85rem' }}>
            <p style={{ margin: 0 }}>
                Este portal se enmarca en el ecosistema de servicios desarrollados en el contexto del{' '}
                <a
                    href="https://guia-project.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                    proyecto GUIA (M230020126A-AJCA)
                </a>
                . Acción financiada por la Comunidad de Madrid en el marco del Convenio entre la Comunidad de Madrid y la Universidad Politécnica de Madrid para la concesión de una subvención directa para el fomento y promoción de la investigación y la transferencia de tecnología 2023-2026, Línea de actuación A, Doctores Emergentes.
            </p>
        </div>

    </footer>
  );
};

export default Footer;