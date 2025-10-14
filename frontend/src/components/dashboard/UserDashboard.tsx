import { BookOpen, FileText, TrendingUp } from 'react-feather';

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="card shadow bg-gradient-to-r from-urbano-primary to-red-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl mb-2">¡Bienvenido!</h1>
            <p className="text-red-100">
              Explora los cursos disponibles y mantente actualizado con el
              contenido más reciente.
            </p>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-full">
            <BookOpen size={32} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card shadow">
        <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
          <TrendingUp size={24} />
          Acciones Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/courses"
            className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <BookOpen className="mx-auto mb-2 text-indigo-500" size={32} />
            <h3 className="font-semibold">Explorar Cursos</h3>
            <p className="text-sm text-gray-600">
              Ver todos los cursos disponibles
            </p>
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
