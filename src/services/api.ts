import { LessonPlan, UserProfile, OfficialCurriculumSequence, AuditLog, TipoPlanificacion, EstadoPlanificacion } from '../types';

export const api = {
  // Auth & Census
  async lookupCedula(cedula: string) {
    const res = await fetch(`/api/auth/lookup-cedula/${encodeURIComponent(cedula)}`);
    return res.json();
  },

  async register(data: any): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al registrar usuario');
    }
    return res.json();
  },

  async login(identifier: string, password?: string): Promise<{ user: UserProfile; token: string; requiresPasswordChange?: boolean }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al iniciar sesión');
    }
    return res.json();
  },

  async changePassword(userId: string, newPassword: string): Promise<{ success: boolean; user: UserProfile; message: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar contraseña');
    }
    return res.json();
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const res = await fetch('/api/auth/users');
    return res.json();
  },

  async updateUser(id: string, data: any): Promise<{ success: boolean; user: UserProfile; message: string }> {
    const res = await fetch(`/api/auth/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al actualizar usuario');
    }
    return res.json();
  },

  async deleteUser(id: string, adminInfo?: { adminId?: string; adminNombre?: string; adminRol?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminInfo || {}),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al eliminar usuario');
    }
    return res.json();
  },

  // Curriculum
  async getSequences(params: {
    nivel?: string;
    ciclo?: string;
    grado?: string;
    area?: string;
    anoEscolar?: string;
    query?: string;
  } = {}): Promise<OfficialCurriculumSequence[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/curriculum/sequences?${query}`);
    return res.json();
  },

  async uploadCurriculumDocument(data: {
    nombreArchivo: string;
    area: string;
    grado: string;
    nivel: string;
    textoExtraido: string;
    userNombre: string;
    userId: string;
  }): Promise<OfficialCurriculumSequence> {
    const res = await fetch('/api/curriculum/upload-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Plans
  async getPlans(params: {
    userId?: string;
    userRol?: string;
    schoolId?: string;
    tipo?: string;
    estado?: string;
    area?: string;
    grado?: string;
    query?: string;
  } = {}): Promise<LessonPlan[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/plans?${query}`);
    return res.json();
  },

  async getPlanById(id: string): Promise<LessonPlan> {
    const res = await fetch(`/api/plans/${id}`);
    if (!res.ok) throw new Error('Planificación no encontrada');
    return res.json();
  },

  async createPlan(plan: Partial<LessonPlan>): Promise<LessonPlan> {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return res.json();
  },

  async updatePlan(id: string, plan: Partial<LessonPlan>): Promise<LessonPlan> {
    const res = await fetch(`/api/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return res.json();
  },

  async duplicatePlan(id: string, data: { nuevaSeccion: string; docenteNombre?: string; docenteId?: string }): Promise<LessonPlan> {
    const res = await fetch(`/api/plans/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async convertPlan(id: string, data: { targetTipo: TipoPlanificacion; userNombre?: string; userId?: string }): Promise<LessonPlan> {
    const res = await fetch(`/api/plans/${id}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async reviewPlan(id: string, data: {
    revisorId: string;
    revisorNombre: string;
    revisorRol: string;
    accion: 'observacion' | 'solicitud_ajuste' | 'marcado_revisado' | 'aprobado_institucional';
    comentario: string;
    nuevoEstado?: EstadoPlanificacion;
  }): Promise<LessonPlan> {
    const res = await fetch(`/api/plans/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePlan(id: string, adminInfo?: { adminId?: string; adminNombre?: string; adminRol?: string }): Promise<void> {
    const res = await fetch(`/api/plans/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminInfo || {})
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al eliminar la planificación');
    }
  },

  // AI
  async generateAiPlan(payload: any): Promise<any> {
    const res = await fetch('/api/ai/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async chatPedagogical(payload: { mensaje: string; historial?: any[]; contextoDocente?: any }): Promise<{ respuesta: string; fuente: string }> {
    const res = await fetch('/api/ai/pedagogical-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Admin
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/admin/audit-logs');
    return res.json();
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch('/api/admin/stats');
    return res.json();
  },

  async requestPermission(data: {
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    motivo: string;
    cargoSolicitado: string;
    areaSugerida: string;
  }): Promise<any> {
    const res = await fetch('/api/auth/request-permission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al enviar solicitud');
    }
    return res.json();
  },

  async getPermissionRequests(): Promise<any[]> {
    const res = await fetch('/api/admin/permission-requests');
    return res.json();
  },

  async authorizeCedula(data: {
    requestId?: string;
    cedula: string;
    nombres: string;
    apellidos?: string;
    correoInstitucional?: string;
    cargo?: string;
    areaPrincipal?: string;
    grados?: string[];
    adminNombre?: string;
    adminId?: string;
  }): Promise<any> {
    const res = await fetch('/api/admin/authorize-cedula', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al autorizar cédula');
    }
    return res.json();
  },

  async rejectPermission(data: { requestId: string; adminNombre?: string; adminId?: string }): Promise<any> {
    const res = await fetch('/api/admin/reject-permission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
