import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';

import ContentsTable from '../components/content/ContentsTable';
import Layout from '../components/layout';
import ImageUpload from '../components/shared/ImageUpload';
import Modal from '../components/shared/Modal';
import PageSizeControls from '../components/shared/PageSizeControls';
import Pagination from '../components/shared/Pagination';
import SortControls from '../components/shared/SortControls';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';
import courseService from '../services/CourseService';

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [addContentShow, setAddContentShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const userQuery = useQuery('user', async () => courseService.findOne(id));

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateContentRequest>();

  // debounce filter values to avoid excessive api calls
  const debouncedName = useDebounce(name, 500);
  const debouncedDescription = useDebounce(description, 500);

  const { data, isLoading } = useQuery(
    [
      `contents-${id}`,
      debouncedName,
      debouncedDescription,
      page,
      limit,
      sortBy,
      sortOrder,
    ],
    async () =>
      contentService.findAll(id, {
        name: debouncedName || undefined,
        description: debouncedDescription || undefined,
        page,
        limit,
        sortBy,
        sortOrder,
      }),
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      `contents-${id}`,
      debouncedName,
      debouncedDescription,
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
    setPage(1);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: 'ASC' | 'DESC',
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const saveCourse = async (createContentRequest: CreateContentRequest) => {
    try {
      await contentService.save(id, createContentRequest);
      setAddContentShow(false);
      reset();
      setError(null);
      handleRefresh();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">
        {!userQuery.isLoading ? `${userQuery.data.name} Contents` : ''}
      </h1>
      <hr />
      <div className="flex gap-3 my-5">
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddContentShow(true)}
          >
            <Plus /> Add Content
          </button>
        ) : null}
        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={handleRefresh}
        >
          <RefreshCw /> Refresh
        </button>
      </div>

      <div className="table-filter">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4 items-start lg:items-center justify-between">
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          options={[
            { value: 'name', label: 'Nombre' },
            { value: 'description', label: 'Descripción' },
            { value: 'dateCreated', label: 'Fecha de Creación' },
          ]}
        />
        <PageSizeControls
          pageSize={limit}
          onPageSizeChange={handlePageSizeChange}
          total={data?.total || 0}
        />
      </div>

      <ContentsTable
        data={data?.data || []}
        isLoading={isLoading}
        courseId={id}
      />

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
      <Modal show={addContentShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Content</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddContentShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <ImageUpload
            value={watch('imageUrl')}
            onChange={(imageUrl) => setValue('imageUrl', imageUrl)}
            disabled={isSubmitting}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
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
