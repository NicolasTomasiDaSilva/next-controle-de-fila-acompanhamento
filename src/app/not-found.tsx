"use client";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-9xl font-extrabold text-blue-500">404</h1>
      <p className="mt-4 text-xl text-gray-700">Ops! Página não encontrada.</p>
      <p className="mt-2 text-gray-500">
        A página que você está procurando não existe ou foi removida.
      </p>
    </div>
  );
}
