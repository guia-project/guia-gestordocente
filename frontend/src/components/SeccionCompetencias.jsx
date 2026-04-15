import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente de interfaz encargado de visualizar y gestionar la lista de competencias.
 * Utiliza el patrón de "Elevación de Estado" (Lifting State Up): no guarda los datos 
 * internamente, sino que recibe las funciones modificadoras desde el componente padre.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.competencias - Array de objetos con los datos actuales (tipo, código, descripción).
 * @param {function} props.onCompetenciaChange - Función callback ejecutada al modificar un input existente.
 * @param {function} props.onAgregar - Función callback ejecutada para añadir una nueva competencia vacía al array.
 * @param {function} props.onEliminar - Función callback ejecutada para borrar una competencia específica.
 */
export default function SeccionCompetencias({ competencias, onCompetenciaChange, onAgregar, onEliminar }) {
    
    // Estado local exclusivo para controlar si el Modal está visible o no.
    // No guarda datos de las competencias, solo controla la Interfaz de Usuario (UI).
    const [modalAbierto, setModalAbierto] = useState(false);

    /**
     * Función auxiliar (Helper) para obtener una paleta de colores basada en el tipo de competencia.
     * Mejora enormemente la Experiencia de Usuario (UX) mediante el uso de etiquetas visuales claras.
     * * @param {string} tipo - El tipo de competencia ('Básica', 'General', etc.).
     * @returns {Object} Un objeto con los colores hexadecimales/rgba para fondo, texto y borde.
     */
    const getColorPorTipo = (tipo) => {
        switch(tipo) {
            case 'Básica': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', border: '#3b82f6' };
            case 'General': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981', border: '#10b981' };
            case 'Específica': return { bg: 'rgba(168, 85, 247, 0.2)', text: '#a855f7', border: '#a855f7' };
            case 'Transversal': return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', border: '#f59e0b' };
            default: return { bg: 'rgba(255, 255, 255, 0.1)', text: '#aaa', border: '#555' };
        }
    };

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA DE LA SECCIÓN --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>Competencias</h3>
                <button 
                    type="button" 
                    onClick={() => setModalAbierto(true)} 
                    style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#3b82f6'; e.target.style.borderColor = '#3b82f6'; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.borderColor = '#444'; e.target.style.color = '#e0e0e0'; }}
                >
                    ✏️ Editar
                </button>
            </div>

            {/* --- VISTA PREVIA (Modo Lectura) --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Iteramos sobre el array de competencias para generar los elementos visuales dinámicamente */}
                {competencias.map((comp, index) => {
                    const colores = getColorPorTipo(comp.tipo);
                    return (
                        // La prop 'key' es obligatoria en React al usar .map(). Ayuda al Virtual DOM a 
                        // identificar qué elementos han cambiado, se han añadido o se han eliminado.
                        <div key={index} style={{ display: 'flex', gap: '15px', backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #333', alignItems: 'flex-start' }}>
                            <div style={{ minWidth: '100px' }}>
                                <span style={{ backgroundColor: colores.bg, color: colores.text, border: `1px solid ${colores.border}`, padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {comp.tipo || 'General'}
                                </span>
                            </div>
                            <div style={{ minWidth: '60px', color: '#fff', fontWeight: 'bold' }}>{comp.codigo || '-'}</div>
                            <div style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>{comp.descripcion || <span style={{fontStyle: 'italic'}}>Sin descripción</span>}</div>
                        </div>
                    );
                })}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Competencias">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* Generamos un mini-formulario para CADA competencia del array */}
                    {competencias.map((comp, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            
                            {/* Selector de Tipo */}
                            <div style={{ width: '20%' }}>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Tipo</label>
                                {/* onChange delega la actualización al componente Padre pasándole el índice afectado */}
                                <select name="tipo" value={comp.tipo} onChange={(e) => onCompetenciaChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }}>
                                    <option value="Básica">Básica</option>
                                    <option value="General">General</option>
                                    <option value="Específica">Específica</option>
                                    <option value="Transversal">Transversal</option>
                                </select>
                            </div>
                            
                            {/* Input de Código */}
                            <div style={{ width: '15%' }}>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Código</label>
                                <input type="text" name="codigo" placeholder="Ej: CB1" value={comp.codigo} onChange={(e) => onCompetenciaChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }} />
                            </div>
                            
                            {/* Textarea de Descripción */}
                            <div style={{ width: '55%' }}>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Descripción</label>
                                <textarea name="descripcion" value={comp.descripcion} onChange={(e) => onCompetenciaChange(index, e)} rows="2" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', resize: 'vertical' }} />
                            </div>
                            
                            {/* Botón Eliminar */}
                            <div style={{ width: '10%', display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
                                <button type="button" onClick={() => onEliminar(index)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Botón general para añadir un nuevo hueco vacío al array */}
                    <button type="button" onClick={onAgregar} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                        ➕ Añadir Competencia
                    </button>
                </div>
            </Modal>
        </div>
    );
}