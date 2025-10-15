import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import PageSizeControls from '../components/shared/PageSizeControls';
import Pagination from '../components/shared/Pagination';
import SortControls from '../components/shared/SortControls';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { useTranslation } from '../hooks/useTranslation';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // debounce filter values to avoid excessive api calls
  const debouncedName = useDebounce(name, 500);
  const debouncedDescription = useDebounce(description, 500);

  const { data, isLoading } = useQuery(
    [
      'courses',
      debouncedName,
      debouncedDescription,
      page,
      limit,
      sortBy,
      sortOrder,
    ],
    () =>
      courseService.findAll({
        name: debouncedName || undefined,
        description: debouncedDescription || undefined,
        page,
        limit,
        sortBy,
        sortOrder,
      }),
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      'courses',
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

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      setError(null);
      handleRefresh();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">{t('courses.title')}</h1>
      <hr />
      <div className="flex gap-3 my-5">
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> {t('courses.addCourse')}
          </button>
        ) : null}
        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={handleRefresh}
        >
          <RefreshCw /> {t('common.refresh')}
        </button>
      </div>

      <div className="table-filter">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('courses.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder={t('courses.description')}
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
            { value: 'name', label: t('courses.name') },
            { value: 'description', label: t('courses.description') },
            { value: 'dateCreated', label: t('courses.created') },
          ]}
        />
        <PageSizeControls
          pageSize={limit}
          onPageSizeChange={handlePageSizeChange}
          total={data?.total || 0}
        />
      </div>

      <CoursesTable data={data?.data || []} isLoading={isLoading} />

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
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">
            {t('courses.addCourseModal.title')}
          </h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
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
            placeholder={t('courses.addCourseModal.namePlaceholder')}
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder={t('courses.addCourseModal.descriptionPlaceholder')}
            disabled={isSubmitting}
            required
            {...register('description')}
          />
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
