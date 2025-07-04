// 📁 apps/web - Frontend (Next.js with Tailwind & Typescript)

// File: apps/web/app/page.tsx
'use client';

import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCustomers = () => {
    fetch("http://localhost:4000/crm/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setFiltered(data);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this customer?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:4000/crm/customers/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setFiltered((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    const filteredData = customers.filter((customer) =>
      Object.values(customer).some((value) =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setFiltered(filteredData);
    setCurrentPage(1);
  };

  const handleUpdate = async () => {
    if (!selectedCustomer) return;

    const isNew = selectedCustomer.id === 0;
    const method = isNew ? "POST" : "PUT";
    const url = isNew
      ? "http://localhost:4000/crm/customers"
      : `http://localhost:4000/crm/customers/${selectedCustomer.id}`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedCustomer),
    });

    if (res.ok) {
      fetchCustomers();
      setModalOpen(false);
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setSelectedCustomer({ id: 0, name: "", email: "", phone: "" });
                setModalOpen(true);
              }}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              + Add Customer
            </button>

            <label className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={() => {}}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No customers found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-2">{customer.name}</td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">{customer.phone}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDelete(customer.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-6 px-4 py-2">
              <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && selectedCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {selectedCustomer.id === 0 ? "Add Customer" : "Edit Customer"}
              </h2>
              <input
                className="mb-3 w-full border px-3 py-2 rounded"
                value={selectedCustomer.name}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                placeholder="Name"
              />
              <input
                className="mb-3 w-full border px-3 py-2 rounded"
                value={selectedCustomer.email}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                placeholder="Email"
              />
              <input
                className="mb-4 w-full border px-3 py-2 rounded"
                value={selectedCustomer.phone}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                placeholder="Phone"
              />

              <div className="flex justify-end space-x-2">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
                <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                  {selectedCustomer.id === 0 ? "Add" : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}