import React, { useState } from 'react';
import '../styles/LoginScreen.css';
import DECIA from '../assets/DECIA.webp';
import { loginUser } from "../services/api";

function LoginScreen({ onLogin, onRegister }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showRecovery, setShowRecovery] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [recoveryStep, setRecoveryStep] = useState(1);

    const clearLoginError = () => {
        if (error) {
            setError('');
        }
    };

  const handleLogin = async (event) => {
    event.preventDefault();

    setError('');

    if (!username.trim() || !password.trim()) {
        setError('Ingresa tu correo y contraseña.');
        return;
    }

    // El backend recibe un correo, no un nombre de usuario.
    const email = username.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        setError('Ingresa un correo electrónico válido.');
        return;
    }

    try {
        setLoading(true);

        // Solicitar autenticación al backend.
        const response = await loginUser(email, password);

        // Guardar preferencia de sesión.
        if (rememberMe) {
            localStorage.setItem('deciaRememberMe', 'true');
        } else {
            localStorage.removeItem('deciaRememberMe');
        }

        // api.js se encarga de guardar los tokens y el usuario.
        if (onLogin) {
            onLogin(response?.usuario || response);
        }

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        setError(
            error.message ||
            'No fue posible iniciar sesión. Inténtalo nuevamente.'
        );

    } finally {
        setLoading(false);
    }
};

    const openRecovery = () => {
        setRecoveryEmail('');
        setRecoveryCode('');
        setRecoveryStep(1);
        setError('');
        setShowRecovery(true);
    };

    const sendRecoveryCode = () => {

        if (!recoveryEmail.trim()) {
            setError('Ingresa un correo electrónico.');
            return;
        }

        setError('');
        setRecoveryStep(2);
    };

    const verifyRecoveryCode = () => {

        if (recoveryCode.length !== 6) {
            setError('El código debe tener 6 dígitos.');
            return;
        }

        setError('');

        alert(
            'Código aceptado en modo demostración. El restablecimiento real se conectará al backend.'
        );

        setShowRecovery(false);
    };

    return (
        <div className="login-screen">

            <header className="login-header">

                <div className="login-logo-container">
                    <img
                        src={DECIA}
                        alt="DECIA"
                        className="login-logo"
                    />
                </div>

                <h1>Bienvenido</h1>

                <p>
                    Inicia sesión en tu cuenta
                </p>

            </header>

            <main className="login-card">

                <form onSubmit={handleLogin}>

                    <div className="form-field">

                        <label>
                            Correo electrónico
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                ✉
                            </span>

                            <input
                                type="text"
                                placeholder="tu@correo.com"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    clearLoginError();
                                }}
                            />

                            {username && (
                                <button
                                    type="button"
                                    className="clear-input"
                                    onClick={() =>
                                        setUsername('')
                                    }
                                >
                                    ×
                                </button>
                            )}

                        </div>

                    </div>

                    <div className="form-field">

                        <label>
                            Contraseña
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                🔒
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearLoginError();
                                }}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? 'Ocultar'
                                    : 'Mostrar'}
                            </button>

                        </div>

                    </div>

                    <div className="login-options">

                        <label className="remember-option">

                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                            />

                            <span>
                                Recordarme
                            </span>

                        </label>

                        <button
                            type="button"
                            className="forgot-button"
                            onClick={openRecovery}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>

                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                   <button
                        type="submit"
                        className="login-main-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Validando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>

                    <div className="login-divider">
                        <span>o</span>
                    </div>

                    <button
                        type="button"
                        className="social-button"
                        onClick={() =>
                            alert(
                                'El acceso con Google se conectará posteriormente.'
                            )
                        }
                    >
                        G&nbsp;&nbsp; Continuar con Google
                    </button>

                    <button
                        type="button"
                        className="social-button"
                        onClick={() =>
                            alert(
                                'El acceso con Apple se conectará posteriormente.'
                            )
                        }
                    >
                        Continuar con Apple
                    </button>

                    <button
                        type="button"
                        className="biometric-button"
                        onClick={() =>
                            alert(
                                'El acceso biométrico se habilitará cuando exista autenticación compatible con el dispositivo.'
                            )
                        }
                    >
                        Ingresar con Huella / Face ID
                    </button>

                    <button
                        type="button"
                        className="register-button"
                        onClick={() => {
                            setError('');

                            if (onRegister) {
                                onRegister();
                            }
                        }}
                    >
                        Crear Cuenta
                    </button>

                </form>

            </main>

            {showRecovery && (

                <div className="login-modal-overlay">

                    <div className="login-modal">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setShowRecovery(false)
                            }
                        >
                            ×
                        </button>

                        {recoveryStep === 1 ? (

                            <>
                                <h2>
                                    Recuperar contraseña
                                </h2>

                                <p>
                                    Ingresa tu correo para recibir
                                    un código de recuperación.
                                </p>

                                <input
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={recoveryEmail}
                                    onChange={(e) =>
                                        setRecoveryEmail(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    className="login-main-button"
                                    onClick={
                                        sendRecoveryCode
                                    }
                                >
                                    Enviar código
                                </button>
                            </>

                        ) : (

                            <>
                                <h2>
                                    Código de recuperación
                                </h2>

                                <p>
                                    Ingresa el código de 6 dígitos
                                    enviado a tu correo.
                                </p>

                                <input
                                    type="text"
                                    maxLength="6"
                                    inputMode="numeric"
                                    placeholder="000000"
                                    value={recoveryCode}
                                    onChange={(e) =>
                                        setRecoveryCode(
                                            e.target.value.replace(
                                                /\D/g,
                                                ''
                                            )
                                        )
                                    }
                                />

                                <button
                                    className="login-main-button"
                                    onClick={
                                        verifyRecoveryCode
                                    }
                                >
                                    Verificar código
                                </button>
                            </>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default LoginScreen;