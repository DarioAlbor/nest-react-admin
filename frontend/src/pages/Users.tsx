import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';

import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import PageSizeControls from '../components/shared/PageSizeControls';
import Pagination from '../components/shared/Pagination';
import SortControls from '../components/shared/SortControls';
import UsersTable from '../components/users/UsersTable';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { useTranslation } from '../hooks/useTranslation';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

export default function Users() {
  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // debounce filter values to avoid excessive api calls
  const debouncedFirstName = useDebounce(firstName, 500);
  const debouncedLastName = useDebounce(lastName, 500);
  const debouncedUsername = useDebounce(username, 500);

  const { data, isLoading } = useQuery(
    [
      'users',
      debouncedFirstName,
      debouncedLastName,
      debouncedUsername,
      role,
      page,
      limit,
      sortBy,
      sortOrder,
    ],
    async () => {
      const result = await userService.findAll({
        firstName: debouncedFirstName || undefined,
        lastName: debouncedLastName || undefined,
        username: debouncedUsername || undefined,
        role: role || undefined,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      // filter out current user from results
      return {
        ...result,
        data: result.data.filter((user) => user.id !== authenticatedUser.id),
      };
    },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      'users',
      debouncedFirstName,
      debouncedLastName,
      debouncedUsername,
      role,
      page,
      limit,
      sortBy,
      sortOrder,
    ]);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // reset to first page when changing page size
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: 'ASC' | 'DESC',
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1); // reset to first page when changing sort
  };

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      setError(null);
      reset();
      handleRefresh();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">{t('users.title')}</h1>
      <hr />
      <div className="flex gap-3 my-5">
        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setAddUserShow(true)}
        >
          <Plus /> {t('users.addUser')}
        </button>
        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={handleRefresh}
        >
          <RefreshCw /> {t('common.refresh')}
        </button>
      </div>

      <div className="table-filter mt-2">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('users.firstName')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('users.lastName')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('users.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <select
            name=""
            id=""
            className="input w-1/2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">{t('filters.all')}</option>
            <option value="user">{t('users.roles.user')}</option>
            <option value="editor">{t('users.roles.editor')}</option>
            <option value="admin">{t('users.roles.admin')}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4 items-start lg:items-center justify-between">
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          options={[
            { value: 'firstName', label: t('users.firstName') },
            { value: 'lastName', label: t('users.lastName') },
            { value: 'username', label: t('users.username') },
            { value: 'role', label: t('users.role') },
            { value: 'dateCreated', label: t('users.created') },
          ]}
        />
        <PageSizeControls
          pageSize={limit}
          onPageSizeChange={handlePageSizeChange}
          total={data?.total || 0}
        />
      </div>

      <UsersTable data={data?.data || []} isLoading={isLoading} />

      {data && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          hasNext={data.hasNext}
          hasPrev={data.hasPrev}
        />
      )}

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">
            {t('users.addUserModal.title')}
          </h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(null);
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('users.addUserModal.firstNamePlaceholder')}
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('users.addUserModal.lastNamePlaceholder')}
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            required
            placeholder={t('users.addUserModal.usernamePlaceholder')}
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            required
            placeholder={t('users.addUserModal.passwordPlaceholder')}
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            required
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">{t('users.roles.user')}</option>
            <option value="editor">{t('users.roles.editor')}</option>
            <option value="admin">{t('users.roles.admin')}</option>
          </select>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              t('common.save')
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
