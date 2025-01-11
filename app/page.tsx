"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "@/components/edit";

type Siswa = {
  id: number;
  nama: string;
  kelas: string;
  umur: number;
};

export default function ManajemenSiswa() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [nama, setNama] = useState<string>("");
  const [kelas, setKelas] = useState<string>("");
  const [umur, setUmur] = useState<number>(0);
  const [editSiswa, setEditSiswa] = useState<Siswa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const response = await axios.get("http://localhost/php-backend/read.php");
      setSiswa(response.data);
    } catch (error) {
      console.error("Error fetching siswa:", error);
    }
  };

  const handleEditSiswa = (siswa: Siswa) => {
    setEditSiswa(siswa);
    setNama(siswa.nama);
    setKelas(siswa.kelas);
    setUmur(siswa.umur);
    setIsModalOpen(true);
  };

  const handleAddOrUpdateSiswa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editSiswa) {
        await axios.put("http://localhost/php-backend/update.php", {
          id: editSiswa.id,
          nama,
          kelas,
          umur,
        });
      } else {
        await axios.post("http://localhost/php-backend/create.php", {
          nama,
          kelas,
          umur,
        });
      }
      resetForm();
      fetchSiswa();
    } catch (error) {
      console.error("Error saving siswa:", error);
    }
  };

  const handleDeleteSiswa = async (id: number) => {
    try {
      await axios.delete("http://localhost/php-backend/delete.php", {
        data: { id },
      });
      fetchSiswa();
    } catch (error) {
      console.error("Error deleting siswa:", error);
    }
  };

  

  const resetForm = () => {
    setNama("");
    setKelas("");
    setUmur(0);
    setEditSiswa(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Siswa</h1>

      <form onSubmit={handleAddOrUpdateSiswa} className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="border p-2 rounded w-1/3"
            required
          />
          <input
            type="text"
            placeholder="Kelas"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="border p-2 rounded w-1/3"
            required
          />
          <input
            type="number"
            placeholder="Umur"
            value={umur}
            onChange={(e) => setUmur(Number(e.target.value))}
            className="border p-2 rounded w-1/3"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editSiswa ? "Update Siswa" : "Tambah Siswa"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Kelas</th>
            <th className="border p-2">Umur</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {siswa.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.nama}</td>
              <td className="border p-2">{item.kelas}</td>
              <td className="border p-2">{item.umur}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEditSiswa(item)}
                  className="bg-yellow-500 text-white p-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSiswa(item.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Edit Siswa</h2>
          <form onSubmit={handleAddOrUpdateSiswa}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Kelas"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                placeholder="Umur"
                value={umur}
                onChange={(e) => setUmur(Number(e.target.value))}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Simpan Perubahan
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}