import React, { useState } from 'react';
import { 
  Store, Plus, Eye, Pencil, Trash2, Search
} from 'lucide-react';

const StoreManagement = () => {
  
  const initialData = [
    { id: 'ST-101', branch: 'Colombo 03', location: '6.9271, 79.8612', phone: '+94 11 234 5678', address: 'No. 45, Galle Road, Colombo 03' },
    { id: 'ST-105', branch: 'Peradeniya', location: '7.2906, 80.6337', phone: '+94 81 987 6543', address: 'Peradeniya Road, Kandy' },
    { id: 'ST-108', branch: 'Galle', location: '6.0367, 80.2170', phone: '+94 91 555 1234', address: 'Industrial Zone, Galle' },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = initialData.filter(s => 
    s.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-800 mb-6 uppercase tracking-tight">Store Management</h2>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-800 uppercase">Registered Stores</h3>
            <p className="text-[11px] text-slate-400">Manage your store locations efficiently.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search stores..." 
                className="bg-slate-100 border-none rounded-md py-2 pl-10 pr-4 text-xs outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="bg-blue-600 text-white px-5 py-2 rounded-md flex items-center gap-2 text-xs font-bold shadow-md opacity-90 cursor-default"
            >
              <Plus size={16} /> Add New Store
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-white text-[10px] uppercase font-bold text-slate-400 border-b">
              <th className="px-6 py-4">Store ID</th>
              <th className="px-6 py-4">Branch Name</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {filteredStores.map((store, index) => (
              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-medium">{store.id}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{store.branch}</td>
                <td className="px-6 py-4 text-slate-600">{store.location}</td>
                <td className="px-6 py-4 text-slate-600">{store.phone}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{store.address}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-4 text-slate-300">
                    <Eye size={17} className="hover:text-blue-600 cursor-pointer" />
                    <Pencil size={17} className="hover:text-blue-600 cursor-pointer" />
                    <Trash2 size={17} className="hover:text-red-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreManagement;