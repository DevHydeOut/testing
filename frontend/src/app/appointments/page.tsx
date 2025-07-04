// 📁 apps/web/app/appointments/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Appointment {
  id: number;
  customer_id: number;
  reason: string;
  time: string; // ISO string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    customer_id: 0,
    reason: '',
    time: '',
  });

  const fetchAppointments = () => {
    fetch('http://localhost:4000/crm/appointments')
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreate = async () => {
    const res = await fetch('http://localhost:4000/crm/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppointment),
    });
    if (res.ok) {
      fetchAppointments();
      setNewAppointment({ customer_id: 0, reason: '', time: '' });
    }
  };

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Appointment</h2>
          <input
            type="number"
            placeholder="Customer ID"
            value={newAppointment.customer_id}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, customer_id: parseInt(e.target.value) })
            }
            className="border px-3 py-2 w-full mb-3 rounded"
          />
          <input
            placeholder="Reason"
            value={newAppointment.reason}
            onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
            className="border px-3 py-2 w-full mb-3 rounded"
          />
          <input
            type="datetime-local"
            value={newAppointment.time}
            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            className="border px-3 py-2 w-full mb-3 rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Appointment
          </button>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            <table className="table-auto w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Customer ID</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="text-gray-700">
                    <td className="border px-4 py-2">{a.id}</td>
                    <td className="border px-4 py-2">{a.customer_id}</td>
                    <td className="border px-4 py-2">{a.reason}</td>
                    <td className="border px-4 py-2">{new Date(a.time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
