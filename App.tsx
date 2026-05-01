
import React, { useState, useEffect } from 'react';
import { FuelStation, FuelStatus, AppView, BusinessOwner } from './types';
import { INITIAL_STATIONS, Logo, THEME, ADMIN_EMAIL } from './constants';
import { UserSection } from './components/UserSection';
import { BusinessSection } from './components/BusinessSection';
import { RegistrationForm } from './components/RegistrationForm';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('user');
  const [stations, setStations] = useState<FuelStation[]>(INITIAL_STATIONS);
  const [loggedInOwner, setLoggedInOwner] = useState<BusinessOwner | null>(null);
  const [lastRegisteredOwner, setLastRegisteredOwner] = useState<BusinessOwner | null>(null);
  const [loginEmail, setLoginEmail] = useState('');

  // Efeito para detectar Login Automático via URL ou processar e-mail guardado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('login');
    
    if (emailParam) {
      handleDirectLogin(emailParam);
    }
  }, []);

  const handleDirectLogin = (email: string) => {
    const mockOwner: BusinessOwner = {
      fullName: "Proprietário",
      companyName: "Posto do Usuário",
      email: email,
      phone: "9XX XXX XXX",
      nif: "NIF-XXXX",
      biNumber: "BI-XXXX",
      neighborhood: "Centro"
    };
    setLoggedInOwner(mockOwner);
    setCurrentView('business');
    // Limpar URL
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.includes('@')) {
      handleDirectLogin(loginEmail);
    } else {
      alert("Por favor, insira um e-mail válido.");
    }
  };

  const handleUpdateStation = (stationId: string, gasoline: FuelStatus, diesel: FuelStatus) => {
    setStations(prev => prev.map(s => 
      s.id === stationId 
        ? { ...s, gasolineStatus: gasoline, dieselStatus: diesel, lastUpdated: new Date().toISOString() } 
        : s
    ));
  };

  const handleRegister = (data: BusinessOwner) => {
    setLastRegisteredOwner(data);
    setCurrentView('pending');
  };

  const LoginView = () => (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 text-center space-y-8">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-[#08677a]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-[#08677a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
             </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0c3a4a]">Acesso ao Painel</h2>
          <p className="text-gray-500 text-sm">Digite o seu e-mail registado para gerir o seu posto.</p>
        </div>

        <form onSubmit={handleManualLogin} className="space-y-4">
          <input 
            required
            type="email"
            placeholder="Seu e-mail (Ex: miguel@gmail.com)"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#08677a] outline-none text-center font-medium"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full bg-[#08677a] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-[#0c3a4a] transition-all"
          >
            ENTRAR AGORA
          </button>
        </form>

        <button 
          onClick={() => setCurrentView('user')}
          className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
        >
          Voltar para a Lista
        </button>
      </div>
    </div>
  );

  const PendingView = () => (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-gray-100 space-y-8">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-[#0c3a4a]">Pedido Enviado!</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Miguel Filipe recebeu os seus dados no WhatsApp e E-mail. <br/>
            Assim que ele validar, poderá entrar no painel.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl text-left border border-blue-100">
          <h4 className="font-bold text-[#08677a] mb-2">Como aceder depois:</h4>
          <p className="text-sm text-blue-900/70">
            Você não precisa do link para sempre. Basta abrir este site e clicar em <b>"Entrar"</b> no canto superior, usando o seu e-mail: <br/>
            <span className="font-black text-[#08677a] mt-2 block">{lastRegisteredOwner?.email}</span>
          </p>
        </div>

        <button 
          onClick={() => setCurrentView('user')}
          className="w-full bg-[#0c3a4a] text-white py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl"
        >
          VOLTAR PARA A LISTA
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('user')}>
          <Logo className="w-10 h-10" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-[#0c3a4a] leading-tight">FUEL CHECK</h1>
            <p className="text-[10px] font-bold text-[#22c55e] tracking-widest uppercase -mt-1">Soyo Digital</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loggedInOwner ? (
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-[#08677a] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Painel Ativo</span>
               <button onClick={() => setLoggedInOwner(null)} className="text-red-400 hover:text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </button>
            </div>
          ) : currentView === 'user' && (
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentView('login')}
                className="text-[#08677a] font-black text-xs px-4 py-2 hover:bg-teal-50 rounded-xl transition-all"
              >
                ENTRAR
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                className="bg-[#08677a] text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-teal-100 active:scale-95 transition-all"
              >
                REGISTAR
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-6 max-w-6xl">
        {currentView === 'user' && <UserSection stations={stations} />}
        {currentView === 'register' && <RegistrationForm onRegister={handleRegister} onCancel={() => setCurrentView('user')} />}
        {currentView === 'login' && <LoginView />}
        {currentView === 'pending' && <PendingView />}
        {currentView === 'business' && loggedInOwner && (
          <BusinessSection owner={loggedInOwner} stations={stations} onUpdateStation={handleUpdateStation} onLogout={() => setLoggedInOwner(null)} />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 sm:hidden pointer-events-none z-50">
        <div className="container mx-auto pointer-events-auto">
          {currentView === 'user' && !loggedInOwner && (
             <button 
                onClick={() => setCurrentView('register')}
                className="w-full bg-[#0c3a4a] text-white py-4 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                REGISTAR O MEU POSTO
             </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
