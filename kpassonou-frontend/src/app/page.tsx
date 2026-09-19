'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AlertResponse } from '@/types/alert';
import AlertCard from '@/components/AlertCard';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-xl">
      <div className="text-center">
        <div className="animate-pulse text-4xl mb-2">🗺️</div>
        <p className="text-blue-600 font-medium">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [data, setData] = useState<AlertResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [lastAlert, setLastAlert] = useState<string | null>(null);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/alerts');
      if (!response.ok) throw new Error('Erreur de connexion');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const simulateAlert = async () => {
    setSimulating(true);
    try {
      const response = await fetch('http://localhost:8001/api/simulate', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        setLastAlert(`✅ Alerte ${result.alert.camera_id} - ${result.alert.status.toUpperCase()}`);
        await fetchData();
        setTimeout(() => setLastAlert(null), 3000);
      } else {
        setLastAlert(`❌ ${result.message}`);
        setTimeout(() => setLastAlert(null), 3000);
      }
    } catch (err) {
      setLastAlert('❌ FastAPI non disponible');
      setTimeout(() => setLastAlert(null), 3000);
    } finally {
      setSimulating(false);
    }
  };

  const simulateMultiple = async () => {
    setSimulating(true);
    try {
      const response = await fetch('http://localhost:8001/api/simulate/multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5 }),
      });
      const result = await response.json();
      if (result.success) {
        setLastAlert(`⚡ ${result.count} alertes simulées`);
        await fetchData();
        setTimeout(() => setLastAlert(null), 3000);
      }
    } catch (err) {
      setLastAlert('❌ FastAPI non disponible');
      setTimeout(() => setLastAlert(null), 3000);
    } finally {
      setSimulating(false);
    }
  };

  const toggleDemoMode = () => {
    if (demoMode) {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
      setDemoMode(false);
      setLastAlert('⏹️ Mode démo arrêté');
      setTimeout(() => setLastAlert(null), 2000);
    } else {
      setDemoMode(true);
      setLastAlert('▶️ Mode démo démarré - 1 alerte/3s');
      setTimeout(() => setLastAlert(null), 2000);
      demoIntervalRef.current = setInterval(async () => {
        await simulateAlert();
      }, 3000);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      clearInterval(interval);
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🌊</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Chargement de Kpassonou...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
            Vérifiez que les services sont lancés :
            <br />
            <code className="text-red-600">FastAPI :8000</code> et <code className="text-red-600">Laravel :8001</code>
          </p>
          <button
            onClick={fetchData}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            🔄 Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-pulse">🌊</div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Kpassonou</h1>
                <p className="text-blue-100">Surveillance des inondations - Cotonou, Bénin</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Last Alert Notification */}
              {lastAlert && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg animate-pulse">
                  {lastAlert}
                </div>
              )}
              <div className="text-right">
                <p className="text-sm text-blue-100">Dernière mise à jour</p>
                <p className="font-medium">
                  {data?.summary.last_update
                    ? new Date(data.summary.last_update).toLocaleTimeString('fr-FR')
                    : '--:--'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleDemoMode}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    demoMode
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600 animate-pulse'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {demoMode ? '⏹️ Arrêter' : '▶️ Démo'}
                </button>
                <button
                  onClick={simulateAlert}
                  disabled={simulating}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {simulating ? '⏳' : '🔄'} Simuler
                </button>
                <button
                  onClick={simulateMultiple}
                  disabled={simulating}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {simulating ? '⏳' : '⚡'} x5
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg animate-pulse">
            <div className="flex items-center">
              <span className="text-yellow-600 text-xl mr-3">🎬</span>
              <div>
                <p className="font-medium text-yellow-800">Mode Démo Actif</p>
                <p className="text-sm text-yellow-600">Alertes simulées automatiquement toutes les 3 secondes</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📷</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Caméras actives</p>
                <p className="text-3xl font-bold text-blue-600">
                  {data?.summary.total_cameras || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Alertes actives</p>
                <p className="text-3xl font-bold text-red-600">
                  {data?.summary.active_alerts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">En attention</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {data?.alerts.filter(a => a.status === 'warning').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Zones sûres</p>
                <p className="text-3xl font-bold text-green-600">
                  {data?.alerts.filter(a => a.status === 'safe').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">📍 Carte des alertes</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Alerte
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Attention
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span> Sûr
              </span>
            </div>
          </div>
          {data && <Map alerts={data.alerts} />}
        </div>

        {/* Alerts List */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Alertes récentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.alerts.map((alert, index) => (
              <div
                key={alert.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AlertCard alert={alert} />
              </div>
            ))}
          </div>
          {(!data?.alerts || data.alerts.length === 0) && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🌤️</div>
              <p className="text-gray-500 text-lg">Aucune alerte pour le moment</p>
              <p className="text-gray-400 text-sm mt-2">Toutes les zones sont sûres</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">🌊 Kpassonou</p>
              <p className="text-sm text-gray-400">Hackathon Ibudo 2026 - Thème Climat/Inondations</p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <p>Edge AI • FastAPI • Laravel • Next.js</p>
              <p>Cotonou, Bénin 🇧🇯</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
