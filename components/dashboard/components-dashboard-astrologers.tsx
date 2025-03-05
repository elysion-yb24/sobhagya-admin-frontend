'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import Link from 'next/link';

interface Astrologer {
  _id: string;
  name: string;
  phone?: string;
  createdAt?: string;
  leadStatus?: string;         // "Pending", "rejected", or "onboarded"
  interviewStatus?: string;    // "Pending", "rejected", or "clear"
}

interface AstrologerComponentProps {
  astrologers: Astrologer[];
}

interface FormData {
  name: string;
  phone: string;
  skip: number;
  limit: number;
}

const AstrologerComponent: React.FC<AstrologerComponentProps> = ({ astrologers }) => {
  // Optional: If you have RTL settings from Redux
  const isRtl = useSelector((state: any) => state.themeConfig?.rtlClass) === 'rtl';

  // Local states
  const [initialRecords, setInitialRecords] = useState<Astrologer[]>(astrologers);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Next.js 13 hooks for query params / navigation
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push, refresh } = useRouter();

  // Manage search + pagination data
  const [formData, setFormData] = useState<FormData>({
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    skip: Number(searchParams.get('skip')) || 0,
    limit: 10,
  });

  // Sorting state for DataTable
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'serial',
    direction: 'asc',
  });

  // On mount or whenever props/searchParams change, update local states
  useEffect(() => {
    setInitialRecords(astrologers);
    setFormData({
      name: searchParams.get('name') || '',
      phone: searchParams.get('phone') || '',
      skip: Number(searchParams.get('skip')) || 0,
      limit: 10,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [astrologers, searchParams]);

  // Re-sort the records in-memory whenever sorting changes
  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortStatus]);

  // Handle search form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const updatedForm = { ...formData, skip: 0 };
    setFormData(updatedForm);
    handleQuery(updatedForm);
  };

  // Update URL query params & trigger data refresh
  const handleQuery = (updatedForm: FormData) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updatedForm).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    // Update URL query parameters
    push(`${pathname}?${params.toString()}`);
    // Refresh the page so that new data is fetched on the server side
    refresh();

    // Simulate loading state (adjust as needed)
    setTimeout(() => setIsLoading(false), 500);
  };

  // Helper: color coding for statuses
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-400 text-white';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500 text-black';  // pending => yellow
      case 'rejected':
        return 'bg-red-500 text-white';     // rejected => red
      case 'onboarded':
      case 'clear':
        return 'bg-green-500 text-white';   // onboarded/clear => green
      default:
        return 'bg-gray-400 text-white';
    }
  };

  // Table columns
  const columns = [
    {
      accessor: 'serial',
      title: 'Serial',
      render: (_record: Astrologer, index: number) => index + 1,
      sortable: false,
    },
    {
      accessor: 'name',
      title: 'Name',
      sortable: true,
      render: (record: Astrologer) => (
        <div className="font-bold text-info">{record.name}</div>
      ),
    },
    {
      accessor: 'phone',
      title: 'Phone',
      sortable: false,
      render: (record: Astrologer) => <div className="text-dark">{record.phone}</div>,
    },
    {
      accessor: 'createdAt',
      title: 'Registration Date',
      sortable: true,
      render: (record: Astrologer) => {
        if (!record.createdAt) return null;
        const dateStr = new Date(record.createdAt).toLocaleDateString();
        return <div>{dateStr}</div>;
      },
    },
    {
      accessor: 'interviewStatus',
      title: 'Interview Status',
      sortable: true,
      render: (record: Astrologer) => (
        <span className={`badge rounded-full px-2 py-1 ${getStatusColor(record.interviewStatus)}`}>
          {record.interviewStatus || 'N/A'}
        </span>
      ),
    },
    {
      accessor: 'leadStatus',
      title: 'Lead Status',
      sortable: true,
      render: (record: Astrologer) => (
        <span className={`badge rounded-full px-2 py-1 ${getStatusColor(record.leadStatus)}`}>
          {record.leadStatus || 'N/A'}
        </span>
      ),
    },
    {
      accessor: 'view',
      title: 'View',
      render: (record: Astrologer) => (
        <Link
          href={`/astrologers/${record._id}`} // dynamic route
          className="bg-primary text-white px-3 py-1 rounded-md"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <>
      {/* Search Form */}
      <form className="mx-auto w-full mb-5" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Name filter */}
          <div className="relative">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              placeholder="Name ...."
              name="name"
              className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Phone filter */}
          <div className="relative">
            <label>Phone</label>
            <input
              type="text"
              value={formData.phone}
              placeholder="Phone number ...."
              name="phone"
              className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button className="bg-primary text-white p-2 font-bold rounded-md" type="submit">
            Search
          </button>
        </div>
      </form>

      {/* Data Table */}
      <div className="panel mt-6">
        <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Astrologers List</h5>

        <div className="datatables">
          <DataTable
            records={initialRecords}
            columns={columns}
            idAccessor="_id"
            highlightOnHover
            className="table-hover whitespace-nowrap"
            noRecordsText="No results found"
            fetching={isLoading}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            minHeight={200}
            emptyState={<div>No records Found</div>}
          />
        </div>

        {/* Pagination */}
        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mt-4">
          {/* Previous Button */}
          <li>
            <button
              type="button"
              className={`flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary ${
                formData.skip === 0 ? 'cursor-not-allowed hover:bg-primary-light' : ''
              }`}
              onClick={() => {
                const newSkip = Math.max(0, formData.skip - 10);
                const updatedForm = { ...formData, skip: newSkip };
                setFormData(updatedForm);
                handleQuery(updatedForm);
              }}
              disabled={formData.skip === 0}
            >
              <span className="sr-only">Previous</span>
              <span className="transform rotate-90">{'<'}</span>
            </button>
          </li>

          {/* Next Button */}
          <li>
            <button
              type="button"
              className={`flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary ${
                initialRecords.length < 10 ? 'cursor-not-allowed hover:bg-primary-light' : ''
              }`}
              onClick={() => {
                const newSkip = formData.skip + 10;
                const updatedForm = { ...formData, skip: newSkip };
                setFormData(updatedForm);
                handleQuery(updatedForm);
              }}
              disabled={initialRecords.length < 10}
            >
              <span className="sr-only">Next</span>
              <span className="transform -rotate-90">{'>'}</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AstrologerComponent;
