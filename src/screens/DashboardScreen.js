import React, { useEffect, useState } from 'react';
import '../styles/DashboardScreen.css';
import decia from '../assets/DECIA.webp';

/* =========================
   CLIMA
========================= */

function useWeather() {
    const [weather, setWeather] = useState({
        loading: true,
        temperature: null,
        description: 'Obteniendo clima...'
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setWeather({
                loading: false,
                temperature: 24,
                description: 'Clima no disponible'
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
                    );

                    const data = await response.json();

                    const temperature = Math.round(
                        data.current.temperature_2m
                    );

                    setWeather({
                        loading: false,
                        temperature,
                        description: getWeatherDescription(
                            data.current.weather_code
                        )
                    });
                } catch (error) {
                    setWeather({
                        loading: false,
                        temperature: 24,
                        description: 'Clima no disponible'
                    });
                }
            },
            () => {
                setWeather({
                    loading: false,
                    temperature: 24,
                    description: 'Ubicación no disponible'
                });
            }
        );
    }, []);

    return weather;
}

function getWeatherDescription(code) {
    if (code === 0) return 'Despejado';
    if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
    if ([45, 48].includes(code)) return 'Nublado';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Llovizna';
    if ([61, 63, 65, 66, 67].includes(code)) return 'Lluvia';
    if ([71, 73, 75, 77].includes(code)) return 'Nieve';
    if ([80, 81, 82].includes(code)) return 'Chubascos';
    if ([95, 96, 99].includes(code)) return 'Tormenta';

    return 'Clima actual';
}

/* =========================
   BUSCADOR
========================= */

const commonSymptoms = [
    'Dolor de cabeza',
    'Dolor abdominal',
    'Dolor en el pecho',
    'Fiebre',
    'Dolor de garganta',
    'Tos',
    'Mareo',
    'Náuseas',
    'Dolor muscular',
    'Dificultad para respirar'
];

function SearchInput({ onSearch }) {
    const [search, setSearch] = useState('');

    const filteredSymptoms = commonSymptoms.filter((symptom) =>
        symptom.toLowerCase().includes(search.toLowerCase())
    );

    const showSuggestions = search.trim().length > 0;

    const handleSearch = () => {
        if (!search.trim()) return;
        onSearch(search.trim());
    };

    return (
        <div className="search-wrapper">
            <div className="search-container">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="Ingresa algún síntoma..."
                    aria-label="Buscar síntomas"
                />

                <button
                    className="search-button"
                    onClick={handleSearch}
                    type="button"
                    aria-label="Buscar"
                >
                    Buscar
                </button>
            </div>

            {showSuggestions && (
                <div className="search-suggestions">
                    {filteredSymptoms.length > 0 ? (
                        filteredSymptoms.slice(0, 5).map((symptom) => (
                            <button
                                key={symptom}
                                type="button"
                                onClick={() => onSearch(symptom)}
                            >
                                {symptom}
                            </button>
                        ))
                    ) : (
                        <p>No encontramos ese síntoma.</p>
                    )}
                </div>
            )}
        </div>
    );
}
/* =========================
   ACCIONES RÁPIDAS
========================= */

function QuickActionCard({ icon, title, color, onClick })  {
    return (
            <button
                className="quick-action-card"
                style={{ '--card-color': color }}
                onClick={onClick}
            >
            <div className="quick-action-icon">
                {icon}
            </div>

            <div className="quick-action-content">
                <h3>{title}</h3>
                <p>Iniciar evaluación</p>
            </div>

        </button>
    );
}

/* =========================
   ACTIVIDAD RECIENTE
========================= */

function RecentActivity({ title, date, urgency, onClick }) {
    const urgencyClass = urgency.toLowerCase();

    return (
        <button
            className={`activity-card ${urgencyClass}`}
            onClick={onClick}
        >
            <div className="activity-icon">+</div>

            <div className="activity-info">
                <h3>{title}</h3>
                <p>{date}</p>
            </div>

            <span className="urgency-badge">
                {urgency}
            </span>
        </button>
    );
}

/* =========================
   SKELETON
========================= */

function ActivitySkeleton() {
    return (
        <div className="activity-skeleton">

            <div className="skeleton-circle"></div>

            <div className="skeleton-content">
                <div className="skeleton-line large"></div>
                <div className="skeleton-line small"></div>
            </div>

        </div>
    );
}

/* =========================
   ACTIVIDAD VACÍA
========================= */

function EmptyActivity() {
    return (
        <div className="empty-activity">

            <div className="empty-icon">
                +
            </div>

            <h3>Aún no tienes evaluaciones</h3>

            <p>
                Cuando realices una evaluación,
                aparecerá aquí.
            </p>

        </div>
    );
}

/* =========================
   DASHBOARD
========================= */

