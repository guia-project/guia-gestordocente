import React from 'react';

/**
 * Componente reutilizable de Interfaz de Usuario (UI) que renderiza una ventana modal flotante.
 * Utiliza el patrón de "Composición" mediante la prop especial `children` para inyectar 
 * cualquier tipo de contenido dinámico en su interior sin conocerlo de antemano.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Estado que determina si el modal debe ser visible (true) o no (false).
 * @param {function} props.onClose - Función callback que se ejecuta al pulsar el botón de cerrar o la 'X'.
 * @param {string} props.titulo - Texto que se mostrará en la cabecera del modal.
 * @param {React.ReactNode} props.children - El contenido interno (formularios, listas, textos) que React inyectará dentro del cuerpo del modal.
 * @returns {React.ReactElement|null} El elemento JSX del modal o null si isOpen es falso.
 */
export default function Modal({ isOpen, onClose, titulo, children }) {
    // 1. RENDERIZADO CONDICIONAL (Early Return)
    // Si la variable isOpen es falsa, cortamos la ejecución aquí. 
    // React no pintará absolutamente nada en el DOM, ahorrando memoria y rendimiento.
    if (!isOpen) return null;

    return (
        // 2. EL OVERLAY (Fondo oscuro)
        // position: 'fixed' lo saca del flujo normal de la web y lo ancla a la pantalla.
        // zIndex: 9999 asegura que esta capa se ponga por encima de TODOS los demás elementos de la web.
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, padding: '20px',
            backdropFilter: 'blur(4px)' // Efecto visual moderno tipo "cristal esmerilado"
        }}>
            
            {/* 3. EL CONTENEDOR DEL MODAL (La ventana física) */}
            <div style={{
                backgroundColor: '#1e1e1e', 
                borderRadius: '12px',
                width: '100%', 
                maxWidth: '800px', 
                maxHeight: '90vh', // 90% de la altura de la pantalla (ViewHeight) para que no se corte
                display: 'flex', 
                flexDirection: 'column', // Organiza Cabecera, Cuerpo y Pie en formato columna
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid #333'
            }}>
                
                {/* --- CABECERA --- */}
                <div style={{
                    padding: '20px 25px', borderBottom: '1px solid #333',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, color: '#e0e0e0', fontSize: '20px' }}>{titulo}</h3>
                    
                    {/* Botón de cerrar superior */}
                    <button type="button" onClick={onClose} style={{
                        background: 'transparent', border: 'none', color: '#888',
                        fontSize: '28px', cursor: 'pointer', lineHeight: '1'
                    }} onMouseOver={(e) => e.target.style.color = '#ef4444'} onMouseOut={(e) => e.target.style.color = '#888'}>
                        &times;
                    </button>
                </div>

                {/* --- CUERPO (CONTENIDO DINÁMICO) --- */}
                {/* overflowY: 'auto' es crítico aquí. Si el contenido (children) es muy largo, 
                    solo esta parte de la caja tendrá scroll, manteniendo fijas la cabecera y el pie. */}
                <div style={{ padding: '25px', overflowY: 'auto', flex: 1 }}>
                    {children}
                </div>

                {/* --- PIE DE PÁGINA (ACCIONES) --- */}
                <div style={{
                    padding: '20px 25px', borderTop: '1px solid #333',
                    display: 'flex', justifyContent: 'flex-end', backgroundColor: '#1a1a1a',
                    borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px'
                }}>
                    {/* Botón de acción principal */}
                    <button type="button" onClick={onClose} style={{
                        backgroundColor: '#3b82f6', color: 'white', border: 'none',
                        padding: '12px 24px', borderRadius: '8px', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '15px'
                    }}>
                        Listo / Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}