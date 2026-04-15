import { useState } from 'react';
import Modal from './Modal';

/**
 * MICRO-COMPONENTE INTERNO: 'MostrarTexto'
 * Encapsula la vista de solo lectura para grandes bloques de texto.
 * Destaca por conservar el formato original del texto (saltos de línea) mediante CSS.
 */
const MostrarTexto = ({ etiqueta, valor }) => (
    <div style={{ marginBottom: '20px' }}>
        <span style={{ color: '#888', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            {etiqueta}
        </span>
        <div style={{ 
            color: valor ? '#e0e0e0' : '#555', 
            fontSize: '15px', 
            fontStyle: valor ? 'normal' : 'italic', 
            backgroundColor: '#2a2a2a', 
            padding: '18px', 
            borderRadius: '8px', 
            border: '1px solid #333', 
            whiteSpace: 'pre-wrap', // CRÍTICO: Respeta los saltos de línea (\n) del texto original
            lineHeight: '1.6' 
        }}>
            {valor || 'Sin especificar'}
        </div>
    </div>
);

/**
 * MICRO-COMPONENTE INTERNO: 'TextareaModal'
 * Abstrae la lógica repetitiva de los campos de texto grandes (textareas) dentro del modal.
 */
const TextareaModal = ({ etiqueta, nombre, valor, onChange }) => (
    <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', color: '#aaa', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>
            {etiqueta}
        </label>
        <textarea 
            name={nombre} 
            value={valor} 
            onChange={onChange} 
            rows="6" 
            style={{ width: '100%', padding: '15px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontFamily: 'inherit', resize: 'vertical', fontSize: '15px', lineHeight: '1.5' }} 
        />
    </div>
);

/**
 * Componente UI para visualizar y editar las secciones de texto extenso de la guía docente
 * (Metodología, Criterios de Evaluación, Normas, etc.).
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.datos - Sub-objeto de la guía que contiene los campos de texto largo.
 * @param {function} props.onChange - Función manejadora (handler) universal para la actualización de estado.
 */
export default function SeccionOtrosDatos({ datos, onChange }) {
    
    // Estado local para la gestión de la ventana flotante
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>Metodología y Evaluación</h3>
                <button type="button" onClick={() => setModalAbierto(true)} style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0', border: '1px solid #444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    ✏️ Editar Textos
                </button>
            </div>

            {/* --- VISTA PREVIA (MODO LECTURA) --- */}
            {/* Hacemos uso de los micro-componentes para mantener el código principal totalmente limpio y legible */}
            <div>
                <MostrarTexto etiqueta="Metodología" valor={datos.metodologia} />
                <MostrarTexto etiqueta="Criterios de Evaluación" valor={datos.evaluacion} />
                <MostrarTexto etiqueta="Normas de Realización de Pruebas" valor={datos.normasRealizacionPruebas} />
                <MostrarTexto etiqueta="Ausencia Máxima" valor={datos.ausenciaMaxima} />
                <MostrarTexto etiqueta="Otra Información" valor={datos.otraInformacion} />
            </div>

            {/* --- MODAL DE EDICIÓN (MODO ESCRITURA) --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Textos">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Reutilizamos el manejador global 'onChange' inyectándolo en cada subcomponente */}
                    <TextareaModal etiqueta="Metodología" nombre="metodologia" valor={datos.metodologia} onChange={onChange} />
                    <TextareaModal etiqueta="Criterios de Evaluación" nombre="evaluacion" valor={datos.evaluacion} onChange={onChange} />
                    <TextareaModal etiqueta="Normas de Realización de Pruebas" nombre="normasRealizacionPruebas" valor={datos.normasRealizacionPruebas} onChange={onChange} />
                    <TextareaModal etiqueta="Ausencia Máxima" nombre="ausenciaMaxima" valor={datos.ausenciaMaxima} onChange={onChange} />
                    <TextareaModal etiqueta="Otra Información" nombre="otraInformacion" valor={datos.otraInformacion} onChange={onChange} />
                </div>
            </Modal>
        </div>
    );
}