function DashboardScreen({
    language,
    theme,
     user,
    onEmergency,
    onSymptomSelect,
    recentEvaluations = [],
    onRecentSelect,   
     onAccount,
    onSettings
})  {
    const isDark = theme === 'dark';
    const weather = useWeather();

    

    return (
            <div className={`dashboard-screen ${isDark ? 'dark-mode' : ''}`}>

            {/* FONDO DECORATIVO */}

            <div className="decorative-background">
                <div className="bubble bubble-one"></div>
                <div className="bubble bubble-two"></div>
                <div className="bubble bubble-three"></div>

                <div className="health-decoration decoration-one">
                    +
                </div>

                <div className="health-decoration decoration-two">
                    ♥
                </div>

                <div className="health-decoration decoration-three">
                    +
                </div>
            </div>


            {/* CONTENIDO PRINCIPAL */}

            <div className="dashboard-layer">

                {/* HEADER */}

                <header className="dashboard-header">

                    <div className="brand">
                        <img src={decia} alt="DECIA" />
                        <span>DECIA</span>
                    </div>

                    <div className="header-actions">

                        <button
                            className="sos-button"
                            onClick={onEmergency}
                            aria-label="Emergencia"
                        >
                            SOS
                        </button>

                        <button
                            className="profile-avatar"
                            aria-label="Perfil de usuario"
                        >
                            C
                        </button>

                    </div>

                </header>


                {/* CONTENIDO */}

                <main className="dashboard-content">

                    {/* BUSCADOR */}

                   <SearchInput onSearch={onSymptomSelect} />


                    {/* BIENVENIDA */}

                    <section className="welcome-banner">

                        <div className="welcome-text">

                          <h1>
                       ¡Hola, {user?.nombre?.split(' ')[0] || 'bienvenido'}!
                        </h1>

                            <p>
                                ¿Cómo podemos ayudarte hoy?
                            </p>

                        </div>

                        <div className="weather-info">

                            {weather.loading ? (
                                <>
                                    <div className="weather-skeleton"></div>
                                    <div className="weather-skeleton-small"></div>
                                </>
                            ) : (
                                <>
                                    <span className="temperature">
                                        {weather.temperature}°
                                    </span>

                                    <span className="weather-description">
                                        {weather.description}
                                    </span>
                                </>
                            )}

                        </div>

                    </section>


                    {/* ACCIONES RÁPIDAS */}

                    <section className="dashboard-section">

                        <h2>Acciones rápidas</h2>

                        <div className="quick-actions">

                           <QuickActionCard
                                icon="🧠"
                                title="Dolor de cabeza"
                                color="#DDEEFF"
                                onClick={() => onSymptomSelect('Dolor de cabeza')}
                            />

                            <QuickActionCard
                                icon="🩺"
                                title="Dolor abdominal"
                                color="#FFF4CC"
                                onClick={() => onSymptomSelect('Dolor abdominal')}
                            />

                            <QuickActionCard
                                icon="❤️"
                                title="Dolor en el pecho"
                                color="#FFE3E8"
                                onClick={() => onSymptomSelect('Dolor en el pecho')}
                            />

                            <QuickActionCard
                                icon="🌡️"
                                title="Fiebre"
                                color="#EDE2FF"
                                onClick={() => onSymptomSelect('Fiebre')}
                            />

                        </div>

                    </section>


                    {/* ACTIVIDAD RECIENTE */}

                    <section className="dashboard-section">

                        <div className="section-title">

                            <h2>Actividad reciente</h2>

                            <button className="view-all">
                                Ver todo
                            </button>

                        </div>

                        <div className="activity-list">

                        {recentEvaluations.length > 0 ? (
                                recentEvaluations.map((evaluation) => (
                                    <RecentActivity
                                        key={evaluation.id}
                                        title={evaluation.symptomName || 'Evaluación médica'}
                                        date={evaluation.date || 'Fecha no disponible'}
                                        urgency={evaluation.urgency || 'AMARILLO'}
                                        onClick={() => onRecentSelect(evaluation)}
                                    />
                                ))
                            ) : (
                                <EmptyActivity />
                            )}

                        </div>

                    </section>

                </main>


                {/* NAVEGACIÓN */}

                <nav className="bottom-nav">

                    <button
                        className="nav-item active"
                        onClick={() => window.location.reload()}
                    >
                        <span>⌂</span>
                        <small>Inicio</small>
                    </button>

                    <button
                        className="nav-item"
                        onClick={onAccount}
                    >
                        <span>○</span>
                        <small>Cuenta</small>
                    </button>

                    <button
                        className="nav-item"
                        onClick={onSettings}
                    >
                        <span>⚙</span>
                        <small>Ajustes</small>
                    </button>

                </nav>
            </div>

        </div>
    );
}

export default DashboardScreen;