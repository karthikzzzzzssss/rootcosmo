import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './lib/supabase';
import type { Treatment, Category } from './types';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { categoryPath, treatmentPath, deslugify } from './lib/routes';

import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesCategories from './components/ServicesCategories';
import ExpertCare from './components/ExpertCare';
import BrandBanner from './components/BrandBanner';
import PremierTreatments from './components/PremierTreatments';
import PopularTreatments from './components/PopularTreatments';
import WhyChooseUs from './components/WhyChooseUs';
import ProductsSection from './components/ProductsSection';
import AppointmentModal from './components/AppointmentModal';
import CategoryPage from './components/CategoryPage';
import TreatmentDetailPage from './components/TreatmentDetailPage';
import Footer from './components/Footer';

const AdminView = lazy(() => import('./components/AdminView'));

const ADMIN_HASH = '#admin';

function readIsAdmin() {
  return typeof window !== 'undefined' && window.location.hash === ADMIN_HASH;
}

type Route =
  | { type: 'home' }
  | { type: 'category'; slug: string }
  | { type: 'treatment'; name: string };

function parsePath(pathname: string): Route {
  if (pathname === '/' || pathname === '') return { type: 'home' };
  const catMatch = pathname.match(/^\/categories\/([\w-]+)\/?$/);
  if (catMatch) return { type: 'category', slug: catMatch[1] };
  const treatMatch = pathname.match(/^\/treatments\/(.+?)\/?$/);
  if (treatMatch) return { type: 'treatment', name: deslugify(treatMatch[1]) };
  return { type: 'home' };
}

function AppContent() {
  const { t } = useI18n();
  const [isAdmin, setIsAdmin] = useState(readIsAdmin);
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname));
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  useEffect(() => {
    const onHashChange = () => setIsAdmin(readIsAdmin());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    supabase
      .from('categories')
      .select('*')
      .order('created_at')
      .then(({ data, error }) => {
        if (!error && data) setCategories(data);
      });
  }, [isAdmin]);

  const openModal = (treatment?: Treatment) => {
    setSelectedTreatment(treatment ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTreatment(null);
  };

  const navigateTo = (slug: string) => {
    const path = categoryPath(slug);
    window.history.pushState({}, '', path);
    setRoute({ type: 'category', slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTreatment = (name: string) => {
    const path = treatmentPath(name);
    window.history.pushState({}, '', path);
    setRoute({ type: 'treatment', name });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    setRoute({ type: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitAdmin = () => {
    window.location.hash = '';
    setIsAdmin(false);
    window.scrollTo({ top: 0 });
  };

  if (isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
            Loading admin...
          </div>
        }
      >
        <AdminView onExit={exitAdmin} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <TopBar />
      <Navbar
        onBookAppointment={() => openModal()}
        onNavigate={navigateTo}
        onNavigateTreatment={navigateToTreatment}
        onHome={goHome}
      />

      <main className="flex-1">
        {route.type === 'category' ? (
          <CategoryPage
            slug={route.slug}
            categories={categories}
            onNavigate={navigateTo}
            onBack={goHome}
            onBook={openModal}
          />
        ) : route.type === 'treatment' ? (
          <TreatmentDetailPage
            treatmentName={route.name}
            onBack={goHome}
            onBook={openModal}
            onNavigate={navigateTo}
          />
        ) : (
          <>
            <Hero
              onBookAppointment={() => openModal()}
              onExplore={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
            <ServicesCategories onNavigate={navigateTo} />
            <ExpertCare />
            <BrandBanner />
            <PremierTreatments onBook={openModal} onViewAll={() => navigateTo('dental-care')} />
            <WhyChooseUs onBookAppointment={() => openModal()} />
            <PopularTreatments onBook={openModal} onBookAppointment={() => openModal()} onViewAll={() => navigateTo('face-aesthetics')} />
            <ProductsSection onNavigate={navigateTo} />
          </>
        )}
      </main>

      <Footer onNavigate={navigateTo} onNavigateTreatment={navigateToTreatment} />

      <AppointmentModal
        isOpen={modalOpen}
        onClose={closeModal}
        selectedTreatment={selectedTreatment}
      />

      {/* Floating chat / book button */}
      <button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform duration-200"
        style={{ background: 'linear-gradient(135deg, #6d28d9, #5b0fa8)' }}
        title={t('bookAppointment')}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
