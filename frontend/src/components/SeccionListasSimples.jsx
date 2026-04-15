import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente genérico y altamente reutilizable para gestionar arrays de strings simples.
 * Puede ser instanciado múltiples veces pasándole distintos títulos y datos, sirviendo 
 * igual para "Objetivos", "Conocimientos Previos", "Bibliografía" o "Normas".
 *
 * @param {Object} props - Propiedades del componente inyectadas por el padre.
 * @param {string} props.titulo - El nombre de la sección que se mostrará en la cabecera (ej. "Bibliografía").
 * @param {string[]} props.items - Array de cadenas de texto con la información a mostrar.
 * @param {function} props.onCambio - Callback para actualizar el texto de un elemento específico según su índice.
 * @param {function} props.onAgregar - Callback para añadir una nueva cadena vacía al final del array.
 * @param {function} props.onEliminar - Callback para borrar un elemento del array según su índice.
 */
export default function SeccionListasSimples({ titulo, items, onCambio, onAgregar, onEliminar }) {
    
    // Estado local para controlar la visibilidad del Modal de edición
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA DINÁMICA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                {/* El título no está "hardcodeado", se inyecta desde fuera */}
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>{titulo}</h3>
                <button type="button" onClick={() => setModalAbierto(true)} style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    ✏️ Editar
                </button>
            </div>

            {/* --- VISTA PREVIA (MODO LECTURA) --- */}
            <ul style={{ color: '#e0e0e0', fontSize: '15px', lineHeight: '1.6', paddingLeft: '20px', margin: 0 }}>
                {/* Lógica de Renderizado Condicional para el "Empty State" (Estado Vacío) */}
                {items.length === 0 || (items.length === 1 && items[0] === '') ? (
                    <li style={{ color: '#555', fontStyle: 'italic', listStyle: 'none', marginLeft: '-20px' }}>Sin especificar</li>
                ) : (
                    // Filtramos los elementos vacíos antes de pintarlos para que no queden "puntos de viñeta" huérfanos
                    items.map((item, index) => item.trim() !== '' && <li key={index} style={{ marginBottom: '8px' }}>{item}</li>)
                )}
            </ul>

            {/* --- MODAL DE EDICIÓN --- */}
            {/* El título del modal también es dinámico usando Template Literals (Template Strings) */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo={`Editar ${titulo}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* Iteramos sobre el array de strings primitivos */}
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px' }}>
                            {/* Usamos textarea en lugar de input porque elementos como los "Objetivos" pueden ocupar varias líneas */}
                            <textarea 
                                value={item} 
                                onChange={(e) => onCambio(index, e.target.value)} 
                                rows="2" 
                                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', resize: 'vertical' }} 
                            />
                            <button type="button" onClick={() => onEliminar(index)} style={{ padding: '0 15px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                        </div>
                    ))}
                    <button type="button" onClick={onAgregar} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>➕ Añadir elemento</button>
                </div>
            </Modal>
        </div>
    );
}