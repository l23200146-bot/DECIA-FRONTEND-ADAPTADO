
import React, { useEffect, useState } from 'react';
import '../styles/SelectProfileScreen.css';
import decia from '../assets/DECIA.webp';
import { getUserProfile } from '../services/api';

function SelectProfileScreen({
    language,
    theme,
    symptomName,
    onSelectProfile,
    onBack
}) {
    const [perfil, setPerfil] = useState(null);
    const [cuenta, setCuenta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);

    const isEnglish = language === 'en';

    useEffect(() => {
        let mounted = true;

        const cargarPerfil = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await getUserProfile();
                const data = response?.data || response;

                if (!mounted) return;

                setCuenta(data?.cuenta || null);
                setPerfil(data?.perfil || null);

                if (data?.perfil?.id_perfil) {
                    setSelectedProfile(data.perfil.id_perfil);
                }

            } catch (err) {
                if (mounted) {
                    setError(
                        err.message ||
                        'No fue posible cargar tu perfil.'
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        cargarPerfil();

        return () => {
            mounted = false;
        };
    }, []);

    const handleProfileSelect = () => {
        if (!perfil?.id_perfil) return;

        setSelectedProfile(perfil.id_perfil);
        onSelectProfile(perfil.id_perfil);
    };

    const formatDate = (date) => {
        if (!date) return isEnglish
            ? 'Not available'
            : 'No disponible';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            isEnglish ? 'en-US' : 'es-MX'
        );
    };

    const getGender = (gender) => {
        const genders = {
            M: isEnglish ? 'Male' : 'Masculino',
            F: isEnglish ? 'Female' : 'Femenino',
            O: isEnglish ? 'Other' : 'Otro',
            P: isEnglish ? 'Prefer not to say' : 'Prefiero no decir'
        };

        return genders[gender] || gender || (
            isEnglish ? 'Not specified' : 'No especificado'
        );
    };

    return (
        <div className={`select-profile ${theme === 'dark' ? 'dark-mode' : ''}`}>

            <header className="select-profile-header">

                <button
                    className="back-button"
                    onClick={onBack}
                    aria-label={isEnglish ? 'Back' : 'Regresar'}
                >
                    ‹
                </button>

                <div className="header-title">
                    <h1>
                        {isEnglish ? 'Select profile' : 'Seleccionar perfil'}
                    </h1>

                    <p>
                        {isEnglish ? 'Symptom: ' : 'Síntoma: '}
                        {symptomName}
                    </p>
                </div>

                <img
                    src={decia}
                    alt="DECIA"
                    className="select-profile-logo"
                />

            </header>

            <main className="select-profile-content">

                <section className="profile-introduction">
                    <h2>
                        {isEnglish
                            ? 'Who is this evaluation for?'
                            : '¿Para quién es la evaluación?'}
                    </h2>

                    <p>
                        {isEnglish
                            ? 'Select the account profile for this evaluation.'
                            : 'Selecciona el perfil de la cuenta que realizará esta evaluación.'}
                    </p>
                </section>

                {loading && (
                    <p>
                        {isEnglish
                            ? 'Loading profile...'
                            : 'Cargando perfil...'}
                    </p>
                )}

                {!loading && error && (
                    <div className="profile-error">
                        <p>{error}</p>

                        <button onClick={() => window.location.reload()}>
                            {isEnglish ? 'Try again' : 'Reintentar'}
                        </button>
                    </div>
                )}

                {!loading && !error && perfil && (
                    <section className="profiles-list">

                        <button
                            className={`profile-card ${
                                selectedProfile === perfil.id_perfil
                                    ? 'selected'
                                    : ''
                            }`}
                            onClick={handleProfileSelect}
                        >

                            <div className="profile-avatar">
                                {perfil.nombre
                                    ? perfil.nombre.charAt(0).toUpperCase()
                                    : '?'}
                            </div>

                            <div className="profile-info">

                                <h3>{perfil.nombre}</h3>

                                <p>{getGender(perfil.genero)}</p>

                                <p>
                                    {isEnglish ? 'Birth date: ' : 'Nacimiento: '}
                                    {formatDate(perfil.fecha_nacimiento)}
                                </p>

                                <p>
                                    {isEnglish
                                        ? 'Registered account profile'
                                        : 'Perfil registrado en tu cuenta'}
                                </p>

                                {cuenta?.email && (
                                    <p>{cuenta.email}</p>
                                )}

                            </div>

                            <span className="profile-arrow">›</span>

                        </button>

                    </section>
                )}

                {!loading && !error && !perfil && (
                    <p>
                        {isEnglish
                            ? 'No personal profile is registered in this account.'
                            : 'Esta cuenta todavía no tiene un perfil personal registrado.'}
                    </p>
                )}

                <p className="profile-note">
                    {isEnglish
                        ? 'Currently, DECIA uses the profile associated with your account. Additional profiles are not available yet.'
                        : 'Por el momento, DECIA utiliza el perfil asociado a tu cuenta. La administración de perfiles adicionales todavía no está disponible.'}
                </p>

            </main>

            <nav className="profile-bottom-nav">

                <button onClick={onBack}>
                    {isEnglish ? 'Home' : 'Inicio'}
                </button>

                <button className="active">
                    {isEnglish ? 'Profile' : 'Perfil'}
                </button>

                <button>
                    {isEnglish ? 'Settings' : 'Ajustes'}
                </button>

            </nav>

        </div>
    );
}

export default SelectProfileScreen;
