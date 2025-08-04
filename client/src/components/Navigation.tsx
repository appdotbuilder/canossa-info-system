
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewType = 'home' | 'about' | 'education-student' | 'research' | 'community-service' | 'admission-student' | 'admin';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isAdminMode: boolean;
}

export function Navigation({ currentView, onViewChange, isAdminMode }: NavigationProps) {
  const navigationItems = [
    { id: 'home' as ViewType, label: '🏠 Home', emoji: '🏠' },
    { id: 'about' as ViewType, label: '📋 About', emoji: '📋' },
    { id: 'education-student' as ViewType, label: '🎓 Education Student', emoji: '🎓' },
    { id: 'research' as ViewType, label: '🔬 Research', emoji: '🔬' },
    { id: 'community-service' as ViewType, label: '🤝 Community Service', emoji: '🤝' },
    { id: 'admission-student' as ViewType, label: '📝 Admission Student', emoji: '📝' },
  ];

  if (isAdminMode) {
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-blue-600 font-semibold">🛠️ Admin Panel</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">Content Management System</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-1 py-4 overflow-x-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              )}
            >
              <span>{item.emoji}</span>
              <span className="font-medium">{item.label.replace(/^🔗\s*/, '').replace(/^[^\s]+\s/, '')}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
