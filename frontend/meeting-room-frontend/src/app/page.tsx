"use client";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Boka ett rum</h1>
      <button
        onClick={() => router.push('/rooms')}
        className="bg-black text-white py-3 px-6 rounded-lg text-lg"
      >
        Boka
      </button>
    </div>
  );
}
