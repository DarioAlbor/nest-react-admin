import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import LoginRequest from '../models/auth/LoginRequest';
import authService from '../services/AuthService';

export default function Login() {
  const { setAuthenticatedUser } = useAuth();
  const history = useHistory();

  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (loginRequest: LoginRequest) => {
    try {
      const data = await authService.login(loginRequest);
      setAuthenticatedUser(data.user);
      history.push('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="h-full flex justify-center items-center bg-urbano-background">
      <div className="card shadow-lg border-t-4 border-urbano-primary">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-urbano-primary font-bold text-3xl">URBANO</h1>
          <p className="text-gray-600 text-sm">CRM System</p>
        </div>
        <h2 className="mb-3 text-center font-semibold text-2xl text-gray-700">
          Iniciar Sesión
        </h2>
        <hr className="border-urbano-header" />
        <form
          className="flex flex-col gap-5 mt-8 w-64"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            className="input sm:text-lg focus:border-urbano-primary focus:ring-urbano-primary"
            placeholder="Usuario"
            required
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input sm:text-lg focus:border-urbano-primary focus:ring-urbano-primary"
            placeholder="Contraseña"
            required
            disabled={isSubmitting}
            {...register('password')}
          />
          <button
            className="btn mt-3 sm:text-lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Ingresar'
            )}
          </button>
          {error ? (
            <div className="text-urbano-primary p-3 font-semibold border border-urbano-primary rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
