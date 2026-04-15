import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente UI para gestionar la lista del equipo docente de la asignatura.
 * Muestra a los profesores en un formato de cuadrícula de tarjetas (Cards) y 
 * permite su edición a través de un Modal dinámico.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.profesores - Array de objetos complejos. Ejemplo: [{ Nombre: "", Email: "", esCoordinador: false }].
 * @param {function} props.onProfesorChange - Handler para actualizar un campo específico de un profesor según su índice.
 * @param {function} props.onAgregar - Crea y añade un nuevo objeto profesor vacío al array.
 * @param {function} props.onEliminar - Elimina a un profesor del array usando su índice.
 */
export default function SeccionProfesorado({ profesores, onProfesorChange, onAgregar, onEliminar }) {
    
    // Controla la apertura y cierre del formulario flotante
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>Profesorado</h3>
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

            {/* --- VISTA PREVIA (Tarjetas / Cards) --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {profesores.map((p, index) => (
                    // Renderizado Condicional de Estilos: Si es coordinador, el borde izquierdo es verde; si no, gris oscuro.
                    <div key={index} style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333', borderLeft: p.esCoordinador ? '4px solid #10b981' : '1px solid #333' }}>
                        
                        <h4 style={{ margin: '0 0 12px 0', color: '#e0e0e0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            👤 {p.Nombre || `Profesor ${index + 1}`} 
                            {/* Renderizado Condicional de Elementos: El badge solo existe en el DOM si esCoordinador es true */}
                            {p.esCoordinador && <span style={{fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '12px'}}>Coordinador</span>}
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#aaa' }}>
                            <div><strong style={{color: '#888', textTransform: 'uppercase', fontSize: '11px'}}>Email:</strong> <span style={{color: '#fff'}}>{p.Email || '-'}</span></div>
                            <div><strong style={{color: '#888', textTransform: 'uppercase', fontSize: '11px'}}>Despacho:</strong> <span style={{color: '#fff'}}>{p.Despacho || '-'}</span></div>
                            <div><strong style={{color: '#888', textTransform: 'uppercase', fontSize: '11px'}}>Tutorías:</strong> <span style={{color: '#fff'}}>{p.HorarioTutorias || '-'}</span></div>
                            <div><strong style={{color: '#888', textTransform: 'uppercase', fontSize: '11px'}}>Grupo:</strong> <span style={{color: '#fff'}}>{p.Grupo || '-'}</span></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL (Formulario dinámico) --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Profesorado">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {profesores.map((profesor, index) => (
                        <div key={index} style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #444' }}>
                            
                            {/* --- CABECERA DE LA TARJETA EN EDICIÓN --- */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                                <h4 style={{ margin: 0, color: '#3b82f6', fontSize: '16px' }}>Profesor {index + 1}</h4>
                                
                                {/* Lógica Defensiva: Solo permitimos borrar si hay más de 1 profesor. 
                                    Una asignatura siempre debe tener al menos un docente. */}
                                {profesores.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => onEliminar(index)} 
                                        style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.color = 'white'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ef4444'; }}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                )}
                            </div>

                            {/* --- INPUTS DE DATOS --- */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label>Nombre Completo</label>
                                    <input type="text" name="Nombre" value={profesor.Nombre} onChange={(e) => onProfesorChange(index, e)} />
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input type="email" name="Email" value={profesor.Email} onChange={(e) => onProfesorChange(index, e)} />
                                </div>
                                <div>
                                    <label>Teléfono</label>
                                    <input type="text" name="Telefono" value={profesor.Telefono} onChange={(e) => onProfesorChange(index, e)} />
                                </div>
                                <div>
                                    <label>Despacho</label>
                                    <input type="text" name="Despacho" value={profesor.Despacho} onChange={(e) => onProfesorChange(index, e)} />
                                </div>
                                <div>
                                    <label>Horario Tutorías</label>
                                    <input type="text" name="HorarioTutorias" value={profesor.HorarioTutorias} onChange={(e) => onProfesorChange(index, e)} />
                                </div>
                                <div>
                                    <label>Página Web</label>
                                    <input type="text" name="UrlWeb" value={profesor.UrlWeb} onChange={(e) => onProfesorChange(index, e)} />
                                </div>
                                <div>
                                    <label>Grupo</label>
                                    <input type="text" name="Grupo" value={profesor.Grupo} onChange={(e) => onProfesorChange(index, e)} />
                                </div>
                                
                                {/* --- CHECKBOX (Valor Booleano) --- */}
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#e0e0e0', textTransform: 'none', fontWeight: '600', fontSize: '14px' }}>
                                        {/* CRÍTICO: Los checkboxes no usan el atributo 'value', usan 'checked' */}
                                        <input 
                                            type="checkbox" 
                                            name="esCoordinador" 
                                            checked={profesor.esCoordinador} 
                                            onChange={(e) => onProfesorChange(index, e)} 
                                            style={{ width: 'auto', marginRight: '10px', transform: 'scale(1.2)' }} 
                                        />
                                        ¿Es coordinador de la asignatura?
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Botón de añadir nuevo profesor */}
                    <button 
                        type="button" 
                        onClick={onAgregar} 
                        style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'background-color 0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                        ➕ Añadir otro profesor
                    </button>
                </div>
            </Modal>
        </div>
    );
}