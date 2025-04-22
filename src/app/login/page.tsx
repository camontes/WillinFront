// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/users';
      const loginUrl = `${apiUrl}/login`;
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Credenciales incorrectas');

      const user = await res.json();
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/users');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Inicia sesión</h2>

        <label className="block mb-2">E-mail</label>
        <input
          type="email"
          placeholder='Introduce tu email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2">Contraseña</label>
        <div className='relative'>
            <input
            type={showPassword ? "text" : "password"}
            placeholder='Introduce tu contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             className="w-full px-4 py-2 pr-10 border rounded-md text-sm text-gray-900 placeholder-gray-400 border-gray-300"
            required
            />
            <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <button type="submit" className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded mt-3">
          Ingresar
        </button>
        <label className='float-right text-gray-600'>Olvidaste la contraseña?</label>
      </form>
    </div>
  );
}
