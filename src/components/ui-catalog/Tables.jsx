import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Tables = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin', status: 'Inactive' },
  ]);

  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id) => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Filter table..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <Select
          className="w-full sm:w-auto"
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          value={itemsPerPage}
        >
          <option value="3">3 per page</option>
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(data[0]).map(column => (
                <th
                  key={column}
                  className="px-6 py-3 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column}
                    {sortColumn === column && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {Object.entries(item).map(([key, value], valueIndex) => (
                  <td key={valueIndex} className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                    {editingId === item.id && key !== 'id' ? (
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index][key] = e.target.value;
                          setData(newData);
                        }}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <div className="text-sm leading-5 text-gray-900">{value}</div>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-medium">
                  {editingId === item.id ? (
                    <Button onClick={() => handleSave(item.id)} className="text-green-600 hover:text-green-900 mr-2">
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => handleEdit(item.id)} className="text-blue-600 hover:text-blue-900 mr-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
            <Button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tables;