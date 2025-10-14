import { useState } from 'react';
import { Loader, Lock, Mail, User } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';

export default function ProfileSettings() {
  const { authenticatedUser } = useAuth();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const { data, isLoading, refetch } = useQuery(
    `user-${authenticatedUser.id}`,
    () => userService.findOne(authenticatedUser.id),
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = useForm<UpdateUserRequest>();

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      if (updateUserRequest.username === data.username) {
        delete updateUserRequest.username;
      }
      await userService.update(authenticatedUser.id, updateUserRequest);
      setError(null);
      setSuccess('Perfil actualizado correctamente');
      setValue('password', '');
      reset();
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response.data.message);
      setSuccess(null);
    }
  };

  if (isLoading) {
    return (
      <div className="card shadow">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-urbano-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-urbano-primary rounded-lg">
          <User className="text-white" size={24} />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Configuración de Perfil</h2>
          <p className="text-gray-600 text-sm">
            Gestiona tus datos personales y credenciales
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(handleUpdateUser)}>
        {/* Personal Information Section */}
        <div className="border-b pb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <User size={20} />
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                className="input w-full"
                defaultValue={data.firstName}
                disabled={isSubmitting}
                placeholder="Nombre"
                {...register('firstName')}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                className="input w-full"
                defaultValue={data.lastName}
                disabled={isSubmitting}
                placeholder="Apellido"
                {...register('lastName')}
              />
            </div>
          </div>
        </div>

        {/* Credentials Section */}
        <div className="border-b pb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Lock size={20} />
            Credenciales
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                className="input w-full"
                defaultValue={data.username}
                disabled={isSubmitting}
                placeholder="Nombre de usuario"
                {...register('username')}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                className="input w-full"
                placeholder="Dejar vacío para mantener la actual"
                disabled={isSubmitting}
                {...register('password')}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres. Dejar vacío para mantener la contraseña
                actual.
              </p>
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Mail size={20} />
            Información de Cuenta
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Rol:</span>
              <span className="text-gray-600 capitalize">{data.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Estado:</span>
              <span
                className={`font-medium ${
                  data.isActive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {data.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Miembro desde:</span>
              <span className="text-gray-600">
                {new Date(data.dateCreated).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button className="btn w-full md:w-auto px-8" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Actualizar Perfil'
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="text-red-500 p-3 font-semibold border border-red-300 rounded-md bg-red-50">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 p-3 font-semibold border border-green-300 rounded-md bg-green-50">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}
