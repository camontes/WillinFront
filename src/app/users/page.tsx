// src/app/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Users, Home, Pencil,Trash, Ellipsis, Search } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export default function UserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User & { password: string }>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const itemsPerPage = 5;

  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/users";
  if (!api) {
    throw new Error('API URL is not defined. Please set NEXT_PUBLIC_API_URL in your environment variables.');
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(api);
    setUsers(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if(!form.hasOwnProperty('isActive')) form.isActive = true;
    if (!form.name || !form.email || (!editingId && !form.password)) return;
    if (editingId) {
      await axios.put(`${api}/${editingId}`, form);
    } else {
      await axios.post(api, form);
    }
    setForm({});
    setEditingId(null);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm(user);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${api}/${id}`);
    fetchUsers();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-white shadow-md p-6 flex flex-col items-center">
      <div className="relative h-10 w-full mb-10">
            <Image
                src="/logoWillin.png"
                alt="Willinn Logo"
                width={150}
                height={150}
                className="object-contain"
            />
        </div>
        <nav className="w-full">
          <ul className="space-y-4">
            <li className="flex items-center text-gray-400 font-semibold cursor-pointer">
              <span className="mr-3 text-xl"><Home /></span> Inicio
            </li>
            <li className="flex items-center text-pink-600 font-bold cursor-pointer">
              <span className="mr-3 text-xl"><Users/></span> Usuarios
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Usuarios</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabla */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-lg font-semibold">Usuarios</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Buscar"
                    value={search}
                    onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                    }}
                    className="pl-9 pr-3 py-1 border rounded-full text-sm w-full"
                />
                </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Nombre</th>
                  <th>Correo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50" onMouseEnter={() => setHoveredUserId(user.id)}
                  onMouseLeave={() => setHoveredUserId(null)}>
                    <td className="py-2 text-gray-400 font-medium">{user.name}</td>
                    <td className='text-gray-400'>{user.email}</td>
                    <td className="space-x-2">
                      {
                        hoveredUserId === user.id ? (
                            <>
                                <button onClick={() => handleDelete(user.id)} className="text-pink-500"><Trash size={16} strokeWidth={3} /></button>
                                <button onClick={() => handleEdit(user)} className="text-gray-700"><Pencil size={16} strokeWidth={3}/></button>
                            </>
                        ):(
                            <button className="text-gray-700"><Ellipsis size={32} strokeWidth={3} /></button>
                        )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-2 text-pink-500 flex-wrap">
              <span onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="cursor-pointer">‹ Anterior</span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <span
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`px-2 py-1 rounded-full cursor-pointer ${n === currentPage ? 'bg-pink-500 text-white' : ''}`}
                >
                  {n}
                </span>
              ))}
              <span onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="cursor-pointer">Siguiente ›</span>
            </div>
          </div>

          {/* Formulario */}
          <div className="w-full lg:w-[400px] bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Agregar usuario</h2>
            <label>Nombre</label>
            <input name="name" placeholder="Introduce el nombre" value={form.name || ''} onChange={handleChange} className="block my-2 p-2 border w-full rounded text-sm" />
            <label>E-mail</label>
            <input name="email" type="email" placeholder="Introduce tu E-mail" value={form.email || ''} onChange={handleChange} className="block my-2 p-2 border w-full rounded text-sm" />
            {!editingId && (
              <>
              <label>Contraseña</label>
                <input name="password" placeholder="Introduce tu contraseña" type="password" value={form.password || ''} onChange={handleChange} className="block my-2 p-2 border w-full rounded text-sm" />
              </>
            )}
            <div className="flex my-2">
                <label htmlFor="isActive" className="text-sm font-medium text-gray-900 mr-4">Activar</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                    id="isActive"
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive ?? true}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-teal-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-500 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                </label>
            </div>
            <button onClick={handleSubmit} className="bg-purple-600 text-white w-full py-2 rounded mt-2">
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
