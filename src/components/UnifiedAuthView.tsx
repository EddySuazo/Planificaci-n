import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  School,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Award,
  ShieldCheck,
  Mail,
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Send,
  RefreshCw,
  Building,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { UserProfile, TeacherCensusRecord } from '../types';
import { normalizeCedula } from '../data/seedCensus';

interface UnifiedAuthViewProps {
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
  initialIdentifier?: string;
  initialMessage?: string | null;
}

export const UnifiedAuthView: React.FC<UnifiedAuthViewProps> = ({
  onSuccess,
  initialMode = 'login',
  initialIdentifier = '',
  initialMessage = null
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState(initialIdentifier);
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(initialMessage);

  // Forced Password Change state (when logging in with default password 'minerd2026')
  const [mustChangePasswordUser, setMustChangePasswordUser] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

  // Register form state
  const [regCedula, setRegCedula] = useState('');
  const [regSearching, setRegSearching] = useState(false);
  const [regSearchResult, setRegSearchResult] = useState<TeacherCensusRecord | null>(null);
  const [regSearchError, setRegSearchError] = useState<string | null>(null);
  const [regDocenteNombre, setRegDocenteNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCargoFuncion, setRegCargoFuncion] = useState('Profesor/a de Aula');
  const [regGrado, setRegGrado] = useState('4to de Primaria');
  const [regArea, setRegArea] = useState('Matemática');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Permission Request modal state
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permNombre, setPermNombre] = useState('');
  const [permEmail, setPermEmail] = useState('');
  const [permTelefono, setPermTelefono] = useState('');
  const [permMotivo, setPermMotivo] = useState('Docente del Centro Educativo Anacaona requiriendo acceso para planificaciones.');
  const [permLoading, setPermLoading] = useState(false);
  const [permSuccess, setPermSuccess] = useState<string | null>(null);
  const [permError, setPermError] = useState<string | null>(null);

  useEffect(() => {
    if (initialIdentifier) {
      setLoginIdentifier(initialIdentifier);
    }
  }, [initialIdentifier]);

  useEffect(() => {
    if (initialMessage) {
      setNotice(initialMessage);
    }
  }, [initialMessage]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Por favor ingrese su correo institucional, personal o cédula.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Por favor ingrese su contraseña de acceso.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await api.login(loginIdentifier.trim(), loginPassword);

      // Check if password used was the default password 'minerd2026'
      if (res.requiresPasswordChange || loginPassword === 'minerd2026') {
        setMustChangePasswordUser(res.user);
        return;
      }

      onSuccess(res.user);
    } catch (err: any) {
      setLoginError(err.message || 'Error al iniciar sesión. Compruebe sus credenciales.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Quick Login for Authorized Personnel
  const handleQuickLogin = async (cedula: string) => {
    setLoginLoading(true);
    setLoginError(null);
    setNotice(null);
    try {
      const res = await api.login(cedula, 'minerd2026');
      if (res.requiresPasswordChange) {
        setMustChangePasswordUser(res.user);
        return;
      }
      onSuccess(res.user);
    } catch (err: any) {
      setLoginError(err.message || 'Error en acceso rápido.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Forced Password Change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mustChangePasswordUser) return;

    if (!newPassword || newPassword.length < 6) {
      setChangePasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword.trim().toLowerCase() === 'minerd2026') {
      setChangePasswordError('No puede usar la contraseña por defecto (minerd2026). Elija una contraseña personal de su gusto.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('Las contraseñas no coinciden. Verifique e intente de nuevo.');
      return;
    }

    setChangePasswordLoading(true);
    setChangePasswordError(null);

    try {
      const res = await api.changePassword(mustChangePasswordUser.id, newPassword.trim());
      setMustChangePasswordUser(null);
      onSuccess(res.user);
    } catch (err: any) {
      setChangePasswordError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Format Cédula input as user types
  const handleCedulaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = normalizeCedula(e.target.value);
    setRegCedula(formatted);
    setRegSearchError(null);
  };

  // Search Cédula in Official Census
  const handleSearchCedula = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = regCedula.replace(/\D/g, '');
    if (cleanDigits.length !== 11) {
      setRegSearchError('La cédula dominicana debe contener exactamente 11 dígitos.');
      return;
    }

    setRegSearching(true);
    setRegSearchError(null);
    setRegSearchResult(null);

    try {
      const res = await api.lookupCedula(regCedula);
      if (res.found && res.data) {
        setRegSearchResult(res.data);
        const fullName = res.data.nombreCompleto || `${res.data.nombres} ${res.data.apellidos}`.trim();
        setRegDocenteNombre(fullName);
        setRegEmail(res.data.correoInstitucional || res.data.email || '');
        setRegCargoFuncion(
          res.data.cargoFuncion ||
          (res.data.cargo === 'Administrador de la Plataforma' ? 'Dinamizador/a TIC'
          : res.data.cargo === 'Director de Centro' ? 'Director de Centro'
          : res.data.cargo === 'Coordinador Pedagógico' ? 'Coordinador/a Pedagógico/a de Docencia'
          : 'Profesor/a de Aula')
        );
        if (res.data.grados && res.data.grados.length > 0) {
          setRegGrado(res.data.grados[0]);
        } else {
          setRegGrado('4to de Primaria');
        }
        if (res.data.areaPrincipal) {
          setRegArea(res.data.areaPrincipal);
        }
      } else {
        setRegSearchError(
          res.message ||
            'Esta cédula no figura en la base de datos oficial de la Escuela Primaria Anacaona (Código SIGERD 03498). Solo el personal oficial o autorizado por el administrador puede registrarse.'
        );
      }
    } catch (err: any) {
      setRegSearchError('Error de conexión al consultar el padrón de docentes. Intente de nuevo.');
    } finally {
      setRegSearching(false);
    }
  };

  // Complete Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regSearchResult) {
      setRegError('Debe verificar una cédula oficial primero.');
      return;
    }

    if (!regDocenteNombre.trim()) {
      setRegError('El nombre completo del docente es obligatorio.');
      return;
    }

    if (!regEmail.trim()) {
      setRegError('El correo institucional o personal es obligatorio.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }

    if (regPassword.trim().toLowerCase() === 'minerd2026') {
      setRegError('Por seguridad, no puede utilizar la contraseña por defecto (minerd2026). Cree una contraseña personal.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }

    setRegSubmitting(true);
    setRegError(null);

    try {
      const res = await api.register({
        cedula: regCedula,
        nombre: regDocenteNombre.split(' ')[0] || regSearchResult.nombres,
        apellidos: regDocenteNombre.split(' ').slice(1).join(' ') || regSearchResult.apellidos,
        email: regEmail.trim(),
        password: regPassword.trim(),
        rol: regSearchResult.cargo === 'Administrador de la Plataforma' ? 'administrador'
             : regSearchResult.cargo === 'Director de Centro' ? 'director'
             : regSearchResult.cargo === 'Coordinador Pedagógico' ? 'coordinador'
             : 'docente',
        cargoFuncion: regCargoFuncion,
        centroEducativoNombre: 'Escuela Primaria Anacaona',
        codigoSIGERD: '03498',
        regional: '02 - San Juan',
        distrito: '02-05 - San Juan Este',
        tanda: 'Jornada Escolar Extendida',
        nivelAsignado: regSearchResult.nivel || 'Primario',
        cicloAsignado: regSearchResult.ciclo || 'Segundo Ciclo',
        gradosAsignados: [regGrado],
        areasAsignadas: [regArea]
      });

      // Switch to login tab with prefill and success notice
      setNotice(`¡Registro exitoso para ${regDocenteNombre}! Su cuenta oficial ha sido activada en PlanificaRD. Puede acceder inmediatamente con su contraseña creada.`);
      setLoginIdentifier(regCedula);
      setMode('login');
      setRegSearchResult(null);
      setRegCedula('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err: any) {
      setRegError(err.message || 'Error al completar el registro.');
    } finally {
      setRegSubmitting(false);
    }
  };

  // Submit Permission Request to Eddy Margeris Suazo Zabala
  const handlePermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permNombre.trim()) {
      setPermError('Por favor ingrese su nombre completo.');
      return;
    }

    setPermLoading(true);
    setPermError(null);
    setPermSuccess(null);

    try {
      const res = await fetch('/api/auth/request-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: regCedula,
          nombres: permNombre,
          apellidos: '',
          email: permEmail,
          telefono: permTelefono,
          motivo: permMotivo,
          cargoSolicitado: 'Docente',
          areaSugerida: regArea
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar solicitud');
      }

      setPermSuccess('¡Solicitud enviada satisfactoriamente! El Administrador Eddy Margeris Suazo Zabala ha recibido su petición.');
      setTimeout(() => {
        setShowPermissionModal(false);
        setPermSuccess(null);
      }, 3500);
    } catch (err: any) {
      setPermError(err.message || 'Error al procesar solicitud');
    } finally {
      setPermLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* Top Navigation Header */}
      <header className="w-full border-b border-slate-800/80 bg-[#0B132B]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700/40 border border-blue-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-blue-900/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-white flex items-center">
                <span>Planifica</span>
                <span className="text-amber-400">RD</span>
              </div>
              <p className="text-[10px] tracking-wider font-semibold text-slate-300 uppercase">
                PLATAFORMA INTELIGENTE DE PLANIFICACIÓN DOCENTE MINERD
              </p>
            </div>
          </div>

          {/* School Badge */}
          <div className="hidden sm:flex items-center space-x-2.5 bg-[#131D38] border border-slate-700/70 rounded-xl px-3.5 py-2 shadow-sm">
            <School className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Escuela Primaria Anacaona</p>
              <p className="text-[10px] text-slate-400 leading-tight">Regional 02 (San Juan) · Distrito 02-05 (San Juan Este)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero & Card Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162947] border border-blue-500/30 text-xs font-semibold text-amber-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Acceso Oficial MINERD 2026-2027</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white leading-[1.15] tracking-tight">
              Planifica mejor, enseña con propósito y{' '}
              <span className="text-amber-400">transforma los</span>{' '}
              aprendizajes.
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Plataforma digital para docentes de la República Dominicana. Genera, personaliza y gestiona tus planificaciones alineadas con la Adecuación Curricular y las Secuencias Didácticas Oficiales.
            </p>

            {/* 4 Feature Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-xl">
              <div className="bg-[#131D38]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  10 Tipos de Planificación Curricular MINERD
                </span>
              </div>

              <div className="bg-[#131D38]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Secuencias Didácticas por Asignatura
                </span>
              </div>

              <div className="bg-[#131D38]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Descarga en Word (.docx) y PDF con Sellos
                </span>
              </div>

              <div className="bg-[#131D38]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Base de Datos de Docentes Registrados
                </span>
              </div>
            </div>

            {/* Author Credit */}
            <p className="text-xs text-slate-400 italic pt-2">
              Administrador y Diseñador Pedagógico:{' '}
              <strong className="text-white font-semibold not-italic">
                Lic. Eddy Margeris Suazo Zabala
              </strong>
              , Dinamizador Tic.
            </p>
          </div>

          {/* Right Card Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-800 border border-slate-100 transition-all">
              {/* Header with Title and Pill Toggle */}
              <div className="flex items-start justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-[#002B49] tracking-tight">
                    {mode === 'login' ? 'Acceso para Docentes' : 'Registro de Docente'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === 'login'
                      ? 'Ingrese con su correo registrado o de prueba.'
                      : 'Verifique su cédula en la nómina oficial.'}
                  </p>
                </div>

                {/* Pill Switcher [Ingresar | Registrar] */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/80 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLoginError(null);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                      mode === 'login'
                        ? 'bg-[#1e3a8a] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ingresar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegError(null);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                      mode === 'register'
                        ? 'bg-[#1e3a8a] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Registrar
                  </button>
                </div>
              </div>

              {/* Notification Banner */}
              {notice && (
                <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg flex items-start text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Notificación</span>
                    <span>{notice}</span>
                  </div>
                </div>
              )}

              {/* Error Banners */}
              {(loginError || regError) && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-[#CE1126] rounded-r-lg flex items-start text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-[#CE1126] mr-2 flex-shrink-0 mt-0.5" />
                  <span>{loginError || regError}</span>
                </div>
              )}

              {/* ================= MODE: INGRESAR ================= */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Correo Institucional o Personal <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        placeholder="ej: EDDYSUAZO@gmail.com o eddy.suazo@minerd.gob.do"
                        required
                        className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 pr-10 text-xs sm:text-sm font-medium focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none transition"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Admite correos institucionales (@minerd.gob.do), personales (@gmail.com) o cédula con guiones.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 pr-10 text-sm focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showLoginPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-[#172554] shadow-md shadow-blue-900/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Validando credenciales...</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Iniciar Sesión</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-xs font-semibold text-[#1e3a8a] hover:underline"
                    >
                      ¿No estás registrado? Regístrate como Nuevo Docente
                    </button>
                  </div>
                </form>
              )}

              {/* ================= MODE: REGISTRAR ================= */}
              {mode === 'register' && (
                <div className="space-y-4">
                  {/* Step 1: Cédula Lookup */}
                  {!regSearchResult ? (
                    <form onSubmit={handleSearchCedula} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Cédula de Identidad y Electoral <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={regCedula}
                            onChange={handleCedulaInputChange}
                            placeholder="012-0089330-1"
                            maxLength={13}
                            required
                            className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 pr-10 text-sm font-mono tracking-wider focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none transition"
                          />
                          <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Formato: 11 dígitos con guiones (ejemplo: 012-0089330-1).
                        </p>
                      </div>

                      {regSearchError && (
                        <div className="p-3 bg-amber-50 border-l-4 border-amber-600 rounded-r-lg text-amber-900 text-xs space-y-2">
                          <p className="font-semibold">{regSearchError}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setPermNombre('');
                              setPermEmail('');
                              setShowPermissionModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Solicitar Permiso al Administrador Eddy Suazo</span>
                          </button>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={regSearching}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-[#172554] shadow-md shadow-blue-900/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {regSearching ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Consultando nómina oficial...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verificar Cédula en Nómina</span>
                          </>
                        )}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="text-xs font-semibold text-[#1e3a8a] hover:underline"
                        >
                          ¿Ya tienes cuenta activa? Iniciar Sesión
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Step 2: Cédula Found - Complete User Data & Password */
                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-900 leading-tight">
                          <span className="font-bold block">✓ Docente Encontrado en Base de Datos Oficial</span>
                          <span className="text-[11px] text-emerald-700">
                            Cédula: <strong>{regSearchResult.cedula}</strong> • Nómina: {regSearchResult.cargoNomina || 'MINERD'}
                          </span>
                        </div>
                      </div>

                      {/* 1. Docente (Nombre Completo) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Docente (Nombre Completo) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={regDocenteNombre}
                            onChange={e => setRegDocenteNombre(e.target.value)}
                            required
                            placeholder="Nombre y Apellidos completos"
                            className="w-full rounded-xl border border-slate-300 py-2 px-3 pr-8 text-xs font-semibold text-slate-900 focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none"
                          />
                          <User className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* 2. Correo Institucional o Personal */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Correo Institucional o Personal <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={regEmail}
                            onChange={e => setRegEmail(e.target.value)}
                            required
                            placeholder="ej: docente@docente.edu.do o correo@gmail.com"
                            className="w-full rounded-xl border border-slate-300 py-2 px-3 pr-8 text-xs font-medium text-slate-900 focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Admite correo institucional (@docente.edu.do) o personal (@gmail.com, etc.).
                        </p>
                      </div>

                      {/* 3. Cargo en Función & 4. Grado Asignado */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Cargo en Función <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={regCargoFuncion}
                            onChange={e => setRegCargoFuncion(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 py-2 px-2.5 text-xs font-medium text-slate-900 focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none bg-white"
                          >
                            <option value="Profesor/a de Aula">Profesor/a de Aula</option>
                            <option value="Dinamizador/a TIC">Dinamizador/a TIC</option>
                            <option value="Director de Centro">Director de Centro</option>
                            <option value="Subdirector/a">Subdirector/a</option>
                            <option value="Coordinador/a Pedagógico/a de Docencia">Coordinador/a Pedagógico/a</option>
                            <option value="Coordinador/a de Registro y Control Académico">Coordinador/a de Registro</option>
                            <option value="Orientador/a Escolar">Orientador/a Escolar</option>
                            <option value="Psicólogo/a Escolar">Psicólogo/a Escolar</option>
                            <option value="Encargado/a de Biblioteca">Encargado/a de Biblioteca</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Grado Asignado <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={regGrado}
                            onChange={e => setRegGrado(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 py-2 px-2.5 text-xs font-medium text-slate-900 focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none bg-white"
                          >
                            <option value="1ro de Primaria">1ro de Primaria</option>
                            <option value="2do de Primaria">2do de Primaria</option>
                            <option value="3ro de Primaria">3ro de Primaria</option>
                            <option value="4to de Primaria">4to de Primaria</option>
                            <option value="5to de Primaria">5to de Primaria</option>
                            <option value="6to de Primaria">6to de Primaria</option>
                            <option value="Pre-Primario">Pre-Primario (Nivel Inicial)</option>
                            <option value="Kínder">Kínder (Nivel Inicial)</option>
                          </select>
                        </div>
                      </div>

                      {/* 5. Centro Educativo Automático */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Centro Educativo Automático
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value="Escuela Primaria Anacaona (Código SIGERD 03498)"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 pr-8 text-xs font-semibold text-slate-700 outline-none cursor-not-allowed"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Regional 02 (San Juan) • Distrito 02-05 (San Juan Este) • Jornada Escolar Extendida
                        </p>
                      </div>

                      {/* 6. Contraseña de Acceso y Confirmación */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Contraseña de Acceso <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showRegPassword ? 'text' : 'password'}
                              value={regPassword}
                              onChange={e => setRegPassword(e.target.value)}
                              placeholder="Mín. 6 caracteres"
                              required
                              className="w-full rounded-xl border border-slate-300 py-2 px-3 pr-8 text-xs focus:border-[#002B49] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                            >
                              {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Confirmar Contraseña <span className="text-red-500">*</span>
                          </label>
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            value={regConfirmPassword}
                            onChange={e => setRegConfirmPassword(e.target.value)}
                            placeholder="Repita contraseña"
                            required
                            className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-[#002B49] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setRegSearchResult(null)}
                          className="py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Cambiar Cédula
                        </button>
                        <button
                          type="submit"
                          disabled={regSubmitting}
                          className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#1e3a8a] hover:bg-[#172554] shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {regSubmitting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Registrando...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Activar Cuenta y Acceder</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Personal Autorizado: SOLO Eddy Suazo y José Milquiades */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                  Personal Autorizado (Acceso Rápido 1-Clic):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* 1. Eddy Suazo */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('012-0089330-1')}
                    disabled={loginLoading}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition group"
                  >
                    <span className="font-bold text-[#002B49] block truncate text-xs group-hover:text-amber-800">
                      Eddy Suazo
                    </span>
                    <span className="text-[10px] text-amber-700 block font-semibold">Administrador / TIC</span>
                    <span className="text-[9px] text-slate-400 font-mono block">012-0089330-1</span>
                  </button>

                  {/* 2. José Milquiades Peña */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('108-0006464-3')}
                    disabled={loginLoading}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition group"
                  >
                    <span className="font-bold text-[#002B49] block truncate text-xs group-hover:text-emerald-800">
                      José Milquiades Peña
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Director de Centro</span>
                    <span className="text-[9px] text-slate-400 font-mono block">108-0006464-3</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#070D1F] py-5 px-4 text-center text-xs text-slate-400">
        <p className="max-w-7xl mx-auto">
          © 2026 PlanificaRD · Sistema de Gestión Curricular MINERD - Escuela Primaria Anacaona (Regional 02, Distrito 02-05)
        </p>
      </footer>

      {/* ================= MODAL: CAMBIO OBLIGATORIO DE CONTRASEÑA ================= */}
      {mustChangePasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-[#002B49]">
              Cambio Obligatorio de Contraseña
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              Estimado/a <strong>{mustChangePasswordUser.nombre} {mustChangePasswordUser.apellidos}</strong>: ha ingresado con la contraseña asignada por defecto (<strong>minerd2026</strong>). Por políticas de seguridad institucional del MINERD, debe establecer una contraseña personal de su gusto para continuar.
            </p>

            {changePasswordError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-[#CE1126] rounded-r-lg flex items-start text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-[#CE1126] mr-2 flex-shrink-0 mt-0.5" />
                <span>{changePasswordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nueva Contraseña Personal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 pr-10 text-sm focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Confirmar Nueva Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita su nueva contraseña"
                  required
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                • La contraseña no puede ser &ldquo;minerd2026&rdquo;.
                <br />• Esta será su clave privada para ingresar en sus próximas sesiones.
              </div>

              <button
                type="submit"
                disabled={changePasswordLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-[#172554] shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {changePasswordLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardando contraseña...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar y Acceder a PlanificaRD</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SOLICITUD DE PERMISO AL ADMINISTRADOR ================= */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-900 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002B49]">
                    Solicitud de Acceso Oficial
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Destinatario: Eddy Margeris Suazo Zabala (Administrador)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPermissionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {permSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">{permSuccess}</p>
                <p className="text-slate-500">
                  El administrador revisará y autorizará su cédula en el panel de gestión.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePermissionSubmit} className="space-y-3.5">
                {permError && (
                  <div className="p-2.5 bg-red-50 border-l-4 border-[#CE1126] text-red-800 text-xs">
                    {permError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Cédula a Autorizar
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={regCedula}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-mono font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={permNombre}
                    onChange={e => setPermNombre(e.target.value)}
                    placeholder="Ej. Carmen Luisa Ramírez Méndez"
                    required
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold focus:border-[#002B49] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={permEmail}
                      onChange={e => setPermEmail(e.target.value)}
                      placeholder="docente@ejemplo.com"
                      className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-[#002B49] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={permTelefono}
                      onChange={e => setPermTelefono(e.target.value)}
                      placeholder="809-000-0000"
                      className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-[#002B49] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Motivo o Área Asignada
                  </label>
                  <textarea
                    rows={2}
                    value={permMotivo}
                    onChange={e => setPermMotivo(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-[#002B49] outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPermissionModal(false)}
                    className="py-2 px-3.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={permLoading}
                    className="py-2 px-4 rounded-xl font-bold text-xs text-white bg-[#1e3a8a] hover:bg-[#172554] shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {permLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Solicitud al Administrador</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
