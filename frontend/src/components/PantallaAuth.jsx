import { useState } from 'react';

/**
 * Componente principal de autenticación.
 * Gestiona tanto el flujo de inicio de sesión (Login) como el registro de nuevos usuarios.
 * Maneja su propio estado local y realiza peticiones HTTP (fetch) a la API de Spring Boot.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {function} props.onLogin - Función callback inyectada por el componente padre.
 */
export default function PantallaAuth({ onLogin }) {
    const [esRegistro, setEsRegistro] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    
    // ESTADO PARA EL MODAL "ACERCA DE"
    const [mostrarAbout, setMostrarAbout] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('Cargando...');

        // CRÍTICO: Leemos la URL base desde las variables de entorno (Ocultas en GitHub).
        // Si no existe (por ejemplo, alguien se bajó el repo y no configuró el .env), hacemos fallback a localhost por seguridad.
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

        const url = esRegistro 
            ? `${baseUrl}/api/auth/registro`
            : `${baseUrl}/api/auth/login`;

        const payload = esRegistro 
            ? { nombre, email, password } 
            : { email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                if (esRegistro) {
                    setMensaje('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    setEsRegistro(false);
                    setPassword('');
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuarioNombre', data.nombre);
                    localStorage.setItem('usuarioId', data.usuarioId);
                    
                    onLogin(data);
                }
            } else {
                setMensaje(`❌ Error: ${data.error || 'Algo salió mal'}`);
            }
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error de conexión con el servidor.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', position: 'relative' }}>
            
            <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid #333' }}>
                
                <h2 style={{ textAlign: 'center', color: '#e0e0e0', marginTop: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                    {esRegistro ? 'Crear Cuenta' : 'Bienvenido/a'}
                </h2>
                <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '14px' }}>
                    Plataforma de Gestión de Guías Docentes
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {esRegistro && (
                        <div>
                            <label style={{ fontWeight: '600', fontSize: '13px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre completo</label>
                            <input 
                                type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required 
                                style={{ width: '100%', padding: '12px 15px', marginTop: '8px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.3s' }}
                                onFocus={(e) => e.target.style.border = '1px solid #3b82f6'}
                                onBlur={(e) => e.target.style.border = '1px solid #333'}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ fontWeight: '600', fontSize: '13px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                        <input 
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                            style={{ width: '100%', padding: '12px 15px', marginTop: '8px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.3s' }}
                            onFocus={(e) => e.target.style.border = '1px solid #3b82f6'}
                            onBlur={(e) => e.target.style.border = '1px solid #333'}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: '600', fontSize: '13px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contraseña</label>
                        <input 
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                            style={{ width: '100%', padding: '12px 15px', marginTop: '8px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.3s' }}
                            onFocus={(e) => e.target.style.border = '1px solid #3b82f6'}
                            onBlur={(e) => e.target.style.border = '1px solid #333'}
                        />
                    </div>

                    <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', transition: 'background-color 0.2s', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}>
                        {esRegistro ? 'Registrarse' : 'Entrar al Gestor'}
                    </button>
                </form>

                {mensaje && (
                    <p style={{ textAlign: 'center', fontWeight: '500', marginTop: '20px', fontSize: '14px', color: mensaje.includes('❌') ? '#ef4444' : '#10b981' }}>
                        {mensaje}
                    </p>
                )}

                <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
                        {esRegistro ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
                    </p>
                    <button 
                        onClick={() => { setEsRegistro(!esRegistro); setMensaje(''); }}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', marginTop: '8px', fontSize: '14px' }}
                    >
                        {esRegistro ? 'Inicia sesión aquí' : 'Crea una cuenta gratis'}
                    </button>
                </div>
            </div>

            {/* BOTÓN "ACERCA DE" */}
            <button 
                onClick={() => setMostrarAbout(true)} 
                style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'none', border: '1px solid #555', color: '#aaa', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}
                onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#888'; }}
                onMouseOut={(e) => { e.target.style.color = '#aaa'; e.target.style.borderColor = '#555'; }}
            >
                ℹ️ Acerca del Proyecto
            </button>

            {/* MODAL "ACERCA DE" CORREGIDO */}
            {mostrarAbout && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '12px', border: '1px solid #333', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <h2 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '24px' }}>Gestor de Guías Docentes</h2>
                        
                        <p style={{ color: '#e0e0e0', lineHeight: '1.6', marginBottom: '15px', fontSize: '15px' }}>
                            Plataforma integral diseñada para que las universidades e instituciones educativas puedan crear, editar, estandarizar y gestionar sus guías docentes de manera eficiente.
                        </p>
                        
                        <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '30px', fontSize: '14px' }}>
                            Aplicación desarrollada como <strong>Trabajo de Fin de Grado (TFG)</strong>. Construida sobre una arquitectura sólida utilizando <strong>React</strong> para el frontend y <strong>Spring Boot (Java)</strong> con <strong>MongoDB</strong> para el backend, incorporando además capacidades de <strong>Inteligencia Artificial Generativa</strong> y exportación a formatos de <strong>Web Semántica (RDF)</strong> y PDF.
                        </p>
                        
                        <div style={{ backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #444' }}>
                            <p style={{ margin: '0 0 12px 0', color: '#e0e0e0', fontSize: '16px' }}><strong>Autor:</strong> Alejandro Royo López de Felipe</p>
                            <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>Universidad Politécnica de Madrid (UPM)</p>
                        </div>
                        
                        <button 
                            onClick={() => setMostrarAbout(false)} 
                            style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'background-color 0.2s' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
            
        </div>
    );
}