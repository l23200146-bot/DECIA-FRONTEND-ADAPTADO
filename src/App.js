
import React, { useEffect, useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import DashboardScreen from './screens/DashboardScreen';
import SelectProfileScreen from './screens/SelectProfileScreen';
import SymptomStep1 from './screens/SymptomStep1';
import ResultScreen from './screens/ResultScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import NearbyDoctorsScreen from './screens/NearbyDoctorsScreen';
import RegisterScreen from './screens/RegisterScreen';

import {
    logoutUser,
    clearAuthSession
} from './services/api';

const RECENT_EVALUATIONS_KEY =
    'deciaRecentEvaluations';

function App() {

    const [showSplash, setShowSplash] = useState(true);

   const [currentScreen, setCurrentScreen] = useState(() => {
    const savedUser = localStorage.getItem('deciaUser');
    const savedToken = localStorage.getItem('deciaToken');

    return savedUser && savedToken
        ? 'dashboard'
        : 'login';
});


    const [symptomName, setSymptomName] =
        useState('');

    const [profileId, setProfileId] =
        useState(null);

    const [evaluationResult, setEvaluationResult] =
        useState(null);

    const [recommendedSpecialty, setRecommendedSpecialty] =
    useState('');
    /* ==========================================
       AJUSTES
    ========================================== */

    const [language, setLanguage] =
        useState(
            localStorage.getItem('deciaLanguage') || 'es'
        );

    const [theme, setTheme] =
        useState(
            localStorage.getItem('deciaTheme') || 'light'
        );

    const [locationEnabled, setLocationEnabled] =
        useState(
            localStorage.getItem('deciaLocation') !== 'false'
        );

    const [notificationsEnabled, setNotificationsEnabled] =
        useState(
            localStorage.getItem('deciaNotifications') !== 'false'
        );

    const [cameraEnabled, setCameraEnabled] =
        useState(
            localStorage.getItem('deciaCamera') !== 'false'
        );
       useEffect(() => {
    document.body.className =
        theme === 'dark' ? 'decia-dark' : 'decia-light';
}, [theme]);

    /* ==========================================
       GUARDAR AJUSTES
    ========================================== */

    const handleSetLanguage = (value) => {

        setLanguage(value);

        localStorage.setItem(
            'deciaLanguage',
            value
        );
    };

  const handleFindDoctor = (result) => {
    const symptom = (
        result?.symptomName ||
        symptomName ||
        ''
    ).toLowerCase();

    let specialty = 'Medicina Interna';

    if (
        symptom.includes('cabeza') ||
        symptom.includes('migraña')
    ) {
        specialty = 'Neurología';
    } else if (
        symptom.includes('pecho') ||
        symptom.includes('respiratorio')
    ) {
        specialty = 'Urgenciología';
    } else if (
        symptom.includes('abdominal') ||
        symptom.includes('fiebre')
    ) {
        specialty = 'Medicina Interna';
    }

    setRecommendedSpecialty(specialty);
    setCurrentScreen('nearbyDoctors');
};
    const handleSetTheme = (value) => {

        setTheme(value);

        localStorage.setItem(
            'deciaTheme',
            value
        );
    };


    const handleSetLocation = (value) => {

        setLocationEnabled(value);

        localStorage.setItem(
            'deciaLocation',
            value
        );
    };


    const handleSetNotifications = (value) => {

        setNotificationsEnabled(value);

        localStorage.setItem(
            'deciaNotifications',
            value
        );
    };


    const handleSetCamera = (value) => {

        setCameraEnabled(value);

        localStorage.setItem(
            'deciaCamera',
            value
        );
    };


    /* ==========================================
       EVALUACIONES
    ========================================== */

    const [recentEvaluations, setRecentEvaluations] =
        useState(() => {

            try {

                const saved =
                    localStorage.getItem(
                        RECENT_EVALUATIONS_KEY
                    );

                return saved
                    ? JSON.parse(saved)
                    : [];

            } catch (error) {

                console.error(
                    'Error al recuperar evaluaciones:',
                    error
                );

                return [];
            }
        });


    const handleSymptomSelect = (symptom) => {

        setSymptomName(symptom);

        setCurrentScreen(
            'selectProfile'
        );
    };


    const handleProfileSelect = (id) => {

        setProfileId(id);

        setCurrentScreen(
            'symptomStep1'
        );
    };

const handleEvaluationFinish = (result) => {
    const finalResult = result?.resultado_final || result;

    const resultWithUrgency = {
        ...result,
        urgency:
            finalResult?.clasificacion_color ||
            result?.urgency ||
            'AMARILLO'
    };

    const updatedEvaluations = [
        resultWithUrgency,
        ...recentEvaluations
    ].slice(0, 5);

    setRecentEvaluations(updatedEvaluations);

    localStorage.setItem(
        'deciaRecentEvaluations',
        JSON.stringify(updatedEvaluations)
    );

    setEvaluationResult(resultWithUrgency);
    setCurrentScreen('result');
};


    const handleRecentSelect = (evaluation) => {

        setSymptomName(
            evaluation.symptomName || ''
        );

        setProfileId(
            evaluation.profileId || null
        );

        setEvaluationResult(
            evaluation
        );

        setCurrentScreen(
            'result'
        );

    };


    /* ==========================================
       NAVEGACIÓN
    ========================================== */
    

    const handleBackHome = () => {

        setCurrentScreen(
            'dashboard'
        );

    };


    const handleAccount = () => {

        setCurrentScreen(
            'account'
        );

    };


    const handleSettings = () => {

        setCurrentScreen(
            'settings'
        );

    };


    const handleCreateProfile = () => {

        console.log(
            'Crear nuevo perfil'
        );

    };


    /* ==========================================
       CERRAR SESIÓN
    ========================================== */

   const handleLogout = async () => {
    try {
        await logoutUser();
    } catch (error) {
        console.error(
            'Error al cerrar sesión en el servidor:',
            error
        );
    } finally {
        clearAuthSession();
        setEvaluationResult(null);
        setSymptomName('');
        setProfileId(null);
        setCurrentScreen('login');
    }
};


    /* ==========================================
       SPLASH
    ========================================== */

    if (showSplash) {

        return (

            <SplashScreen
                onFinish={() =>
                    setShowSplash(false)
                }
            />

        );

    }

    if (currentScreen === 'nearbyDoctors') {
    return (
        <NearbyDoctorsScreen
            specialty={recommendedSpecialty}
            onBack={() => setCurrentScreen('result')}
        />
    );
}

    /* ==========================================
       LOGIN
    ========================================== */

   if (currentScreen === 'login') {
    return (
        <LoginScreen
            onLogin={() => setCurrentScreen('dashboard')}
            onRegister={() => setCurrentScreen('register')}
        />
    );
    }
   if (currentScreen === 'register') {
    return (
        <RegisterScreen
            onBackToLogin={() => setCurrentScreen('login')}
            onRegisterSuccess={() => {
                setCurrentScreen('dashboard');
            }}
        />
    );
}
   
    /* ==========================================
       DASHBOARD
    ========================================== */

    if (
        currentScreen ===
        'dashboard'
    ) {

        return (

            <DashboardScreen

                user={JSON.parse(localStorage.getItem('deciaUser') || '{}')}

                language={language}
                theme={theme}

                onSymptomSelect={
                    handleSymptomSelect
                }

                recentEvaluations={
                    recentEvaluations
                }

                onRecentSelect={
                    handleRecentSelect
                }

                onAccount={
                    handleAccount
                }

                onSettings={
                    handleSettings
                }

            />

        );

    }


    /* ==========================================
       CUENTA
    ========================================== */

   if (currentScreen === 'account') {
    return (
        <AccountScreen
            theme={theme}
            onBack={handleBackHome}
            onHome={handleBackHome}
            onSettings={handleSettings}
        />
    );
}


    /* ==========================================
       AJUSTES
    ========================================== */

    if (
        currentScreen ===
        'settings'
    ) {

        return (

            <SettingsScreen

                language={
                    language
                }

                setLanguage={
                    handleSetLanguage
                }

                theme={
                    theme
                }

                setTheme={
                    handleSetTheme
                }

                locationEnabled={
                    locationEnabled
                }

                setLocationEnabled={
                    handleSetLocation
                }

                notificationsEnabled={
                    notificationsEnabled
                }

                setNotificationsEnabled={
                    handleSetNotifications
                }

                cameraEnabled={
                    cameraEnabled
                }

                setCameraEnabled={
                    handleSetCamera
                }

                onBackHome={
                    handleBackHome
                }

                onAccount={
                    handleAccount
                }

                onLogout={
                    handleLogout
                }

            />

        );

    }


    /* ==========================================
       PERFIL
    ========================================== */

    if (
        currentScreen ===
        'selectProfile'
    ) {

        return (

            <SelectProfileScreen
            language={language}
            theme={theme}

                symptomName={
                    symptomName
                }

                onSelectProfile={
                    handleProfileSelect
                }

                onCreateProfile={
                    handleCreateProfile
                }

                onBack={
                    handleBackHome
                }

            />

        );

    }


    /* ==========================================
       CUESTIONARIO
    ========================================== */

    if (currentScreen === 'symptomStep1') {
    return (
        <SymptomStep1
            language={language}
            theme={theme}
            symptomName={symptomName}
            profileId={profileId}
      
            onBack={() => setCurrentScreen('selectProfile')}
            onFinish={handleEvaluationFinish}
        />
    );
}


    /* ==========================================
       RESULTADO
    ========================================== */
        if (
            currentScreen ===
            'result'
        ) {

            return (

                <ResultScreen

                 language={
                        language
                    }

                    theme={
                        theme
                    }


                    result={
                        evaluationResult
                    }

                    onBackHome={
                        handleBackHome
                    }

                    onFindDoctor={
                        handleFindDoctor
                    }

                />

            );

        }


    return null;
}

export default App;