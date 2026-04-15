import { useState } from 'react';

/**
 * Componente UI para la gestión del temario o contenidos de la asignatura.
 * Permite crear una jerarquía visual (Temas, Subtemas, Apartados) utilizando una estructura
 * de datos plana (Flat Array) donde cada elemento define su profundidad mediante la propiedad 'nivel'.
 *
 * @param {Object} props - Propiedades del componente inyectadas por el Padre (FormularioGuia).
 * @param {Array} props.temas - Array de objetos que representa el temario. Ejemplo: [{ tema: "1. Intro", nivel: 0 }].
 * @param {function} props.onChange - Callback genérico para modificar tanto el texto del tema como su nivel de indentación.
 * @param {function} props.onAgregar - Callback para añadir un nuevo tema vacío al final del array.
 * @param {function} props.onEliminar - Callback para borrar un tema específico según su índice.
 */
export default function SeccionTemario({ temas, onChange, onAgregar, onEliminar }) {
    
    /**
     * Incrementa el nivel de indentación de un tema (lo empuja hacia la derecha).
     * Aplica una restricción máxima (nivel 3) para evitar que el texto se salga de la pantalla.
     * @param {number} index - Posición del tema en el array.
     */
    const subirNivel = (index) => {
        if (temas[index].nivel < 3) onChange(index, 'nivel', temas[index].nivel + 1);
    };

    /**
     * Reduce el nivel de indentación de un tema (lo devuelve hacia la izquierda).
     * Aplica una restricción mínima (nivel 0) correspondiente a la raíz o Tema Principal.
     * @param {number} index - Posición del tema en el array.
     */
    const bajarNivel = (index) => {
        if (temas[index].nivel > 0) onChange(index, 'nivel', temas[index].nivel - 1);
    };

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#3b82f6', fontSize: '18px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                📖 Contenidos (Temario)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {temas.map((item, index) => (
                    // CRÍTICO: El margen izquierdo dinámico (marginLeft) se calcula multiplicando el nivel x 30px.
                    // Esto crea la ilusión visual de un árbol jerárquico a partir de una lista plana.
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: `${item.nivel * 30}px`, transition: 'margin 0.2s' }}>
                        
                        {/* BOTONES DE CONTROL DE NIVEL */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {/* Deshabilitamos el botón visual y funcionalmente si ya hemos llegado al límite */}
                            <button 
                                type="button" 
                                onClick={() => bajarNivel(index)} 
                                disabled={item.nivel === 0} 
                                style={{ padding: '6px 8px', backgroundColor: item.nivel === 0 ? '#333' : '#4b5563', color: '#fff', border: 'none', borderRadius: '4px 0 0 4px', cursor: item.nivel === 0 ? 'not-allowed' : 'pointer' }}
                            >
                                {"<"}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => subirNivel(index)} 
                                disabled={item.nivel === 3} 
                                style={{ padding: '6px 8px', backgroundColor: item.nivel === 3 ? '#333' : '#4b5563', color: '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: item.nivel === 3 ? 'not-allowed' : 'pointer' }}
                            >
                                {">"}
                            </button>
                        </div>

                        {/* INPUT DEL TEMA */}
                        <input 
                            type="text" 
                            value={item.tema} 
                            onChange={(e) => onChange(index, 'tema', e.target.value)} 
                            placeholder="Ej: 1.1 Redes Neuronales"
                            // Estilo Dinámico: Los temas principales (nivel 0) se muestran en Negrita para destacar
                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff', fontWeight: item.nivel === 0 ? 'bold' : 'normal' }} 
                        />
                        
                        {/* BOTÓN ELIMINAR */}
                        <button type="button" onClick={() => onEliminar(index)} style={{ padding: '8px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            X
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={onAgregar} style={{ marginTop: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                ➕ Añadir Tema
            </button>
        </div>
    );
}