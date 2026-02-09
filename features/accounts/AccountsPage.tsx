
import React, { useState, useMemo } from 'react';
import { Plus, Search, Briefcase, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useAccounts } from '../../contexts/AccountsContext';
import { useUsers } from '../../contexts/UsersContext';
import { useUI } from '../../contexts/UIContext';
import type { Account } from '../../types';

const AccountsPage: React.FC = () => {
    const { accounts } = useAccounts();
    const { users } = useUsers();
    const { openCreateAccountModal } = useUI();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Account | 'ownerName'; direction: 'ascending' | 'descending' } | null>(null);

    const getOwnerName = (ownerId: string) => {
        return users[ownerId]?.name || 'Unknown';
    }
    
    const filteredAccounts = useMemo(() => {
        if (!searchQuery) return accounts;
        const lowercasedQuery = searchQuery.toLowerCase();
        return accounts.filter(account =>
            account.name.toLowerCase().includes(lowercasedQuery) ||
            account.industry.toLowerCase().includes(lowercasedQuery) ||
            account.website.toLowerCase().includes(lowercasedQuery)
        );
    }, [accounts, searchQuery]);

    const sortedAccounts = useMemo(() => {
        let sortableItems = [...filteredAccounts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key === 'ownerName') {
                    aValue = getOwnerName(a.ownerId);
                    bValue = getOwnerName(b.ownerId);
                } else {
                    aValue = a[sortConfig.key as keyof Account];
                    bValue = b[sortConfig.key as keyof Account];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredAccounts, sortConfig, users]);

    const requestSort = (key: keyof Account | 'ownerName') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Account | 'ownerName') => {
        if (!sortConfig || sortConfig.key !== key) {
          return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-40" />;
        }
        return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
    };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-2">
                    <Briefcase className="w-8 h-8" />
                    Accounts
                </h1>
                <p className="text-text-light mt-1">Manage your company accounts.</p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search accounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 w-full sm:w-40 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <button
                    onClick={openCreateAccountModal}
                    className="bg-primary text-white px-3 sm:px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-dark flex items-center flex-grow sm:flex-grow-0">
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Account</span>
                </button>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => requestSort('name')} className="flex items-center hover:text-gray-700">Account Name {getSortIcon('name')}</button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => requestSort('industry')} className="flex items-center hover:text-gray-700">Industry {getSortIcon('industry')}</button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => requestSort('phone')} className="flex items-center hover:text-gray-700">Phone {getSortIcon('phone')}</button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => requestSort('website')} className="flex items-center hover:text-gray-700">Website {getSortIcon('website')}</button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => requestSort('ownerName')} className="flex items-center hover:text-gray-700">Owner {getSortIcon('ownerName')}</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAccounts.map((account) => (
                        <tr key={account.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary hover:underline cursor-pointer">{account.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.industry}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <a href={`http://${account.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {account.website}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getOwnerName(account.ownerId)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AccountsPage;
