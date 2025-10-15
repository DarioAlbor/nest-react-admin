import { BookOpen, Calendar, Eye } from 'react-feather';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { useTranslation } from '../../hooks/useTranslation';
import courseService from '../../services/CourseService';

export default function RecentCourses() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(
    'recent-courses',
    () =>
      courseService.findAll({
        page: 1,
        limit: 5,
        sortBy: 'dateCreated',
        sortOrder: 'DESC',
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) {
    return (
      <div className="card shadow">
        <h2 className="font-semibold text-xl mb-4">
          {t('dashboard.recentCourses.title')}
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-urbano-primary"></div>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="card shadow">
        <h2 className="font-semibold text-xl mb-4">
          {t('dashboard.recentCourses.title')}
        </h2>
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="mx-auto mb-2" size={48} />
          <p>{t('dashboard.recentCourses.noCourses')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">
          {t('dashboard.recentCourses.title')}
        </h2>
        <Link
          to="/courses"
          className="text-urbano-primary hover:text-opacity-80 text-sm font-medium flex items-center gap-1"
        >
          {t('dashboard.recentCourses.viewAll')} <Eye size={16} />
        </Link>
      </div>

      <div className="space-y-3">
        {data.data.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {course.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} />
                  <span>
                    {t('dashboard.recentCourses.created')}:{' '}
                    {new Date(course.dateCreated).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link
                to={`/courses/${course.id}`}
                className="ml-4 px-3 py-1 bg-urbano-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-colors"
              >
                {t('courses.viewContents')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
