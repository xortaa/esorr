"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TestEntry {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
}

export default function TestPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEntries, setTestEntries] = useState<TestEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTestEntries();
  }, []);

  const fetchTestEntries = async () => {
    try {
      const response = await fetch("/api/test");
      if (response.ok) {
        const data = await response.json();
        setTestEntries(data);
      } else {
        throw new Error("Failed to fetch test entries");
      }
    } catch (error) {
      console.error("Error fetching test entries:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || !image) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("image", image);

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Test entry created successfully!");
        setFirstName("");
        setLastName("");
        setImage(null);
        fetchTestEntries(); // Refresh the list of test entries
      } else {
        throw new Error("Failed to create test entry");
      }
    } catch (error) {
      console.error("Error creating test entry:", error);
      alert("An error occurred while creating the test entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create Test Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="firstName">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className="input input-bordered w-full"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="lastName">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className="input input-bordered w-full"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="image">
                  <span className="label-text">Image</span>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Test Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Test Entries</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {testEntries.map((entry) => (
                    <tr key={entry._id}>
                      <td>{`${entry.firstName} ${entry.lastName}`}</td>
                      <td>
                        <div className="avatar">
                          <div className="w-12 h-12 rounded">
                            <Image
                              src={entry.image}
                              alt={`${entry.firstName} ${entry.lastName}`}
                              width={48}
                              height={48}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
