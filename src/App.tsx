import React, { useState, useEffect } from 'react';
import { UserProfile, LessonPlan, OfficialCurriculumSequence, TipoPlanificacion } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { UnifiedAuthView } from './components/UnifiedAuthView';
import { CedulaRegisterView } from './components/CedulaRegisterView';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { SearchCurriculumView } from './components/SearchCurriculumView';
import { PlanGeneratorWizard } from './components/PlanGeneratorWizard';
import { PlanEditorView } from './components/PlanEditorView';
import { PlanConvertModal } from './components/PlanConvertModal';
import { CurriculumValidatorModal } from './components/CurriculumValidatorModal';
import { CurriculumLibraryView } from './components/CurriculumLibraryView';
import { CoordinationView } from './components/CoordinationView';
import { DirectorDashboardView } from './components/DirectorDashboardView';
import { AdminView } from './components/AdminView';
import { PedagogicalAiAssistant } from './components/PedagogicalAiAssistant';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // Navigation and Data
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [sequences, setSequences] = useState<OfficialCurriculumSequence[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Active editor / modal states
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [convertingPlan, setConvertingPlan] = useState<LessonPlan | null>(null);
  const [verifyingPlan, setVerifyingPlan] = useState<LessonPlan | null>(null);
  const [wizardInitSeq, setWizardInitSeq] = useState<OfficialCurriculumSequence | null>(null);
  const [wizardInitType, setWizardInitType] = useState<TipoPlanificacion | undefined>(undefined);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Load initial data
  const loadData = async (user?: UserProfile) => {
    try {
      const activeU = user || currentUser;
      const [seqs, uList] = await Promise.all([
        api.getSequences(),
        api.getAllUsers()
      ]);
      setSequences(seqs);
      setAllUsers(uList);

      if (activeU) {
        const pList = await api.getPlans({
          userId: activeU.id,
          userRol: activeU.rol,
          schoolId: activeU.centroEducativoId
        });
        setPlans(pList);
      }
    } catch (e) {
      console.error('Error loading initial data:', e);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    loadData(user);
    setCurrentTab('dashboard');
  };

  const handleQuickLogin = async (cedula: string) => {
    try {
      const res = await api.login(cedula, 'minerd2026');
      handleLoginSuccess(res.user);
    } catch (e: any) {
      // If error, try finding in allUsers
      const found = allUsers.find(u => u.cedula.replace(/\D/g, '') === cedula.replace(/\D/g, ''));
      if (found) {
        handleLoginSuccess(found);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEditingPlan(null);
    setConvertingPlan(null);
    setVerifyingPlan(null);
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    loadData(user);
  };

  // Handlers for Dashboard and Wizard
  const handleCreateNew = (initialType?: TipoPlanificacion) => {
    setWizardInitSeq(null);
    setWizardInitType(initialType);
    setCurrentTab('wizard');
  };

  const handleSelectSequenceForPlan = (seq: OfficialCurriculumSequence, suggestedType: TipoPlanificacion = 'diaria') => {
    setWizardInitSeq(seq);
    setWizardInitType(suggestedType);
    setCurrentTab('wizard');
  };

  const handlePlanCreated = (newPlan: LessonPlan) => {
    setPlans(prev => [newPlan, ...prev]);
    setEditingPlan(newPlan);
    setCurrentTab('editor');
  };

  const handleDuplicatePlan = async (plan: LessonPlan) => {
    try {
      const dup = await api.duplicatePlan(plan.id, {
        nuevaSeccion: plan.seccion === 'A' ? 'B' : 'C',
        docenteNombre: `${currentUser?.nombre} ${currentUser?.apellidos}`,
        docenteId: currentUser?.id
      });
      setPlans(prev => [dup, ...prev]);
      setEditingPlan(dup);
      setCurrentTab('editor');
    } catch (e) {
      console.error('Error duplicating plan:', e);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await api.deletePlan(planId, {
        adminId: currentUser?.id,
        adminNombre: currentUser ? `${currentUser.nombre} ${currentUser.apellidos}` : undefined,
        adminRol: currentUser?.rol
      });
      setPlans(prev => prev.filter(p => p.id !== planId));
      if (editingPlan?.id === planId) {
        setEditingPlan(null);
        setCurrentTab('dashboard');
      }
    } catch (e) {
      console.error('Error deleting plan:', e);
      throw e;
    }
  };

  const [loginPrefill, setLoginPrefill] = useState<{ cedula: string; message?: string } | null>(null);

  // If not logged in, show Unified Authentic Auth Screen (Login / Register)
  if (!currentUser) {
    return (
      <UnifiedAuthView
        onSuccess={handleLoginSuccess}
        initialMode={authMode}
        initialIdentifier={loginPrefill?.cedula || ''}
        initialMessage={loginPrefill?.message || null}
      />
    );
  }

  // If editing a plan, show full visual editor
  if (currentTab === 'editor' && editingPlan) {
    return (
      <PlanEditorView
        initialPlan={editingPlan}
        currentUser={currentUser}
        onSave={(updated) => {
          setEditingPlan(updated);
          setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
        }}
        onClose={() => {
          setEditingPlan(null);
          setCurrentTab('dashboard');
        }}
        onConvert={(p) => setConvertingPlan(p)}
        onDuplicate={(p) => handleDuplicatePlan(p)}
        onVerify={(p) => setVerifyingPlan(p)}
        onDelete={handleDeletePlan}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        onToggleAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        isAiDrawerOpen={isAiDrawerOpen}
      />

      {/* Main Tab Content */}
      <div className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            plans={plans}
            onOpenPlan={(p) => {
              setEditingPlan(p);
              setCurrentTab('editor');
            }}
            onCreateNew={handleCreateNew}
            onOpenSearch={() => setCurrentTab('search')}
            onConvertPlan={(p) => setConvertingPlan(p)}
            onDuplicatePlan={handleDuplicatePlan}
            onVerifyPlan={(p) => setVerifyingPlan(p)}
            onOpenLibrary={() => setCurrentTab('library')}
            onOpenCoordination={() => setCurrentTab('coordination')}
            onDeletePlan={handleDeletePlan}
          />
        )}

        {currentTab === 'search' && (
          <SearchCurriculumView
            sequences={sequences}
            onSelectSequenceForPlan={handleSelectSequenceForPlan}
            onViewSequenceDetails={(seq) => handleSelectSequenceForPlan(seq, 'diaria')}
          />
        )}

        {currentTab === 'wizard' && (
          <PlanGeneratorWizard
            currentUser={currentUser}
            sequences={sequences}
            initialSequence={wizardInitSeq}
            initialType={wizardInitType}
            onPlanCreated={handlePlanCreated}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'library' && (
          <CurriculumLibraryView
            sequences={sequences}
            currentUser={currentUser}
            onRefreshSequences={() => loadData(currentUser)}
            onSelectSequenceForPlan={(seq) => handleSelectSequenceForPlan(seq, 'diaria')}
          />
        )}

        {currentTab === 'coordination' && (
          <CoordinationView
            currentUser={currentUser}
            plans={plans}
            onOpenPlan={(p) => {
              setEditingPlan(p);
              setCurrentTab('editor');
            }}
            onRefreshPlans={() => loadData(currentUser)}
          />
        )}

        {currentTab === 'director' && (
          <DirectorDashboardView
            currentUser={currentUser}
            plans={plans}
            onOpenPlan={(p) => {
              setEditingPlan(p);
              setCurrentTab('editor');
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            currentUser={currentUser}
            allUsers={allUsers}
            sequences={sequences}
            onRefreshUsers={() => loadData(currentUser)}
          />
        )}
      </div>

      {/* Conversion Modal */}
      {convertingPlan && (
        <PlanConvertModal
          plan={convertingPlan}
          currentUser={currentUser}
          onConverted={(converted) => {
            setPlans(prev => [converted, ...prev]);
            setConvertingPlan(null);
            setEditingPlan(converted);
            setCurrentTab('editor');
          }}
          onClose={() => setConvertingPlan(null)}
        />
      )}

      {/* Curricular Validator Modal */}
      {verifyingPlan && (
        <CurriculumValidatorModal
          plan={verifyingPlan}
          onClose={() => setVerifyingPlan(null)}
        />
      )}

      {/* Pedagogical AI Assistant Floating Drawer */}
      <PedagogicalAiAssistant
        currentUser={currentUser}
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      {/* Official Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 Ministerio de Educación de la República Dominicana (MINERD) • Plataforma Oficial PlanificaRD
          </p>
          <p className="text-slate-400">
            Adecuación Curricular Vigente • Segundo Ciclo Crece Primaria • Administrado por Eddy Margeris Suazo Zabala
          </p>
        </div>
      </footer>
    </div>
  );
}
