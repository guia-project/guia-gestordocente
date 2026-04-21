import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente UI responsable de visualizar y editar el sistema de evaluación de la asignatura.
 * Gestiona un array de objetos complejos donde cada actividad tiene su peso porcentual, 
 * tipo de evaluación, requisitos mínimos y competencias asociadas.
 *
 * @param {Object} props - Propiedades inyectadas mediante Elevación de Estado (Lifting State Up).
 * @param {Array} props.actividades - Lista de actividades. Ej: [{ nombre: "Examen", tipo: "Global", peso: "60", notaMinima: "5", competencias: "CB1" }]
 * @param {function} props.onActividadChange - Callback ejecutado al modificar cualquier campo de una actividad.
 * @param {function} props.onAgregar - Callback para añadir una nueva actividad vacía al array.
 * @param {function} props.onEliminar - Callback para eliminar una actividad según su posición (índice).
 */
export default function SeccionActividadesEvaluacion({ actividades, onActividadChange, onAgregar, onEliminar }) {
    
    // Estado local para abrir o cerrar la ventana modal de edición
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>📝 Actividades de Evaluación</h3>
                <button 
                    type="button" 
                    onClick={() => setModalAbierto(true)} 
                    style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                >
                    ✏️ Editar
                </button>
            </div>

            {/* --- VISTA PREVIA (MODO LECTURA) --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {actividades.map((act, index) => (
                    <div key={index} style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #a855f7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#a855f7' }}>
                                {act.nombre || 'Nueva Actividad'}
                            </span>
                            
                            {/* PÍLDORAS INFORMATIVAS (Badges) para datos clave */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span style={{ color: '#aaa', fontSize: '12px', backgroundColor: '#1e1e1e', padding: '4px 8px', borderRadius: '4px' }}>
                                    {act.tipo || 'Sin Tipo'}
                                </span>
                                <span style={{ color: '#e0e0e0', fontSize: '12px', backgroundColor: '#374151', padding: '4px 8px', borderRadius: '4px' }}>
                                    Peso: {act.peso || '0%'}
                                </span>
                                <span style={{ color: '#e0e0e0', fontSize: '12px', backgroundColor: '#991b1b', padding: '4px 8px', borderRadius: '4px' }}>
                                    Mín: {act.notaMinima || '0'}
                                </span>
                            </div>
                        </div>
                        <span style={{ color: '#e0e0e0', fontSize: '14px', lineHeight: '1.5', display: 'block', marginBottom: act.competencias ? '8px' : '0' }}>
                            {act.descripcion || <span style={{fontStyle:'italic', color:'#555'}}>Sin descripción</span>}
                        </span>
                        
                        {/* NUEVO: Visualización de las competencias en la vista previa */}
                        {act.competencias && (
                            <span style={{ color: '#10b981', fontSize: '12px', display: 'inline-block', backgroundColor: '#064e3b', padding: '4px 8px', borderRadius: '4px', border: '1px solid #059669' }}>
                                🎯 Competencias: {act.competencias}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Evaluación">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {actividades.map((act, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {/* CRÍTICO: Uso de la propiedad 'flex' para establecer proporciones. 
                                    El Nombre ocupa el doble de espacio (flex: 2) que el resto (flex: 1) */}
                                <div style={{ flex: 2 }}>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Nombre</label>
                                    <input type="text" name="nombre" value={act.nombre} onChange={(e) => onActividadChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Tipo</label>
                                    <select name="tipo" value={act.tipo} onChange={(e) => onActividadChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }}>
                                        <option value="Progresiva">Progresiva</option>
                                        <option value="Global">Global</option>
                                        <option value="Extraordinaria">Extraordinaria</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Peso (%)</label>
                                    <input type="text" name="peso" value={act.peso} onChange={(e) => onActividadChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Nota Mínima</label>
                                    <input type="text" name="notaMinima" value={act.notaMinima} onChange={(e) => onActividadChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }} />
                                </div>
                                <button type="button" onClick={() => onEliminar(index)} style={{ padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '18px' }}>X</button>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Descripción</label>
                                <textarea name="descripcion" value={act.descripcion} onChange={(e) => onActividadChange(index, e)} rows="2" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', resize: 'vertical' }} />
                            </div>

                            {/* Campo para las competencias */}
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px' }}>Competencias</label>
                                <textarea name="competencias" value={act.competencias || ''} onChange={(e) => onActividadChange(index, e)} rows="1" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#10b981', resize: 'vertical' }} />
                            </div>

                        </div>
                    ))}
                    <button type="button" onClick={onAgregar} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ➕ Añadir Actividad
                    </button>
                </div>
            </Modal>
        </div>
    );
}