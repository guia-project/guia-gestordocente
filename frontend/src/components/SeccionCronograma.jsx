import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente UI para la visualización y edición jerárquica del Cronograma de Trabajo.
 * Implementa una estructura de datos anidada (Arrays dentro de Arrays): 
 * El elemento principal es la "Semana", y cada Semana contiene múltiples "Actividades".
 *
 * @param {Object} props - Propiedades del componente inyectadas por el padre.
 * @param {Array} props.cronograma - Estructura de datos completa: [{ semana: "1", actividades: [{tipo, descripcion, horas}] }].
 * @param {function} props.onSemanaChange - Callback para modificar el identificador/título de la semana.
 * @param {function} props.onActividadChange - Callback para modificar los detalles de una actividad específica. Requiere dos índices (semana y actividad).
 * @param {function} props.onAgregarSemana - Añade un nuevo bloque de semana vacío al final del cronograma.
 * @param {function} props.onEliminarSemana - Borra una semana entera (y todas las actividades que contenga).
 * @param {function} props.onAgregarActividad - Añade una nueva actividad vacía dentro de una semana específica.
 * @param {function} props.onEliminarActividad - Borra una actividad puntual dentro de una semana.
 */
export default function SeccionCronograma({ 
    cronograma, 
    onSemanaChange, 
    onActividadChange, 
    onAgregarSemana, 
    onEliminarSemana, 
    onAgregarActividad, 
    onEliminarActividad 
}) {
    // Estado local para abrir/cerrar la ventana de edición intensiva
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA DE LA SECCIÓN --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>📅 Cronograma de Trabajo</h3>
                <button type="button" onClick={() => setModalAbierto(true)} style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    ✏️ Editar
                </button>
            </div>

            {/* --- VISTA PREVIA (MODO LECTURA) --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* 1er Nivel de Iteración: Recorremos las Semanas */}
                {cronograma.map((semana, indexSemana) => (
                    <div key={indexSemana} style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Semana {semana.semana}</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            
                            {/* 2do Nivel de Iteración: Recorremos las Actividades DENTRO de la semana actual.
                                La condición "semana.actividades &&" evita que la app crashee si el array es undefined (Defensive Programming). */}
                            {semana.actividades && semana.actividades.map((act, indexAct) => (
                                <div key={indexAct} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '6px' }}>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ color: '#a855f7', fontWeight: 'bold', marginRight: '8px', backgroundColor: 'rgba(168, 85, 247, 0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                                            {act.clasificacion || 'Tipo 1'}
                                        </span>
                                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px', marginRight: '10px' }}>[{act.tipo}]</span>
                                        <span style={{ color: '#e0e0e0', fontSize: '14px' }}>{act.descripcion}</span>
                                    </div>
                                    <span style={{ color: '#aaa', fontSize: '12px' }}>{act.horas} h</span>
                                </div>
                            ))}
                            
                            {/* Fallback visual si una semana se crea pero aún no tiene actividades */}
                            {(!semana.actividades || semana.actividades.length === 0) && <span style={{ color: '#555', fontSize: '13px', fontStyle: 'italic' }}>Sin actividades</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL DE EDICIÓN (MODO ESCRITURA) --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Cronograma">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Iteración de las Semanas para la edición */}
                    {cronograma.map((semana, indexSemana) => (
                        <div key={indexSemana} style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #444' }}>
                            
                            {/* Controles a Nivel de Semana */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <label style={{ color: '#e0e0e0', fontWeight: 'bold' }}>Semana:</label>
                                    <input type="text" name="semana" value={semana.semana} onChange={(e) => onSemanaChange(indexSemana, e)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', textAlign: 'center' }} />
                                </div>
                                <button type="button" onClick={() => onEliminarSemana(indexSemana)} style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar Semana</button>
                            </div>

                            {/* Controles a Nivel de Actividades (Anidados) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '15px', borderLeft: '2px dashed #444' }}>
                                
                                {semana.actividades && semana.actividades.map((act, indexAct) => (
                                    <div key={indexAct} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        
                                        {/* CRÍTICO: Pasamos AMBOS índices (indexSemana y indexAct) para que el Padre sepa exactamente qué campo anidado modificar */}
                                        
                                        {/* NUEVO DESPLEGABLE: Clasificación (Ontología) */}
                                        <select name="clasificacion" value={act.clasificacion || 'Tipo 1'} onChange={(e) => onActividadChange(indexSemana, indexAct, e)} style={{ width: '20%', padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#a855f7', fontWeight: 'bold' }}>
                                            <option value="Tipo 1">Tipo 1</option>
                                            <option value="Tipo 2">Tipo 2</option>
                                            <option value="Teleenseñanza">Teleenseñanza</option>
                                            <option value="Evaluación">Evaluación</option>
                                        </select>

                                        {/* DESPLEGABLE TIPO ACTUALIZADO */}
                                        <select name="tipo" value={act.tipo || 'Lección Magistral'} onChange={(e) => onActividadChange(indexSemana, indexAct, e)} style={{ width: '25%', padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#10b981' }}>
                                            <option value="Lección Magistral">Lección Magistral</option>
                                            <option value="Prácticas de laboratorio">Prácticas de laboratorio</option>
                                            <option value="Clase de problemas">Clase de problemas</option>
                                            <option value="Trabajo en grupo">Trabajo en grupo</option>
                                            <option value="Examen escrito">Examen escrito</option>
                                            <option value="Otras actividades formativas">Otras actividades formativas</option>
                                        </select>
                                        
                                        <input type="text" name="descripcion" placeholder="Descripción..." value={act.descripcion} onChange={(e) => onActividadChange(indexSemana, indexAct, e)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }} />
                                        
                                        <input type="text" name="horas" placeholder="Horas" value={act.horas} onChange={(e) => onActividadChange(indexSemana, indexAct, e)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', textAlign: 'center' }} />
                                        
                                        <button type="button" onClick={() => onEliminarActividad(indexSemana, indexAct)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                                    </div>
                                ))}
                                
                                {/* Botón para añadir una nueva actividad DENTRO de esta semana específica */}
                                <button type="button" onClick={() => onAgregarActividad(indexSemana)} style={{ alignSelf: 'flex-start', backgroundColor: '#374151', color: '#e0e0e0', border: '1px dashed #6b7280', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }}>
                                    + Actividad
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Botón para añadir una nueva semana entera al array principal */}
                    <button type="button" onClick={onAgregarSemana} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>➕ Añadir Nueva Semana</button>
                </div>
            </Modal>
        </div>
    );
}