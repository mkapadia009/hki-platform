'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string; // Can be a nested key or custom
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
  searchPlaceholder?: string;
}

export function DataTable<T>({ columns, data, onRowClick, defaultSort, searchPlaceholder = "Search..." }: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(defaultSort || null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Filter
  const filteredData = useMemo(() => {
    if (!search) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((item) => {
      // Very basic global search: just stringify the object's values and search
      return Object.values(item as any).some(val => 
        val && typeof val !== 'object' && String(val).toLowerCase().includes(lowerSearch)
      );
    });
  }, [data, search]);

  // 2. Sort
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        // Handle nested keys like 'customer.companyName' (basic support)
        const getNestedVal = (obj: any, path: string) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };
        
        const aVal = getNestedVal(a, sortConfig.key);
        const bVal = getNestedVal(b, sortConfig.key);
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // 3. Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Reset to page 1 when searching or sorting changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, sortConfig]);

  const handleExportCSV = () => {
    if (sortedData.length === 0) return;
    
    // Get headers
    const headers = columns.map(c => c.header).join(',');
    
    // Get rows
    const rows = sortedData.map(row => {
      return columns.map(col => {
        // Simple string extraction for nested keys
        let val = (col.accessorKey as string).split('.').reduce((acc: any, part) => acc && acc[part], row);
        
        // Handle dates, nulls, objects
        if (val === null || val === undefined) val = '';
        else if (val instanceof Date) val = val.toISOString();
        else if (typeof val === 'object') val = JSON.stringify(val);
        
        // Escape quotes and wrap in quotes to handle commas in data
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-sm relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          onClick={handleExportCSV}
          className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="text-left text-gray-500">
                {columns.map((col, i) => (
                  <th 
                    key={i} 
                    className={`px-6 py-4 font-medium ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none' : ''}`}
                    onClick={() => col.sortable !== false && handleSort(col.accessorKey as string)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable !== false && sortConfig?.key === col.accessorKey && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <tr 
                    key={i} 
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors' : ''}`}
                  >
                    {columns.map((col, j) => (
                      <td key={j} className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {col.cell ? col.cell(row) : (
                            // Nested key resolution for rendering
                            (col.accessorKey as string).split('.').reduce((acc: any, part) => acc && acc[part], row) as React.ReactNode
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of{' '}
              <span className="font-medium text-gray-900 dark:text-white">{sortedData.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-sm font-medium px-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
