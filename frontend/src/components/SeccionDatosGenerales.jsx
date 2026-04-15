import { useState } from 'react';
import Modal from './Modal';

/**
 * Componente UI para visualizar y editar la información estática de la asignatura.
 * Gestiona un objeto plano de datos y delega las actualizaciones al componente padre.
 * Destaca por el uso de un sub-componente interno (Micro-componente) y maquetación mediante CSS Grid.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.datos - Objeto con todas las propiedades de la asignatura (nombre, código, créditos...).
 * @param {function} props.onChange - Función manejadora (handler) universal para cualquier cambio en los inputs.
 */
export default function SeccionDatosGenerales({ datos, onChange }) {
    
    const [modalAbierto, setModalAbierto] = useState(false);

    /**
     * MICRO-COMPONENTE INTERNO: 'MostrarDato'
     * Se declara dentro del componente principal para encapsular la lógica visual repetitiva.
     * En lugar de escribir el mismo HTML y estilos CSS 18 veces para cada campo, 
     * creamos esta pequeña función que recibe una etiqueta y un valor, estandarizando el diseño.
     */
    const MostrarDato = ({ etiqueta, valor }) => (
        <div style={{ marginBottom: '12px' }}>
            <span style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                {etiqueta}
            </span>
            {/* Renderizado condicional de estilos: Si no hay valor, se pone en cursiva y más oscuro */}
            <span style={{ color: valor ? '#e0e0e0' : '#555', fontSize: '15px', fontWeight: valor ? 'normal' : 'italic' }}>
                {valor || 'Sin especificar'}
            </span>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            
            {/* --- CABECERA --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>Datos Generales</h3>
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
            {/* Se utiliza CSS Grid con 'auto-fill' y 'minmax' para crear un diseño "Responsive" sin usar Media Queries.
                Los elementos se adaptarán solos al ancho de la pantalla. */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                <MostrarDato etiqueta="Asignatura" valor={datos.nombreAsignatura} />
                <MostrarDato etiqueta="Código" valor={datos.codigoAsignatura} />
                <MostrarDato etiqueta="Titulación" valor={datos.titulacion} />
                <MostrarDato etiqueta="Créditos ECTS" valor={datos.creditos} />
                <MostrarDato etiqueta="Curso" valor={datos.curso} />
                <MostrarDato etiqueta="Semestre" valor={datos.semestre} />
                <MostrarDato etiqueta="Periodo" valor={datos.periodo} />
                <MostrarDato etiqueta="Año Plan Estudios" valor={datos.anioPlanEstudios} />
                <MostrarDato etiqueta="Curso Implantación" valor={datos.cursoImplantacion} />
                <MostrarDato etiqueta="Rama" valor={datos.rama} />
                <MostrarDato etiqueta="Centro" valor={datos.centro} />
                <MostrarDato etiqueta="Departamento" valor={datos.departamento} />
                <MostrarDato etiqueta="Área" valor={datos.area} />
                <MostrarDato etiqueta="Idioma" valor={datos.idioma} />
                <MostrarDato etiqueta="Modalidad" valor={datos.modalidad} />
                <MostrarDato etiqueta="Módulo" valor={datos.modulo} />
                <MostrarDato etiqueta="Carácter" valor={datos.caracter} />
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} titulo="Editar Datos Generales">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Fila Asimétrica: El nombre ocupa el doble (2fr) que el código (1fr) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Nombre de la Asignatura</label>
                            {/* IMPORTANTE: Todos los inputs usan la MISMA función onChange. 
                                Esto funciona porque el atributo 'name' coincide con la clave del objeto de estado en el Padre. */}
                            <input type="text" name="nombreAsignatura" value={datos.nombreAsignatura} onChange={onChange} />
                        </div>
                        <div>
                            <label>Código</label>
                            <input type="text" name="codigoAsignatura" value={datos.codigoAsignatura} onChange={onChange} />
                        </div>
                    </div>

                    {/* Fila Completa */}
                    <div>
                        <label>Titulación</label>
                        <input type="text" name="titulacion" value={datos.titulacion} onChange={onChange} />
                    </div>

                    {/* Fila de 3 columnas iguales */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                        <div>
                            <label>Créditos</label>
                            <input type="text" name="creditos" value={datos.creditos} onChange={onChange} />
                        </div>
                        <div>
                            <label>Curso</label>
                            <input type="text" name="curso" value={datos.curso} onChange={onChange} />
                        </div>
                        <div>
                            <label>Semestre</label>
                            <input type="text" name="semestre" value={datos.semestre} onChange={onChange} />
                        </div>
                    </div>

                    {/* Fila de 3 columnas iguales */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                        <div>
                            <label>Periodo</label>
                            <input type="text" name="periodo" value={datos.periodo} onChange={onChange} />
                        </div>
                        <div>
                            <label>Año Plan Estudios</label>
                            <input type="text" name="anioPlanEstudios" value={datos.anioPlanEstudios} onChange={onChange} />
                        </div>
                        <div>
                            <label>Curso Implantación</label>
                            <input type="text" name="cursoImplantacion" value={datos.cursoImplantacion} onChange={onChange} />
                        </div>
                    </div>

                    {/* Filas de 2 columnas iguales (1fr 1fr) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Rama de Conocimiento</label>
                            <input type="text" name="rama" value={datos.rama} onChange={onChange} />
                        </div>
                        <div>
                            <label>Centro</label>
                            <input type="text" name="centro" value={datos.centro} onChange={onChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Departamento</label>
                            <input type="text" name="departamento" value={datos.departamento} onChange={onChange} />
                        </div>
                        <div>
                            <label>Área</label>
                            <input type="text" name="area" value={datos.area} onChange={onChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Idioma</label>
                            <input type="text" name="idioma" value={datos.idioma} onChange={onChange} />
                        </div>
                        <div>
                            <label>Modalidad</label>
                            <input type="text" name="modalidad" value={datos.modalidad} onChange={onChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Módulo</label>
                            <input type="text" name="modulo" value={datos.modulo} onChange={onChange} />
                        </div>
                        <div>
                            <label>Carácter</label>
                            <input type="text" name="caracter" value={datos.caracter} onChange={onChange} />
                        </div>
                    </div>

                </div>
            </Modal>
        </div>
    );
}