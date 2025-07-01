'use client';

import React, { useState } from 'react';
import CustomerTable from './CustomerTable';
import TotalCustomerTable from './TotalCustomerTable';

const CustomerTabs = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'totallist'>('customers');

  return (
    <div className=" overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
      {/* Tabs */}
      <div className=" mb-1  border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'customers' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('customers')}
          >
            Active Customers
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'totallist' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('totallist')}
          >
            All Customers
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'customers' ? (
        <CustomerTable />
      ) : (
        <TotalCustomerTable />
      )}
    </div>
  );
};

export default CustomerTabs;