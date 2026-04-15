import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente UI para la gestión del temario o contenidos de la asignatura.
 * Permite crear una jerarquía visual (Temas, Subtemas) utilizando una estructura de datos plana.
 * Refactorizado para estandarizar la UX: Vista previa en el documento y edición mediante Modal.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.temas - Array de objetos que representa el temario. Ejemplo: [{ tema: "1. Intro", nivel: 0 }].
 * @param {function} props.onChange - Callback para modificar el texto o nivel de un tema.
 * @param {function} props.onAgregar - Callback para añadir un nuevo tema vacío.
 * @param {function} props.onEliminar - Callback para borrar un tema.
 */
export default function SeccionTemario({ temas, onChange, onAgregar, onEliminar }) {
    
    // Estado local para el Modal
    const [modalAbierto, setModalAbierto] = useState(false);

    // Lógica de indentación (Se mantiene intacta)
    const subirNivel = (index) => {
        if (temas[index].nivel < 3) onChange(index, 'nivel', temas[index].nivel + 1);
    };
    const bajarNivel = (index) => {
        if (temas[index].nivel > 0) onChange(index, 'nivel', temas[index].nivel - 1);
    };

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>📖 Contenidos (Temario)</h3>
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

            {/* --- VISTA PREVIA (MODO LECTURA) --- */}
            <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                {temas.length === 0 || (temas.length === 1 && temas[0].tema === '') ? (
                    <span style={{ color: '#555', fontStyle: 'italic', fontSize: '14px' }}>Sin temas especificados</span>
                ) : (
                    temas.map((item, index) => item.tema.trim() !== '' && (
                        <div 
                            key={index} 
                            style={{ 
                                marginLeft: `${item.nivel * 25}px`, 
                                /* CAMBIO AQUÍ: Nivel 0 ahora es #ffffff (Blanco puro), el resto #e0e0e0 (Gris clarito) */
                                color: item.nivel === 0 ? '#ffffff' : '#e0e0e0', 
                                fontSize: item.nivel === 0 ? '16px' : '14px', 
                                fontWeight: item.nivel === 0 ? 'bold' : 'normal', 
                                borderBottom: item.nivel === 0 ? '1px solid #444' : 'none', 
                                paddingBottom: item.nivel === 0 ? '6px' : '3px', 
                                marginTop: item.nivel === 0 && index !== 0 ? '15px' : '5px' 
                            }}
                        >
                            {item.tema}
                        </div>
                    ))
                )}
            </div>

            {/* --- MODAL DE EDICIÓN (ESTRUCTURA DE ÁRBOL) --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Temario">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* Alerta de instrucciones para el usuario */}
                    <p style={{ color: '#3b82f6', fontSize: '13px', marginBottom: '10px' }}>
                        💡 Usa <strong>{"<"}</strong> y <strong>{">"}</strong> para organizar los elementos en sub-puntos.
                    </p>

                    {temas.map((item, index) => (
                        <div key={index} style={{ 
                            display: 'flex', alignItems: 'center', gap: '10px', 
                            marginLeft: `${item.nivel * 30}px`, /* El truco visual del árbol */
                            transition: 'margin 0.2s', 
                            backgroundColor: '#2a2a2a', padding: '10px', borderRadius: '8px', border: '1px solid #444' 
                        }}>
                            
                            {/* BOTONES DE CONTROL DE NIVEL */}
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <button type="button" onClick={() => bajarNivel(index)} disabled={item.nivel === 0} style={{ padding: '6px 12px', backgroundColor: item.nivel === 0 ? '#333' : '#4b5563', color: item.nivel === 0 ? '#555' : '#fff', border: 'none', borderRadius: '4px 0 0 4px', cursor: item.nivel === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{"<"}</button>
                                <button type="button" onClick={() => subirNivel(index)} disabled={item.nivel === 3} style={{ padding: '6px 12px', backgroundColor: item.nivel === 3 ? '#333' : '#4b5563', color: item.nivel === 3 ? '#555' : '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: item.nivel === 3 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{">"}</button>
                            </div>

                            {/* INPUT DEL TEMA */}
                            <input 
                                type="text" 
                                value={item.tema} 
                                onChange={(e) => onChange(index, 'tema', e.target.value)} 
                                placeholder="Ej: 1.1 Redes Neuronales"
                                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#1e1e1e', color: '#fff', fontWeight: item.nivel === 0 ? 'bold' : 'normal' }} 
                            />
                            
                            {/* BOTÓN ELIMINAR */}
                            <button type="button" onClick={() => onEliminar(index)} style={{ padding: '8px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.color = '#fff'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ef4444'; }}>
                                X
                            </button>
                        </div>
                    ))}
                    
                    <button type="button" onClick={onAgregar} style={{ marginTop: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '14px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#059669'} onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}>
                        ➕ Añadir Nuevo Tema
                    </button>
                </div>
            </Modal>
        </div>
    );
}