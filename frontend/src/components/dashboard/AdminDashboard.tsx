import { BookOpen, FileText, TrendingUp, Users } from 'react-feather';
import { useQuery } from 'react-query';

import statsService from '../../services/StatsService';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery('stats', statsService.getStats);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card shadow animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card shadow text-white bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl mb-2">{data.numberOfUsers}</h1>
              <p className="text-blue-100 font-semibold">Usuarios</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Users size={32} />
            </div>
          </div>
        </div>

        <div className="card shadow text-white bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl mb-2">
                {data.numberOfCourses}
              </h1>
              <p className="text-indigo-100 font-semibold">Cursos</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <BookOpen size={32} />
            </div>
          </div>
        </div>

        <div className="card shadow text-white bg-gradient-to-r from-green-500 to-green-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl mb-2">
                {data.numberOfContents}
              </h1>
              <p className="text-green-100 font-semibold">Contenidos</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FileText size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card shadow">
        <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
          <TrendingUp size={24} />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/users"
            className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <Users className="mx-auto mb-2 text-blue-500" size={32} />
            <h3 className="font-semibold">Gestionar Usuarios</h3>
            <p className="text-sm text-gray-600">
              Administrar usuarios del sistema
            </p>
          </a>
          <a
            href="/courses"
            className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <BookOpen className="mx-auto mb-2 text-indigo-500" size={32} />
            <h3 className="font-semibold">Gestionar Cursos</h3>
            <p className="text-sm text-gray-600">Crear y editar cursos</p>
          </a>
          <a
            href="/profile"
            className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <FileText className="mx-auto mb-2 text-green-500" size={32} />
            <h3 className="font-semibold">Mi Perfil</h3>
            <p className="text-sm text-gray-600">Configurar perfil personal</p>
          </a>
        </div>
      </div>
    </div>
  );
}
