
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Navigation } from '@/components/Navigation';
import { AdminPanel } from '@/components/AdminPanel';
import { HomePage } from '@/components/HomePage';
import { PageView } from '@/components/PageView';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { CampusActivity, PageContent } from '../../server/src/schema';

type ViewType = 'home' | 'about' | 'education-student' | 'research' | 'community-service' | 'admission-student' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [featuredActivities, setFeaturedActivities] = useState<CampusActivity[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadFeaturedActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const activities = await trpc.getFeaturedActivities.query();
      setFeaturedActivities(activities);
    } catch (error) {
      console.error('Failed to load featured activities:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPageContent = useCallback(async (slug: string) => {
    try {
      setIsLoading(true);
      const content = await trpc.getPageContent.query({ slug });
      setPageContent(content);
    } catch (error) {
      console.error('Failed to load page content:', error);
      setPageContent(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentView === 'home') {
      loadFeaturedActivities();
      setPageContent(null);
    } else if (currentView !== 'admin') {
      // Convert view type to slug format
      const slug = currentView.replace('-', '');
      loadPageContent(slug);
    }
  }, [currentView, loadFeaturedActivities, loadPageContent]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('home');
  };

  const refreshActivities = () => {
    if (currentView === 'home') {
      loadFeaturedActivities();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Instituto Profissional de Canossa
                </h1>
                <p className="text-sm text-gray-600">Excellence in Professional Education</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAdminAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    👨‍💼 Admin
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminLogout}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('admin')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  🔐 Admin Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={handleViewChange}
        isAdminMode={isAdminAuthenticated}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'admin' ? (
          <AdminPanel
            isAuthenticated={isAdminAuthenticated}
            onLogin={handleAdminLogin}
            onActivitiesChange={refreshActivities}
          />
        ) : currentView === 'home' ? (
          <HomePage
            featuredActivities={featuredActivities}
            isLoading={isLoading}
          />
        ) : (
          <PageView
            pageContent={pageContent}
            isLoading={isLoading}
            viewType={currentView}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                🎓 Instituto Profissional de Canossa
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Providing quality professional education and fostering excellence 
                in academic achievement, research, and community service.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">📞 Contact Info</h4>
              <div className="text-gray-300 text-sm space-y-2">
                <p>📍 Address: [Campus Address]</p>
                <p>📧 Email: info@canossa.edu</p>
                <p>☎️ Phone: +123-456-7890</p>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">🔗 Quick Links</h4>
              <div className="text-gray-300 text-sm space-y-2">
                <p>• Academic Calendar</p>
                <p>• Student Portal</p>
                <p>• Faculty Directory</p>
                <p>• Campus Resources</p>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 Instituto Profissional de Canossa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
