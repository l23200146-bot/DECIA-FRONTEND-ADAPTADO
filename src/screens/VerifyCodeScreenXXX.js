
import React, { useEffect, useRef, useState } from 'react';
import '../styles/VerifyCodeScreen.css';

function VerifyCodeScreen({
    email = '',
    onBack,
    onVerified
}) {
    const [code, setCode] = useState(['', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const inputRefs = useRef([]);

    // Código temporal para la demostración
    const DEMO_CODE = '12345';

    // Temporizador
    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    const formatTime = () => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');

        const remainingSeconds = (seconds % 60)
            .toString()
            .padStart(2, '0');

        return `${minutes}:${remainingSeconds}`;
    };

    const triggerError = (message) => {
        setError(message);
        setShake(true);

        setTimeout(() => {
            setShake(false);
        }, 500);
    };

    const verifyCode = (finalCode = code.join('')) => {
        if (finalCode.length !== 5) {
            return;
        }

        setError('');
        setLoading(true);

        // Simulación temporal del backend
        setTimeout(() => {
            if (finalCode === DEMO_CODE) {
                    setLoading(false);

                    localStorage.setItem(
                        'deciaUser',
                        JSON.stringify({
                            username: email,
                            name: 'Usuario DECIA'
                        })
                    );

                    localStorage.setItem(
                        'deciaToken',
                        'demo-token'
                    );

                    if (onVerified) {
                        onVerified();
                    }

            } else {
                setLoading(false);

                triggerError(
                    'Código incorrecto, intenta de nuevo.'
                );

                setCode(['', '', '', '', '']);

                setTimeout(() => {
                    inputRefs.current[0]?.focus();
                }, 100);
            }
        }, 900);
    };

    const handleChange = (value, index) => {
        if (loading) return;

        const cleanValue = value.slice(-1);

        if (!cleanValue) {
            const newCode = [...code];
            newCode[index] = '';
            setCode(newCode);
            return;
        }

        const newCode = [...code];
        newCode[index] = cleanValue;

        setCode(newCode);
        setError('');

        if (index < 4) {
            inputRefs.current[index + 1]?.focus();
        }

        const completeCode = newCode.join('');

        if (completeCode.length === 5) {
            verifyCode(completeCode);
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Backspace') {
            if (code[index]) {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            } else if (index > 0) {
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);

                inputRefs.current[index - 1]?.focus();
            }
        }

        if (
            event.key === 'ArrowLeft' &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }

        if (
            event.key === 'ArrowRight' &&
            index < 4
        ) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();

        if (loading) return;

        const pastedText = event.clipboardData
            .getData('text')
            .trim()
            .slice(0, 5);

        if (!pastedText) return;

        const pastedCode = pastedText
            .split('')
            .slice(0, 5);

        const newCode = ['', '', '', '', ''];

        pastedCode.forEach((character, index) => {
            newCode[index] = character;
        });

        setCode(newCode);
        setError('');

        if (pastedCode.length === 5) {
            verifyCode(pastedCode.join(''));
        } else {
            inputRefs.current[pastedCode.length]?.focus();
        }
    };

    const handleResend = () => {
        if (seconds > 0 || loading) return;

        setCode(['', '', '', '', '']);
        setError('');
        setSeconds(60);

        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);

        alert(
            'Se ha reenviado un nuevo código en modo demostración.'
        );
    };

    return (
        <div className="verify-screen">

            <header className="verify-header">

                <button
                    type="button"
                    className="verify-back-button"
                    onClick={onBack}
                >
                    &lt; Regresar
                </button>

                <div className="verify-header-title">
                    <span className="verify-header-icon">
                        ✉
                    </span>

                    <div>
                        <h1>Verificar correo</h1>

                        <p>
                            Ingresa el código enviado a tu email
                        </p>
                    </div>
                </div>

            </header>

            <main className="verify-card">

                <div className="verify-mail-bubble">
                    <span>✉</span>
                </div>

                <h2>Revisa tu correo</h2>

                <p className="verify-description">
                    Hemos enviado un código de verificación
                    de 5 caracteres a tu correo electrónico.
                    Revisa también la carpeta de spam.
                </p>

                {email && (
                    <div className="verify-email">
                        {email}
                    </div>
                )}

                <div
                    className={`otp-container ${
                        shake ? 'otp-shake' : ''
                    } ${error ? 'otp-error' : ''}`}
                >
                    {code.map((character, index) => (
                        <input
                            key={index}
                            ref={(element) => {
                                inputRefs.current[index] = element;
                            }}
                            className="otp-input"
                            type="text"
                            maxLength="1"
                            value={character}
                            disabled={loading}
                            autoComplete="one-time-code"
                            onChange={(event) =>
                                handleChange(
                                    event.target.value,
                                    index
                                )
                            }
                            onKeyDown={(event) =>
                                handleKeyDown(
                                    event,
                                    index
                                )
                            }
                            onPaste={handlePaste}
                        />
                    ))}
                </div>

                {error && (
                    <div className="verify-error">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    className="verify-main-button"
                    disabled={
                        loading ||
                        code.join('').length !== 5
                    }
                    onClick={() => verifyCode()}
                >
                    {loading ? (
                        <>
                            <span className="verify-spinner"></span>
                            Verificando...
                        </>
                    ) : (
                        'Verificar'
                    )}
                </button>

                <div className="resend-container">

                    {seconds > 0 ? (
                        <span className="resend-disabled">
                            Reenviar código en {formatTime()}
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="resend-button"
                            onClick={handleResend}
                        >
                            Reenviar código
                        </button>
                    )}

                </div>

                <div className="verify-help">
                    ¿No recibiste el código?
                    <br />
                    Revisa que tu correo sea correcto y
                    verifica tu carpeta de spam.
                </div>

            </main>

        </div>
    );
}

export default VerifyCodeScreen;

