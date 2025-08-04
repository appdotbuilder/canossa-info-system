
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PageContent } from '../../../server/src/schema';

type ViewType = 'about' | 'education-student' | 'research' | 'community-service' | 'admission-student';

interface PageViewProps {
  pageContent: PageContent | null;
  isLoading: boolean;
  viewType: ViewType;
}

const pageEmojis: Record<ViewType, string> = {
  'about': '📋',
  'education-student': '🎓',
  'research': '🔬',
  'community-service': '🤝',
  'admission-student': '📝'
};

const defaultContent: Record<ViewType, { title: string; content: string }> = {
  'about': {
    title: 'About Instituto Profissional de Canossa',
    content: `
      <div class="space-y-6">
        <p class="text-lg leading-relaxed">
          Instituto Profissional de Canossa is a leading educational institution committed to 
          providing excellence in professional education. Our institution has been serving the 
          community for decades, fostering academic achievement and personal growth.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">🎯 Our Mission</h3>
        <p class="leading-relaxed">
          To provide quality professional education that prepares students for successful careers 
          while promoting values of integrity, excellence, and service to society.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">👁️ Our Vision</h3>
        <p class="leading-relaxed">
          To be a premier institution recognized for academic excellence, innovative research, 
          and meaningful community engagement.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">⭐ Core Values</h3>
        <ul class="list-disc list-inside space-y-2 leading-relaxed">
          <li><strong>Excellence:</strong> Striving for the highest standards in all endeavors</li>
          <li><strong>Integrity:</strong> Maintaining honesty and ethical behavior</li>
          <li><strong>Innovation:</strong> Embracing new ideas and creative solutions</li>
          <li><strong>Service:</strong> Contributing positively to our community</li>
          <li><strong>Respect:</strong> Valuing diversity and treating everyone with dignity</li>
        </ul>
      </div>
    `
  },
  'education-student': {
    title: 'Education Student Programs',
    content: `
      <div class="space-y-6">
        <p class="text-lg leading-relaxed">
          Our education student programs are designed to prepare future educators with the knowledge, 
          skills, and values necessary to excel in teaching and educational leadership.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">🎓 Degree Programs</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold text-blue-900">Bachelor of Education</h4>
            <p class="text-sm text-blue-700 mt-1">4-year comprehensive program</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold text-green-900">Master of Education</h4>
            <p class="text-sm text-green-700 mt-1">Advanced graduate studies</p>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">📚 Specializations</h3>
        <ul class="list-disc list-inside space-y-2 leading-relaxed">
          <li>Early Childhood Education</li>
          <li>Elementary Education</li>
          <li>Secondary Education</li>
          <li>Special Education</li>
          <li>Educational Leadership</li>
        </ul>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">🌟 Student Support</h3>
        <p class="leading-relaxed">
          We provide comprehensive support services including academic advising, career counseling, 
          tutoring services, and financial aid assistance to ensure student success.
        </p>
      </div>
    `
  },
  'research': {
    title: 'Research Excellence',
    content: `
      <div class="space-y-6">
        <p class="text-lg leading-relaxed">
          Research is at the heart of our academic mission. We are committed to advancing knowledge 
          through innovative research that addresses real-world challenges and contributes to societal progress.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">🔬 Research Areas</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold text-purple-900">Educational Technology</h4>
            <p class="text-sm text-purple-700 mt-1">Digital learning innovations</p>
          </div>
          <div class="bg-indigo-50 p-4 rounded-lg">
            <h4 class="font-semibold text-indigo-900">Curriculum Development</h4>
            <p class="text-sm text-indigo-700 mt-1">Evidence-based teaching methods</p>
          </div>
          <div class="bg-teal-50 p-4 rounded-lg">
            <h4 class="font-semibold text-teal-900">Community Engagement</h4>
            <p class="text-sm text-teal-700 mt-1">Social impact research</p>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">📊 Research Centers</h3>
        <ul class="list-disc list-inside space-y-2 leading-relaxed">
          <li>Center for Educational Innovation</li>
          <li>Institute for Community Development</li>
          <li>Research Center for Sustainable Practices</li>
          <li>Digital Learning Laboratory</li>
        </ul>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">🏆 Recent Achievements</h3>
        <p class="leading-relaxed">
          Our faculty and students have published over 100 research papers in peer-reviewed journals 
          and have received numerous grants for innovative research projects.
        </p>
      </div>
    `
  },
  'community-service': {
    title: 'Community Service',
    content: `
      <div class="space-y-6">
        <p class="text-lg leading-relaxed">
          Community service is an integral part of our educational philosophy. We believe in giving back 
          to society and creating positive impact through meaningful community engagement.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">🤝 Service Programs</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-semibold text-orange-900">Literacy Program</h4>
            <p class="text-sm text-orange-700 mt-1">Teaching reading and writing in underserved communities</p>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-semibold text-red-900">Health Awareness</h4>
            <p class="text-sm text-red-700 mt-1">Promoting health education and wellness</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900">Environmental Conservation</h4>
            <p class="text-sm text-yellow-700 mt-1">Sustainability and conservation initiatives</p>
          </div>
          <div class="bg-pink-50 p-4 rounded-lg">
            <h4 class="font-semibold text-pink-900">Youth Mentorship</h4>
            <p class="text-sm text-pink-700 mt-1">Guiding and supporting young people</p>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">📈 Impact Statistics</h3>
        <div class="bg-gray-50 p-6 rounded-lg">
          <div class="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">5,000+</div>
              <div class="text-sm text-gray-600">People Served</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">100+</div>
              <div class="text-sm text-gray-600">Active Projects</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-600">50+</div>
              <div class="text-sm text-gray-600">Partner Organizations</div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">✨ Get Involved</h3>
        <p class="leading-relaxed">
          Join our community service initiatives and make a difference. Contact our Community 
          Service Office to learn about volunteer opportunities and how you can contribute.
        </p>
      </div>
    `
  },
  'admission-student': {
    title: 'Admission Information',
    content: `
      <div class="space-y-6">
        <p class="text-lg leading-relaxed">
          Welcome to Instituto Profissional de Canossa! We are excited to help you begin your 
          educational journey with us. Our admission process is designed to be clear and supportive.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">📋 Admission Requirements</h3>
        <div class="bg-blue-50 p-6 rounded-lg">
          <h4 class="font-semibold text-blue-900 mb-3">For Undergraduate Programs:</h4>
          <ul class="list-disc list-inside space-y-1 text-blue-800">
            <li>High school diploma or equivalent</li>
            <li>Official transcripts</li>
            <li>Standardized test scores (if applicable)</li>
            <li>Personal statement</li>
            <li>Two letters of recommendation</li>
          </ul>
        </div>
        
        <div class="bg-green-50 p-6 rounded-lg">
          <h4 class="font-semibold text-green-900 mb-3">For Graduate Programs:</h4>
          <ul class="list-disc list-inside space-y-1 text-green-800">
            <li>Bachelor's degree from accredited institution</li>
            <li>Official university transcripts</li>
            <li>GRE scores (program dependent)</li>
            <li>Statement of purpose</li>
            <li>Three letters of recommendation</li>
          </ul>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">📅 Important Dates</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="border border-gray-200 p-4 rounded-lg">
            <h4 class="font-semibold">Fall Semester</h4>
            <p class="text-sm text-gray-600 mt-1">Application Deadline: March 1</p>
            <p class="text-sm text-gray-600">Classes Begin: August 15</p>
          </div>
          <div class="border border-gray-200 p-4 rounded-lg">
            <h4 class="font-semibold">Spring Semester</h4>
            <p class="text-sm text-gray-600 mt-1">Application Deadline: October 1</p>
            <p class="text-sm text-gray-600">Classes Begin: January 15</p>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">💰 Financial Information</h3>
        <p class="leading-relaxed">
          We offer various financial aid options including scholarships, grants, and work-study programs. 
          Our financial aid office is available to help you explore funding opportunities.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">📞 Contact Admissions</h3>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p><strong>Email:</strong> admissions@canossa.edu</p>
          <p><strong>Phone:</strong> +123-456-7890</p>
          <p><strong>Office Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM</p>
        </div>
      </div>
    `
  }
};

export function PageView({ pageContent, isLoading, viewType }: PageViewProps) {
  const emoji = pageEmojis[viewType];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use API content if available, otherwise fall back to default content
  const displayContent = pageContent || {
    title: defaultContent[viewType].title,
    content: defaultContent[viewType].content,
    meta_description: `Information about ${viewType.replace('-', ' ')} at Instituto Profissional de Canossa`,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="text-4xl mb-4">{emoji}</div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            {displayContent.title}
          </CardTitle>
          {displayContent.meta_description && (
            <p className="text-lg text-gray-600 mt-2">
              {displayContent.meta_description}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-8">
          {pageContent ? (
            // Render API content (might be HTML)
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: displayContent.content }}
            />
          ) : (
            // Render default content with proper styling
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: displayContent.content }}
            />
          )}
          
          {!pageContent && (
            <Alert className="mt-8 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                ℹ️ <strong>Note:</strong> This page is displaying default content. 
                Administrators can customize this content through the admin panel.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
