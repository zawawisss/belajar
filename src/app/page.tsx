"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

interface Item {
  _id: string;
  title: string;
  description?: string;
  price: number;
}

export default function HomePage() {
  const { data, error, mutate } = useSWR<{ data: Item[] }>(
    "/api/items",
    fetcher
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update item
      await fetch(`/api/items?id=${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
        }),
      });
    } else {
      // Buat item baru
      await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
        }),
      });
    }
    setFormData({ title: "", description: "", price: "" });
    setEditingId(null);
    mutate();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/items?id=${id}`, { method: "DELETE" });
    mutate();
  };

  const startEdit = (item: Item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description || "",
      price: String(item.price),
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">My CRUD App</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 13h16M4 17h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {/* Form untuk Create/Update */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">
              {editingId ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Title"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <input
                  type="text"
                  placeholder="Description"
                  className="input input-bordered"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  placeholder="Price"
                  className="input input-bordered"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update" : "Create"}
                  {editingId ? (
                    <PencilIcon className="w-5 h-5 ml-2" />
                  ) : (
                    <PlusIcon className="w-5 h-5 ml-2" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Daftar Item */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data?.data &&
            data.data.map((item: Item) => (
              <div key={item._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{item.title}</h2>
                  <p>{item.description}</p>
                  <p className="text-sm">Price: Rp {item.price}</p>
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => startEdit(item)}
                      className="btn btn-sm btn-warning"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-sm btn-error"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {error && <div>Error fetching data</div>}
        </div>
      </div>
    </div>
  );
}
