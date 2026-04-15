import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente UI para la gestión de la Bibliografía y Recursos de la asignatura.
 * Maneja un array de objetos donde cada elemento clasifica la referencia 
 * (ej. Libro, Artículo, Web) y almacena su contenido en texto libre.
 *
 * @param {Object} props - Propiedades del componente inyectadas desde FormularioGuia.
 * @param {Array} props.bibliografia - Lista de referencias. Ej: [{ tipo: "Libro", referencia: "Clean Code - Robert C. Martin" }]
 * @param {function} props.onCambio - Callback para actualizar un campo específico ('tipo' o 'referencia') de un elemento del array.
 * @param {function} props.onAgregar - Callback para añadir una nueva referencia vacía.
 * @param {function} props.onEliminar - Callback para borrar una referencia por su índice.
 */
export default function SeccionBibliografia({ bibliografia, onCambio, onAgregar, onEliminar }) {
    
    // Estado local para el control de la interfaz (abrir/cerrar modal)
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>Bibliografía</h3>
                <button type="button" onClick={() => setModalAbierto(true)} style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    ✏️ Editar
                </button>
            </div>

            {/* --- VISTA PREVIA (MODO LECTURA) --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bibliografia.map((bib, index) => (
                    // RENDERIZADO CONDICIONAL DE ESTILOS: 
                    // Usamos un operador ternario para cambiar el color del borde izquierdo según el tipo.
                    // Si es 'Básica' (o Libro principal) se pinta azul, el resto se pintan naranja/ámbar.
                    <div key={index} style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', borderLeft: bib.tipo === 'Básica' ? '4px solid #3b82f6' : '4px solid #f59e0b' }}>
                        
                        <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: bib.tipo === 'Básica' ? '#3b82f6' : '#f59e0b', display: 'block', marginBottom: '5px' }}>
                            {bib.tipo}
                        </span>
                        
                        {/* Fallback de texto en caso de que la referencia esté en blanco */}
                        <span style={{ color: '#e0e0e0', fontSize: '14px', lineHeight: '1.5' }}>
                            {bib.referencia || <span style={{fontStyle:'italic', color:'#555'}}>Referencia vacía</span>}
                        </span>
                    </div>
                ))}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Bibliografía">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {bibliografia.map((bib, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            
                            {/* Selector del TIPO de recurso (25% del ancho) */}
                            <div style={{ width: '25%' }}>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Tipo</label>
                                {/* IMPORTANTE: La función 'onCambio' está diseñada para recibir la clave del objeto a modificar ('tipo' o 'referencia') */}
                                <select value={bib.tipo} onChange={(e) => onCambio(index, 'tipo', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }}>
                                    <option value="Libro">Libro</option>
                                    <option value="Recurso Web">Recurso Web</option>
                                    <option value="Artículo">Artículo</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            
                            {/* Área de texto para la REFERENCIA (65% del ancho) */}
                            <div style={{ width: '65%' }}>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Referencia (Libro, Web...)</label>
                                <textarea value={bib.referencia} onChange={(e) => onCambio(index, 'referencia', e.target.value)} rows="2" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', resize: 'vertical' }} />
                            </div>
                            
                            {/* Botón de borrado (10% del ancho restante) */}
                            <div style={{ width: '10%', display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
                                <button type="button" onClick={() => onEliminar(index)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                            </div>
                        </div>
                    ))}
                    
                    <button type="button" onClick={onAgregar} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ➕ Añadir Referencia
                    </button>
                </div>
            </Modal>
        </div>
    );
}