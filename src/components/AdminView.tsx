import React, { useState, useEffect } from 'react';
import {
  Settings, Users, ShieldAlert, History, Database, BookOpen,
  CheckCircle2, AlertTriangle, Key, Search, RefreshCw, UserPlus,
  ShieldCheck, XCircle, Clock, Check, Mail, Phone, School, Sparkles,
  Trash2, Edit3, Lock, UserX, Save, X
} from 'lucide-react';
import { UserProfile, AuditLog, OfficialCurriculumSequence, PermissionRequest } from '../types';
import { api } from '../services/api';
import { normalizeCedula } from '../data/seedCensus';

interface AdminViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  sequences: OfficialCurriculumSequence[];
  onRefreshUsers: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  allUsers,
  sequences,
  onRefreshUsers
}) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [permissionRequests, setPermissionRequests] = useState<PermissionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'usuarios' | 'permisos' | 'curriculo' | 'auditoria'>('usuarios');
  const [searchUser, setSearchUser] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // User management modals state
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<{
    nombre: string;
    apellidos: string;
    email: string;
    cargo: string;
    rol: 'administrador' | 'director' | 'coordinador' | 'docente';
    areaPrincipal: string;
    gradosAsignados: string[];
    nuevaContrasena: string;
  }>({
    nombre: '',
    apellidos: '',
    email: '',
    cargo: '',
    rol: 'docente',
    areaPrincipal: '',
    gradosAsignados: [],
    nuevaContrasena: ''
  });

  // Form state for manual quick authorization
  const [newAuthCedula, setNewAuthCedula] = useState('');
  const [newAuthNombres, setNewAuthNombres] = useState('');
  const [newAuthApellidos, setNewAuthApellidos] = useState('');
  const [newAuthCargo, setNewAuthCargo] = useState('Profesor/a de Aula');
  const [newAuthArea, setNewAuthArea] = useState('Matemática');
  const [newAuthGrado, setNewAuthGrado] = useState('6to de Primaria');

  const fetchPermissionsAndLogs = async () => {
    try {
      const [logs, reqs] = await Promise.all([
        api.getAuditLogs(),
        api.getPermissionRequests()
      ]);
      setAuditLogs(logs);
      setPermissionRequests(reqs);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    }
  };

  useEffect(() => {
    fetchPermissionsAndLogs();
  }, []);

  const pendingRequestsCount = permissionRequests.filter(r => r.estado === 'Pendiente').length;

  const openEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setEditForm({
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      cargo: u.cargo,
      rol: u.rol,
      areaPrincipal: u.areaPrincipal || 'Matemática',
      gradosAsignados: u.gradosAsignados || ['6to de Primaria'],
      nuevaContrasena: ''
    });
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoadingAction('edit-user');
    setActionMessage(null);
    try {
      const res = await api.updateUser(editingUser.id, {
        ...editForm,
        adminId: currentUser.id,
        adminNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        adminRol: currentUser.rol
      });
      setActionMessage({
        text: res.message || `Usuario ${editForm.nombre} ${editForm.apellidos} actualizado exitosamente.`,
        type: 'success'
      });
      setEditingUser(null);
      onRefreshUsers();
      await fetchPermissionsAndLogs();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error al actualizar usuario', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    setLoadingAction('delete-user');
    setActionMessage(null);
    try {
      const res = await api.deleteUser(deletingUser.id, {
        adminId: currentUser.id,
        adminNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        adminRol: currentUser.rol
      });
      setActionMessage({
        text: res.message || `Participante eliminado correctamente.`,
        type: 'success'
      });
      setDeletingUser(null);
      onRefreshUsers();
      await fetchPermissionsAndLogs();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error al eliminar participante', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveRequest = async (req: PermissionRequest) => {
    setLoadingAction(req.id);
    setActionMessage(null);
    try {
      await api.authorizeCedula({
        requestId: req.id,
        cedula: req.cedula,
        nombres: req.nombres,
        apellidos: req.apellidos,
        correoInstitucional: req.email,
        cargo: req.cargoSolicitado,
        areaPrincipal: req.areaSugerida,
        grados: ['4to de Primaria', '5to de Primaria', '6to de Primaria'],
        adminNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        adminId: currentUser.id
      });

      setActionMessage({
        text: `¡Permiso concedido para ${req.nombres} ${req.apellidos} (${req.cedula})! Ahora puede registrarse y crear su contraseña.`,
        type: 'success'
      });
      await fetchPermissionsAndLogs();
      onRefreshUsers();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error al aprobar solicitud', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectRequest = async (req: PermissionRequest) => {
    setLoadingAction(req.id);
    setActionMessage(null);
    try {
      await api.rejectPermission({
        requestId: req.id,
        adminNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        adminId: currentUser.id
      });
      setActionMessage({
        text: `Solicitud de cédula ${req.cedula} ha sido rechazada.`,
        type: 'success'
      });
      await fetchPermissionsAndLogs();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error al rechazar solicitud', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleManualAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthCedula.trim() || !newAuthNombres.trim()) {
      setActionMessage({ text: 'Por favor complete la cédula y el nombre.', type: 'error' });
      return;
    }

    setLoadingAction('manual');
    setActionMessage(null);
    try {
      await api.authorizeCedula({
        cedula: normalizeCedula(newAuthCedula.trim()),
        nombres: newAuthNombres.trim(),
        apellidos: newAuthApellidos.trim(),
        cargo: newAuthCargo,
        areaPrincipal: newAuthArea,
        grados: [newAuthGrado],
        adminNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        adminId: currentUser.id
      });

      setActionMessage({
        text: `¡Cédula ${newAuthCedula} autorizada con éxito! El docente ya puede registrarse.`,
        type: 'success'
      });
      setNewAuthCedula('');
      setNewAuthNombres('');
      setNewAuthApellidos('');
      await fetchPermissionsAndLogs();
      onRefreshUsers();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error al autorizar cédula', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  const filteredUsers = allUsers.filter(u => {
    if (!searchUser) return true;
    const q = searchUser.toLowerCase();
    return u.nombre.toLowerCase().includes(q) ||
           u.apellidos.toLowerCase().includes(q) ||
           u.cedula.includes(q) ||
           u.email.toLowerCase().includes(q) ||
           u.rol.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
            <Settings className="w-4 h-4 text-amber-700" />
            <span>Consola de Super Administración y Dirección MINERD</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {currentUser.rol === 'director' ? 'Lic. Jose Milquiades Peña Ogando • Dirección General' : 'Lic. Eddy Margeris Suazo Zabala • Super Administrador General'}
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl">
            Centro Educativo Anacaona (Código SIGERD 03498) • Distrito 02-05 San Juan Este • Regional 02 San Juan. Acceso total: Crear, editar, guardar y eliminar planificaciones y participantes del sistema.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {pendingRequestsCount > 0 && (
            <span className="px-3 py-1.5 bg-red-100 text-red-800 border border-red-300 rounded-xl text-xs font-bold animate-pulse flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-red-600" />
              {pendingRequestsCount} solicitud{pendingRequestsCount > 1 ? 'es' : ''} pendiente{pendingRequestsCount > 1 ? 's' : ''}
            </span>
          )}
          <span className="px-3.5 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold">
            Super Administrador MINERD
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-xl border flex items-start text-xs font-semibold ${
          actionMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`pb-3 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'usuarios'
              ? 'border-b-2 border-[#002B49] text-[#002B49] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Personal Registrado ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('permisos')}
          className={`pb-3 transition flex items-center space-x-1.5 whitespace-nowrap relative ${
            activeTab === 'permisos'
              ? 'border-b-2 border-[#002B49] text-[#002B49] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Solicitudes y Permisos de Cédulas</span>
          {pendingRequestsCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('curriculo')}
          className={`pb-3 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'curriculo'
              ? 'border-b-2 border-[#002B49] text-[#002B49] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogo Curricular ({sequences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`pb-3 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'auditoria'
              ? 'border-b-2 border-[#002B49] text-[#002B49] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Auditoría de Seguridad ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                placeholder="Buscar por cédula, nombre o correo..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={onRefreshUsers}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualizar Lista</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Cédula</th>
                  <th className="p-3">Nombre Completo</th>
                  <th className="p-3">Correo Institucional / Personal</th>
                  <th className="p-3">Centro Educativo</th>
                  <th className="p-3">Rol del Sistema</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => {
                  const isSuperUser =
                    u.cedula.replace(/\D/g, '') === '01200567891' || // Eddy Margeris Suazo
                    u.cedula.replace(/\D/g, '') === '01200123456';   // Jose Milquiades Peña Ogando
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-900">{u.cedula}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        {u.nombre} {u.apellidos}
                        {isSuperUser && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-extrabold rounded uppercase">
                            Acceso Total
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{u.email}</td>
                      <td className="p-3 text-slate-700">{u.centroEducativoNombre}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          u.rol === 'administrador' ? 'bg-amber-100 text-amber-900' :
                          u.rol === 'director' ? 'bg-emerald-100 text-emerald-900' :
                          u.rol === 'coordinador' ? 'bg-purple-100 text-purple-900' :
                          'bg-blue-100 text-blue-900'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Activo
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                            title="Editar datos, rol o contraseña del participante"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {isSuperUser ? (
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded" title="Cuenta principal protegida">
                              Protegido
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeletingUser(u)}
                              className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
                              title="Eliminar participante del sistema"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PERMISSION REQUESTS & CÉDULA AUTHORIZATION */}
      {activeTab === 'permisos' && (
        <div className="space-y-6">
          {/* Institutional Policy Banner */}
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start text-xs text-sky-950">
            <ShieldCheck className="w-5 h-5 text-[#002B49] mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#002B49] text-sm">
                Control de Registro y Aprobación Exclusiva por el Administrador
              </p>
              <p className="mt-1 text-sky-900 leading-relaxed">
                De acuerdo con la directriz del MINERD: <em>si una cédula no existe en la base de datos oficial, el usuario no se podrá registrar a menos que usted (Eddy Margeris Suazo Zabala) le conceda permiso de acceso expreso</em>. Al aprobar una solicitud o agregar una cédula manualmente, el docente queda inmediatamente habilitado para ingresar y registrar su contraseña.
              </p>
            </div>
          </div>

          {/* Pending & Historical Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                  <span>Solicitudes de Permiso Recibidas</span>
                  {pendingRequestsCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 text-xs rounded-full font-bold">
                      {pendingRequestsCount} por revisar
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  Docentes y personal que han solicitado acceso formal a la plataforma PlanificaRD
                </p>
              </div>

              <button
                onClick={fetchPermissionsAndLogs}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
            </div>

            {permissionRequests.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No hay solicitudes de permiso pendientes en este momento.
              </div>
            ) : (
              <div className="space-y-3">
                {permissionRequests.map(req => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-xl border text-xs transition ${
                      req.estado === 'Pendiente'
                        ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                        : req.estado === 'Aprobado'
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-[#002B49] bg-white px-2 py-0.5 rounded border border-slate-200">
                          {req.cedula}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {req.nombres} {req.apellidos}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          req.estado === 'Pendiente'
                            ? 'bg-amber-200 text-amber-900'
                            : req.estado === 'Aprobado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {req.estado}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {new Date(req.fechaSolicitud).toLocaleDateString('es-DO')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-700 mb-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Cargo Solicitado:</span>
                        <span className="font-semibold text-slate-900">{req.cargoSolicitado}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Área Sugerida:</span>
                        <span className="font-semibold text-slate-900">{req.areaSugerida}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Contacto:</span>
                        <span className="font-mono text-[11px] text-slate-800">{req.email} • {req.telefono || 'Sin teléfono'}</span>
                      </div>
                      <div className="md:col-span-3 bg-white/70 p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Motivo de la Solicitud:</span>
                        <p className="text-slate-800 italic mt-0.5">{req.motivo}</p>
                      </div>
                    </div>

                    {req.estado === 'Pendiente' && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          disabled={loadingAction === req.id}
                          onClick={() => handleRejectRequest(req)}
                          className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold transition"
                        >
                          Rechazar
                        </button>
                        <button
                          type="button"
                          disabled={loadingAction === req.id}
                          onClick={() => handleApproveRequest(req)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center shadow-xs"
                        >
                          {loadingAction === req.id ? (
                            'Aprobando...'
                          ) : (
                            <span className="flex items-center">
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Aprobar y Conceder Permiso
                            </span>
                          )}
                        </button>
                      </div>
                    )}

                    {req.revisadoPor && (
                      <div className="mt-2 text-[10px] text-slate-500 text-right">
                        Revisado por: <strong>{req.revisadoPor}</strong> el {new Date(req.fechaRevision || '').toLocaleString('es-DO')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Direct Whitelist / Manual Authorization Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <UserPlus className="w-4 h-4 text-[#002B49] mr-1.5" />
                <span>Autorizar Cédula Directamente (Whitelist Manual)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Como Administrador, puede autorizar de forma inmediata cualquier cédula nueva para que el docente pueda registrarse sin pasar por solicitud previa.
              </p>
            </div>

            <form onSubmit={handleManualAuthorize} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Cédula Dominicana <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAuthCedula}
                    onChange={e => setNewAuthCedula(e.target.value)}
                    placeholder="001-0847291-3"
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono text-xs focus:border-[#002B49] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Nombres del Docente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAuthNombres}
                    onChange={e => setNewAuthNombres(e.target.value)}
                    placeholder="Ej. Roberto Carlos"
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#002B49] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAuthApellidos}
                    onChange={e => setNewAuthApellidos(e.target.value)}
                    placeholder="Ej. Castillo Encarnación"
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#002B49] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Cargo en el Centro
                  </label>
                  <select
                    value={newAuthCargo}
                    onChange={e => setNewAuthCargo(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white focus:border-[#002B49] outline-none"
                  >
                    <option value="Profesor/a de Aula">Profesor/a de Aula</option>
                    <option value="Coordinador/a Pedagógico">Coordinador/a Pedagógico</option>
                    <option value="Director/a de Centro">Director/a de Centro</option>
                    <option value="Orientador/a Escolar">Orientador/a Escolar</option>
                    <option value="Psicólogo/a Escolar">Psicólogo/a Escolar</option>
                    <option value="Encargado/a de Biblioteca">Encargado/a de Biblioteca</option>
                    <option value="Dinamizador/a TIC">Dinamizador/a TIC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Área Curricular
                  </label>
                  <select
                    value={newAuthArea}
                    onChange={e => setNewAuthArea(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white focus:border-[#002B49] outline-none"
                  >
                    <option value="Matemática">Matemática</option>
                    <option value="Lengua Española">Lengua Española</option>
                    <option value="Ciencias de la Naturaleza">Ciencias de la Naturaleza</option>
                    <option value="Ciencias Sociales">Ciencias Sociales</option>
                    <option value="Educación Artística">Educación Artística</option>
                    <option value="Educación Física">Educación Física</option>
                    <option value="Formación Integral Humana y Religiosa">Formación Integral Humana y Religiosa</option>
                    <option value="Lenguas Extranjeras">Lenguas Extranjeras</option>
                    <option value="Nivel Inicial">Nivel Inicial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Grado Asignado
                  </label>
                  <select
                    value={newAuthGrado}
                    onChange={e => setNewAuthGrado(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white focus:border-[#002B49] outline-none"
                  >
                    <option value="4to de Primaria">4to de Primaria</option>
                    <option value="5to de Primaria">5to de Primaria</option>
                    <option value="6to de Primaria">6to de Primaria</option>
                    <option value="3ro de Primaria">3ro de Primaria</option>
                    <option value="2do de Primaria">2do de Primaria</option>
                    <option value="1ro de Primaria">1ro de Primaria</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loadingAction === 'manual'}
                  className="px-5 py-2.5 bg-[#002B49] hover:bg-[#003860] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  {loadingAction === 'manual' ? 'Autorizando Cédula...' : 'Autorizar Cédula Inmediatamente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULAR CATALOG */}
      {activeTab === 'curriculo' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Catálogo de Secuencias Oficiales Aprobadas</h3>
              <p className="text-xs text-slate-500">Documentos verificados por la Dirección General de Currículo</p>
            </div>
          </div>

          <div className="space-y-3">
            {sequences.map(s => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{s.titulo}</span>
                  <span className="font-mono text-slate-500 text-[10px]">{s.codigoOficial}</span>
                </div>
                <p className="text-slate-600">
                  {s.grado} • {s.area} • Año: {s.anoEscolar} • {s.fuenteOficial}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'auditoria' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registro de Actividad y Auditoría de Seguridad</h3>
              <p className="text-xs text-slate-500">Trazabilidad de operaciones, accesos y modificaciones en la plataforma</p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">
                      {log.accion}
                    </span>
                    <span className="font-semibold text-slate-800">{log.userNombre} ({log.userRol})</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.detalles}</p>
                </div>
                <span className="text-slate-400 font-mono text-[10px] whitespace-nowrap self-end sm:self-center">
                  {new Date(log.timestamp).toLocaleString('es-DO')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PARTICIPANTE */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-[#002B49] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-amber-300" />
                  <span>Editar Participante Oficial</span>
                </h3>
                <p className="text-xs text-blue-100 font-mono">
                  Cédula: {editingUser.cedula}
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={editForm.nombre}
                    onChange={e => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={editForm.apellidos}
                    onChange={e => setEditForm(prev => ({ ...prev, apellidos: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Institucional o Personal *</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo Oficial *</label>
                  <input
                    type="text"
                    required
                    value={editForm.cargo}
                    onChange={e => setEditForm(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rol en Plataforma *</label>
                  <select
                    value={editForm.rol}
                    onChange={e => setEditForm(prev => ({ ...prev, rol: e.target.value as any }))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium bg-white"
                  >
                    <option value="docente">Docente</option>
                    <option value="coordinador">Coordinador Pedagógico</option>
                    <option value="director">Director</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Área Curricular</label>
                  <select
                    value={editForm.areaPrincipal}
                    onChange={e => setEditForm(prev => ({ ...prev, areaPrincipal: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium bg-white"
                  >
                    <option value="Matemática">Matemática</option>
                    <option value="Lengua Española">Lengua Española</option>
                    <option value="Ciencias de la Naturaleza">Ciencias de la Naturaleza</option>
                    <option value="Ciencias Sociales">Ciencias Sociales</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Tecnología Educativa">Tecnología Educativa</option>
                    <option value="Educación Artística">Educación Artística</option>
                    <option value="Educación Física">Educación Física</option>
                    <option value="Formación Integral Humana y Religiosa">Formación Integral Humana y Religiosa</option>
                    <option value="Nivel Inicial">Nivel Inicial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grado Principal</label>
                  <select
                    value={editForm.gradosAsignados[0] || '6to de Primaria'}
                    onChange={e => setEditForm(prev => ({ ...prev, gradosAsignados: [e.target.value] }))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium bg-white"
                  >
                    <option value="Maternal (Inicial)">Maternal (Inicial)</option>
                    <option value="Kínder (Inicial)">Kínder (Inicial)</option>
                    <option value="Pre-Primario (Inicial)">Pre-Primario (Inicial)</option>
                    <option value="1er Grado Primaria">1er Grado Primaria</option>
                    <option value="2do Grado Primaria">2do Grado Primaria</option>
                    <option value="3er Grado Primaria">3er Grado Primaria</option>
                    <option value="4to de Primaria">4to de Primaria</option>
                    <option value="5to de Primaria">5to de Primaria</option>
                    <option value="6to de Primaria">6to de Primaria</option>
                  </select>
                </div>
              </div>

              {/* Password reset option */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Restablecer Contraseña (Opcional)</span>
                </label>
                <input
                  type="password"
                  placeholder="Dejar en blanco para conservar la actual"
                  value={editForm.nuevaContrasena}
                  onChange={e => setEditForm(prev => ({ ...prev, nuevaContrasena: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-xs"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Mínimo 6 caracteres si desea forzar un cambio de contraseña para este participante.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === 'edit-user'}
                  className="px-4 py-2 bg-[#002B49] text-white rounded-lg font-bold hover:bg-[#003860] flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{loadingAction === 'edit-user' ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR ELIMINACIÓN DE PARTICIPANTE */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-200 overflow-hidden animate-in fade-in">
            <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-200" />
                <span>Confirmar Eliminación de Participante</span>
              </h3>
              <button
                onClick={() => setDeletingUser(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-sm text-slate-800">
                ¿Está completamente seguro de eliminar a este docente / participante del sistema?
              </p>

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                <p className="font-bold text-red-950 text-sm">
                  {deletingUser.nombre} {deletingUser.apellidos}
                </p>
                <p className="font-mono text-xs text-red-800">
                  Cédula: {deletingUser.cedula}
                </p>
                <p className="text-xs text-red-700">
                  Cargo: {deletingUser.cargo} • Rol: <strong className="uppercase">{deletingUser.rol}</strong>
                </p>
              </div>

              <p className="text-slate-500 italic">
                Nota: Esta acción es irreversible. Se registrará en la auditoría de seguridad del MINERD bajo la firma de{' '}
                <strong>{currentUser.nombre} {currentUser.apellidos}</strong>.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={loadingAction === 'delete-user'}
                  onClick={handleConfirmDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center space-x-1.5 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{loadingAction === 'delete-user' ? 'Eliminando...' : 'Sí, Eliminar Participante'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
