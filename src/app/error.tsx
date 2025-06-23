"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-9xl font-extrabold text-blue-500">😞</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-700">
        Algo deu errado.
      </h2>
      <p className="mt-2 text-gray-500 max-w-md text-center">
        Algo deu errado ao carregar esta página. Por favor, tente novamente.
      </p>
    </main>
  );
}
