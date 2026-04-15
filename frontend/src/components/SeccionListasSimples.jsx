import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente para listas que requieren jerarquía (Objetivos, Conocimientos).
 * Permite indentar elementos a la derecha/izquierda mediante niveles.
 */
export default function SeccionListasSimples({ titulo, items, onCambio, onAgregar, onEliminar }) {
    const [modalAbierto, setModalAbierto] = useState(false);

    // Funciones de control de nivel (Idénticas a Temario)
    const cambiarNivel = (index, delta) => {
        const nuevoNivel = Math.max(0, Math.min(3, (items[index].nivel || 0) + delta));
        onCambio(index, 'nivel', nuevoNivel);
    };

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>🎯 {titulo}</h3>
                <button 
                    type="button" 
                    onClick={() => setModalAbierto(true)} 
                    style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
                >
                    ✏️ Editar
                </button>
            </div>

            {/* --- VISTA PREVIA (CON INDENTACIÓN) --- */}
            <div style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                {items.length === 0 || (items.length === 1 && items[0].texto === '') ? (
                    <span style={{ color: '#555', fontStyle: 'italic', fontSize: '14px' }}>Sin elementos especificados</span>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {items.map((item, index) => item.texto?.trim() !== '' && (
                            <div 
                                key={index} 
                                style={{ 
                                    marginLeft: `${(item.nivel || 0) * 25}px`, 
                                    color: item.nivel === 0 ? '#ffffff' : '#e0e0e0', 
                                    fontSize: '14px',
                                    fontWeight: item.nivel === 0 ? 'bold' : 'normal',
                                    display: 'flex',
                                    gap: '10px'
                                }}
                            >
                                <span>•</span>
                                <span>{item.texto}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo={`Editar ${titulo}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ color: '#3b82f6', fontSize: '13px', marginBottom: '10px' }}>
                        💡 Usa <strong>{"<"}</strong> y <strong>{">"}</strong> para organizar los elementos en sub-puntos.
                    </p>

                    {items.map((item, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            marginLeft: `${(item.nivel || 0) * 20}px`,
                            transition: 'margin 0.2s'
                        }}>
                            {/* BOTONES DE NIVEL */}
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <button type="button" onClick={() => cambiarNivel(index, -1)} style={{ padding: '6px 10px', backgroundColor: '#4b5563', color: '#fff', border: 'none', borderRadius: '4px 0 0 4px', cursor: 'pointer' }}>{"<"}</button>
                                <button type="button" onClick={() => cambiarNivel(index, 1)} style={{ padding: '6px 10px', backgroundColor: '#4b5563', color: '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>{">"}</button>
                            </div>

                            <input
                                type="text"
                                value={item.texto}
                                onChange={(e) => onCambio(index, 'texto', e.target.value)}
                                placeholder="Escribe aquí..."
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '14px' }}
                            />
                            
                            <button type="button" onClick={() => onEliminar(index)} style={{ padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                                X
                            </button>
                        </div>
                    ))}
                    
                    <button type="button" onClick={onAgregar} style={{ marginTop: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ➕ Añadir Elemento
                    </button>
                </div>
            </Modal>
        </div>
    );
}