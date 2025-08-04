
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { 
  CampusActivity, 
  PageContent, 
  CreateCampusActivityInput, 
  UpdateCampusActivityInput,
  CreatePageContentInput,
  UpdatePageContentInput,
  AdminLoginInput 
} from '../../../server/src/schema';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onActivitiesChange: () => void;
}

export function AdminPanel({ isAuthenticated, onLogin, onActivitiesChange }: AdminPanelProps) {
  // Login state
  const [loginData, setLoginData] = useState<AdminLoginInput>({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Activities state
  const [activities, setActivities] = useState<CampusActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activityForm, setActivityForm] = useState<CreateCampusActivityInput>({
    title: '',
    description: '',
    content: '',
    image_url: null,
    activity_date: new Date(),
    is_featured: false,
    is_published: true
  });
  const [editingActivity, setEditingActivity] = useState<CampusActivity | null>(null);
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);

  // Pages state
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [pageForm, setPageForm] = useState<CreatePageContentInput>({
    page_slug: '',
    title: '',
    content: '',
    meta_description: null,
    is_published: true
  });
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [isSubmittingPage, setIsSubmittingPage] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string>('');

  const loadActivities = useCallback(async () => {
    try {
      setIsLoadingActivities(true);
      const result = await trpc.getCampusActivities.query();
      setActivities(result);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  const loadPages = useCallback(async () => {
    try {
      setIsLoadingPages(true);
      const result = await trpc.getAllPages.query();
      setPages(result);
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setIsLoadingPages(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadActivities();
      loadPages();
    }
  }, [isAuthenticated, loadActivities, loadPages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      await trpc.adminLogin.mutate(loginData);
      onLogin();
      setLoginData({ username: '', password: '' });
      setSuccessMessage('Successfully logged in!');
    } catch {
      setLoginError('Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingActivity(true);

    try {
      if (editingActivity) {
        const updateData: UpdateCampusActivityInput = {
          id: editingActivity.id,
          ...activityForm
        };
        const updatedActivity = await trpc.updateCampusActivity.mutate(updateData);
        setActivities((prev: CampusActivity[]) => 
          prev.map((a: CampusActivity) => a.id === editingActivity.id ? updatedActivity : a)
        );
        setSuccessMessage('Activity updated successfully!');
        setEditingActivity(null);
      } else {
        const newActivity = await trpc.createCampusActivity.mutate(activityForm);
        setActivities((prev: CampusActivity[]) => [newActivity, ...prev]);
        setSuccessMessage('Activity created successfully!');
      }

      setActivityForm({
        title: '',
        description: '',
        content: '',
        image_url: null,
        activity_date: new Date(),
        is_featured: false,
        is_published: true
      });
      
      onActivitiesChange();
    } catch (error) {
      console.error('Failed to save activity:', error);
    } finally {
      setIsSubmittingActivity(false);
    }
  };

  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPage(true);

    try {
      if (editingPage) {
        const updateData: UpdatePageContentInput = {
          id: editingPage.id,
          title: pageForm.title,
          content: pageForm.content,
          meta_description: pageForm.meta_description,
          is_published: pageForm.is_published
        };
        const updatedPage = await trpc.updatePageContent.mutate(updateData);
        setPages((prev: PageContent[]) => 
          prev.map((p: PageContent) => p.id === editingPage.id ? updatedPage : p)
        );
        setSuccessMessage('Page updated successfully!');
        setEditingPage(null);
      } else {
        const newPage = await trpc.createPageContent.mutate(pageForm);
        setPages((prev: PageContent[]) => [newPage, ...prev]);
        setSuccessMessage('Page created successfully!');
      }

      setPageForm({
        page_slug: '',
        title: '',
        content: '',
        meta_description: null,
        is_published: true
      });
    } catch (error) {
      console.error('Failed to save page:', error);
    } finally {
      setIsSubmittingPage(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await trpc.deleteCampusActivity.mutate({ id });
      setActivities((prev: CampusActivity[]) => prev.filter((a: CampusActivity) => a.id !== id));
      setSuccessMessage('Activity deleted successfully!');
      onActivitiesChange();
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const startEditingActivity = (activity: CampusActivity) => {
    setEditingActivity(activity);
    setActivityForm({
      title: activity.title,
      description: activity.description,
      content: activity.content,
      image_url: activity.image_url,
      activity_date: activity.activity_date,
      is_featured: activity.is_featured,
      is_published: activity.is_published
    });
  };

  const startEditingPage = (page: PageContent) => {
    setEditingPage(page);
    setPageForm({
      page_slug: page.page_slug,
      title: page.title,
      content: page.content,
      meta_description: page.meta_description,
      is_published: page.is_published
    });
  };

  const cancelEditing = () => {
    setEditingActivity(null);
    setEditingPage(null);
    setActivityForm({
      title: '',
      description: '',
      content: '',
      image_url: null,
      activity_date: new Date(),
      is_featured: false,
      is_published: true
    });
    setPageForm({
      page_slug: '',
      title: '',
      content: '',
      meta_description: null,
      is_published: true
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Access the content management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLoginData((prev: AdminLoginInput) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLoginData((prev: AdminLoginInput) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🛠️ Admin Content Management
        </h1>
        <p className="text-gray-600">
          Manage campus activities and page content for Instituto Profissional de Canossa
        </p>
      </div>

      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activities" className="flex items-center space-x-2">
            <span>🎉</span>
            <span>Campus Activities</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center space-x-2">
            <span>📄</span>
            <span>Page Content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-6">
          {/* Activity Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>✨</span>
                <span>{editingActivity ? 'Edit Activity' : 'Create New Activity'}</span>
              </CardTitle>
              <CardDescription>
                {editingActivity ? 'Update the selected campus activity' : 'Add a new campus activity to showcase'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleActivitySubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-title">Title *</Label>
                    <Input
                      id="activity-title"
                      value={activityForm.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setActivityForm((prev: CreateCampusActivityInput) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Activity title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-date">Activity Date *</Label>
                    <Input
                      id="activity-date"
                      type="date"
                      value={activityForm.activity_date.toISOString().split('T')[0]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setActivityForm((prev: CreateCampusActivityInput) => ({ 
                          ...prev, 
                          activity_date: new Date(e.target.value) 
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity-description">Description *</Label>
                  <Textarea
                    id="activity-description"
                    value={activityForm.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setActivityForm((prev: CreateCampusActivityInput) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Brief description of the activity"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity-content">Full Content *</Label>
                  <Textarea
                    id="activity-content"
                    value={activityForm.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setActivityForm((prev: CreateCampusActivityInput) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Detailed content about the activity"
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity-image">Image URL (optional)</Label>
                  <Input
                    id="activity-image"
                    type="url"
                    value={activityForm.image_url || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setActivityForm((prev: CreateCampusActivityInput) => ({ 
                        ...prev, 
                        image_url: e.target.value || null 
                      }))
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-featured"
                        checked={activityForm.is_featured}
                        onCheckedChange={(checked: boolean) =>
                          setActivityForm((prev: CreateCampusActivityInput) => ({ ...prev, is_featured: checked }))
                        }
                      />
                      <Label htmlFor="is-featured" className="text-sm">Featured Activity</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-published"
                        checked={activityForm.is_published}
                        onCheckedChange={(checked: boolean) =>
                          setActivityForm((prev: CreateCampusActivityInput) => ({ ...prev, is_published: checked }))
                        }
                      />
                      <Label htmlFor="is-published" className="text-sm">Published</Label>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {editingActivity && (
                      <Button type="button" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmittingActivity}>
                      {isSubmittingActivity 
                        ? (editingActivity ? 'Updating...' : 'Creating...') 
                        : (editingActivity ? 'Update Activity' : 'Create Activity')
                      }
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Activities List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Existing Activities</span>
              </CardTitle>
              <CardDescription>
                Manage your published campus activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="text-center py-8">Loading activities...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No activities created yet. Create your first activity above!
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity: CampusActivity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{activity.title}</h3>
                            <div className="flex space-x-2">
                              {activity.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800">⭐ Featured</Badge>
                              )}
                              <Badge variant={activity.is_published ? 'default' : 'secondary'}>
                                {activity.is_published ? '✅ Published' : '❌ Draft'}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">{activity.description}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>📅 Activity Date: {activity.activity_date.toLocaleDateString()}</p>
                            <p>🕒 Created: {activity.created_at.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingActivity(activity)}
                          >
                            ✏️ Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                🗑️ Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteActivity(activity.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          {/* Page Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📝</span>
                <span>{editingPage ? 'Edit Page Content' : 'Create New Page'}</span>
              </CardTitle>
              <CardDescription>
                {editingPage ? 'Update the selected page content' : 'Create content for website pages'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePageSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-slug">Page Slug *</Label>
                    <Input
                      id="page-slug"
                      value={pageForm.page_slug}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPageForm((prev: CreatePageContentInput) => ({ ...prev, page_slug: e.target.value }))
                      }
                      placeholder="about, education-student, etc."
                      disabled={!!editingPage}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      URL identifier for the page (cannot be changed after creation)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Page Title *</Label>
                    <Input
                      id="page-title"
                      value={pageForm.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPageForm((prev: CreatePageContentInput) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Page title"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-meta">Meta Description</Label>
                  <Input
                    id="page-meta"
                    value={pageForm.meta_description || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPageForm((prev: CreatePageContentInput) => ({ 
                        ...prev, 
                        meta_description: e.target.value || null 
                      }))
                    }
                    placeholder="Brief description for search engines"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-content">Page Content *</Label>
                  <Textarea
                    id="page-content"
                    value={pageForm.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setPageForm((prev: CreatePageContentInput) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Full page content (HTML supported)"
                    rows={12}
                    required
                  />
                  
                  <p className="text-xs text-gray-500">
                    You can use HTML tags for formatting
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="page-published"
                      checked={pageForm.is_published}
                      onCheckedChange={(checked: boolean) =>
                        setPageForm((prev: CreatePageContentInput) => ({ ...prev, is_published: checked }))
                      }
                    />
                    <Label htmlFor="page-published" className="text-sm">Published</Label>
                  </div>

                  <div className="flex space-x-2">
                    {editingPage && (
                      <Button type="button" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmittingPage}>
                      {isSubmittingPage 
                        ? (editingPage ? 'Updating...' : 'Creating...') 
                        : (editingPage ? 'Update Page' : 'Create Page')
                      }
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Pages List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📚</span>
                <span>Existing Pages</span>
              </CardTitle>
              <CardDescription>
                Manage your website page content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPages ? (
                <div className="text-center py-8">Loading pages...</div>
              ) : pages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pages created yet. Create your first page above!
                </div>
              ) : (
                <div className="space-y-4">
                  {pages.map((page: PageContent) => (
                    <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{page.title}</h3>
                            <Badge variant={page.is_published ? 'default' : 'secondary'}>
                              {page.is_published ? '✅ Published' : '❌ Draft'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>🔗 Slug: /{page.page_slug}</p>
                            <p>🕒 Updated: {page.updated_at.toLocaleDateString()}</p>
                            {page.meta_description && (
                              <p>📝 Meta: {page.meta_description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingPage(page)}
                          >
                            ✏️ Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
