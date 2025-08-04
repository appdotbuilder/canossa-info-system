
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { CampusActivity } from '../../../server/src/schema';

interface HomePageProps {
  featuredActivities: CampusActivity[];
  isLoading: boolean;
}

export function HomePage({ featuredActivities, isLoading }: HomePageProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Instituto Profissional de Canossa
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            🌟 Empowering students through excellence in professional education, 
            innovative research, and meaningful community engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <span>🎯</span>
              <span>Quality Education</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <span>🔬</span>
              <span>Research Excellence</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <span>🌍</span>
              <span>Community Impact</span>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Featured Activities Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Featured Campus Activities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest events, achievements, and opportunities 
            happening at our campus.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-64">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredActivities.length === 0 ? (
          <Card className="text-center py-12 bg-gray-50">
            <CardContent>
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                No Featured Activities Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Campus activities will be displayed here once they are published by the administration.
                Check back soon for exciting updates!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredActivities.map((activity: CampusActivity) => (
              <Card
                key={activity.id}
                className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {activity.title}
                    </CardTitle>
                    {activity.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    {activity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activity.image_url && (
                    <div className="mb-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={activity.image_url}
                        alt={activity.title}
                        className="max-h-full max-w-full object-cover rounded-lg"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="text-gray-400 text-4xl">🖼️</div>';
                        }}
                      />
                    </div>
                  )}
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span>📅</span>
                      <span>
                        {activity.activity_date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🕒</span>
                      <span>
                        Published {activity.created_at.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {activity.content && (
                    <div className="mt-3 text-sm text-gray-700 line-clamp-3">
                      {activity.content.substring(0, 150)}
                      {activity.content.length > 150 && '...'}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Stats Section */}
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          📊 Our Impact at a Glance
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Students Enrolled</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-3xl mb-2">👨‍🏫</div>
            <div className="text-2xl font-bold text-green-600">50+</div>
            <div className="text-sm text-gray-600">Expert Faculty</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="text-3xl mb-2">🔬</div>
            <div className="text-2xl font-bold text-purple-600">25+</div>
            <div className="text-sm text-gray-600">Research Projects</div>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-xl">
            <div className="text-3xl mb-2">🤝</div>
            <div className="text-2xl font-bold text-orange-600">100+</div>
            <div className="text-sm text-gray-600">Community Programs</div>
          </div>
        </div>
      </section>
    </div>
  );
}
