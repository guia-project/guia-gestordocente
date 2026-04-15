import { useState, useEffect } from 'react';
import FormularioGuia from './components/FormularioGuia';
import ListaGuias from './components/ListaGuias';
import PantallaAuth from './components/PantallaAuth';

/**
 * COMPONENTE RAÍZ (Root Component): Punto de entrada principal de la aplicación React.
 * Actúa como un "Enrutador Manual" (Router) y gestor de sesión global.
 * Su responsabilidad es evaluar el estado de autenticación del usuario y decidir 
 * qué "pantalla" (vista de alto nivel) debe renderizarse en el DOM.
 */
function App() {
  
  // --- 1. ESTADOS GLOBALES DE LA APLICACIÓN ---
  
  // Controla si el usuario está editando una guía existente o creando una nueva
  const [guiaEnEdicion, setGuiaEnEdicion] = useState(null);
  
  // Control de sesión. Determina si mostramos el Login o la App privada
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  
  // Control de navegación interna (Simulador de Rutas). 
  // Valores posibles: 'lista' (Dashboard) o 'formulario' (Editor)
  const [vistaActual, setVistaActual] = useState('lista');

  // --- 2. CICLO DE VIDA Y SESIÓN ---
  
  // Se ejecuta UNA SOLA VEZ al abrir la página.
  // Actúa como "Guardián" leyendo la memoria del navegador.
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('usuarioNombre');
    
    // Si encontramos el "Pase VIP" (Token), saltamos el Login y entramos directo
    if (token && nombre) {
      setEstaLogueado(true);
      setNombreUsuario(nombre);
    }
  }, []);

  /**
   * Destruye la sesión actual eliminando las credenciales de la memoria persistente.
   * Al actualizar el estado a falso, React desmonta la App privada y vuelve a montar el Login.
   */
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioId');
    setEstaLogueado(false);
    setNombreUsuario('');
    setVistaActual('lista'); // Reset de seguridad: Al salir, reseteamos la vista por defecto
  };

  // --- 3. RENDERIZADO CONDICIONAL DE ALTO NIVEL (El Router) ---

  // CASO A: El usuario NO tiene sesión iniciada.
  // Early Return: Mostramos exclusivamente la pantalla de Login/Registro.
  if (!estaLogueado) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', margin: 0, padding: 0 }}>
        {/* Pasamos un callback para que el Login avise a App.jsx cuando haya éxito */}
        <PantallaAuth onLogin={(datosUsuario) => {
          setEstaLogueado(true);
          setNombreUsuario(datosUsuario.nombre);
        }} />
      </div>
    );
  }

  // CASO B: El usuario SÍ tiene sesión iniciada.
  // Renderizamos el "Layout Principal" de la aplicación (Cabecera + Contenido dinámico)
  return (
    <div style={{ paddingBottom: '50px' }}>
      
      {/* ==================== CABECERA GLOBAL (Top Navbar) ==================== */}
      {/* position: 'sticky' mantiene la barra superior visible aunque el usuario haga scroll hacia abajo */}
      <div style={{ 
        backgroundColor: '#1e1e1e', padding: '15px 30px', color: '#e0e0e0', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', 
        borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 1000
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          <span style={{ color: '#3b82f6' }}>Gestor</span>Docente
        </h2>
        
        {/* Información del usuario y cierre de sesión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: '#aaa' }}>Hola, <strong style={{ color: '#e0e0e0' }}>{nombreUsuario}</strong></span>
          <button 
            onClick={cerrarSesion}
            style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.color = 'white'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ef4444'; }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* ==================== CONTENEDOR DINÁMICO (El "Viewport") ==================== */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Operador Ternario para decidir qué pantalla "montar" (renderizar) */}
        {vistaActual === 'lista' ? (
          
          /* PANTALLA 1: DASHBOARD / LISTA DE GUÍAS */
          <>
            {/* Controles de la lista */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, color: '#e0e0e0' }}>Mis Guías Guardadas</h2>
              
              {/* Botón para abrir el formulario en blanco (Modo Creación) */}
              <button 
                onClick={() => {
                  setGuiaEnEdicion(null); // Limpiamos por si había algo viejo
                  setVistaActual('formulario'); // Cambiamos de pantalla (Navegación)
                }}
                style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                ➕ Crear Nueva Guía
              </button>
            </div>
            
            {/* El Dashboard recibe un callback para saber qué guía quiere editar el usuario */}
            <ListaGuias onEditar={(guia) => {
              setGuiaEnEdicion(guia); // Guardamos la guía seleccionada
              setVistaActual('formulario'); // Cambiamos al formulario (Modo Edición)
            }} />
          </>

        ) : (

          /* PANTALLA 2: FORMULARIO MAESTRO (Creación / Edición) */
          <>
            {/* Botón de retroceso (Back) */}
            <button 
              onClick={() => {
                setGuiaEnEdicion(null); // Cancelamos edición
                setVistaActual('lista'); // Volvemos a la lista
              }}
              style={{ backgroundColor: 'transparent', color: '#aaa', border: '1px solid #333', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#666'; }}
              onMouseOut={(e) => { e.target.style.color = '#aaa'; e.target.style.borderColor = '#333'; }}
            >
              ⬅ Volver a Mis Guías
            </button>

            {/* Inyectamos la guía seleccionada (o null) al Orquestador */}
            <FormularioGuia 
                guiaEnEdicion={guiaEnEdicion} 
                limpiarEdicion={() => {
                  setGuiaEnEdicion(null);
                  setVistaActual('lista'); // Cuando guardemos o cancelemos en el formulario, nos devuelve a la lista
                }} 
            />
          </>
        )}

      </div>
    </div>
  );
}

export default App;