import React, { useState, useEffect, useMemo } from "react";

// --- Configuration ---
const API_BASE_URL = "https://localhost:7012"; // IMPORTANT: CHANGE TO YOUR BACKEND URL

// --- Helper Components ---

const Header = ({ onShowAddPage }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-800">
      Job Application Tracker
    </h1>
    <button
      onClick={onShowAddPage}
      className="mt-4 sm:mt-0 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Add a New Job
    </button>
  </div>
);

const StatusSummary = ({ jobs }) => {
  const statusList = [
    "Bookmarked",
    "Applying",
    "Applied",
    "Interviewing",
    "Negotiating",
    "Accepted",
  ];
  const statusCounts = useMemo(() => {
    return jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});
  }, [jobs]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statusList.map((status) => (
        <div
          key={status}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
        >
          <p className="text-2xl font-bold text-gray-800">
            {statusCounts[status] || 0}
          </p>
          <p className="text-sm font-medium text-gray-500 uppercase">
            {status}
          </p>
        </div>
      ))}
    </div>
  );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
    <div className="relative flex-grow">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Filter Jobs..."
        className="w-full p-2 pl-10 border rounded-lg"
      />
      <svg
        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </div>
  </div>
);

const JobList = ({ jobs, loading, onEdit, onDelete, onSort, sortConfig }) => {
  if (loading) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        Loading applications...
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        No job applications found.
      </div>
    );
  }

  const SortableHeader = ({ children, name }) => {
    const isSorted = sortConfig.key === name;
    const icon = isSorted ? (sortConfig.direction === "asc" ? "▲" : "▼") : "";
    return (
      <th onClick={() => onSort(name)} className="py-3 px-5 cursor-pointer">
        {children} <span className="text-xs">{icon}</span>
      </th>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm">
            <SortableHeader name="jobPosition">Job Position</SortableHeader>
            <SortableHeader name="company">Company</SortableHeader>
            <SortableHeader name="location">Location</SortableHeader>
            <SortableHeader name="status">Status</SortableHeader>
            <SortableHeader name="dateSaved">Date Saved</SortableHeader>
            <th className="py-3 px-5 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-4 px-5 font-semibold">{job.jobPosition}</td>
              <td className="py-4 px-5">{job.company}</td>
              <td className="py-4 px-5">{job.location}</td>
              <td className="py-4 px-5">
                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                  {job.status}
                </span>
              </td>
              <td className="py-4 px-5">
                {new Date(job.dateSaved).toLocaleDateString()}
              </td>
              <td className="py-4 px-5 text-center">
                <button
                  onClick={() => onEdit(job)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(job.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const JobForm = ({ initialJob, onSave, onCancel, isEditing }) => {
  const [job, setJob] = useState(initialJob);

  useEffect(() => {
    setJob(initialJob);
  }, [initialJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !job.id) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/document/${job.id}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("File upload failed");
      const newDoc = await response.json();
      setJob((prevJob) => ({
        ...prevJob,
        documents: [...prevJob.documents, newDoc],
      }));
      e.target.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDocument = async (docId, index) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/document/${docId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete document");
        setJob((prevJob) => ({
          ...prevJob,
          documents: prevJob.documents.filter((_, i) => i !== index),
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(job);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditing ? "Edit" : "Add"} Application
        </h1>
        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
        >
          &larr; Back to List
        </button>
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Job Details
              </h3>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Job Position
              </label>
              <input
                type="text"
                name="jobPosition"
                value={job.jobPosition || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={job.company || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={job.location || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Max Salary (Optional)
              </label>
              <input
                type="number"
                name="maxSalary"
                value={job.maxSalary || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Job Source
              </label>
              <input
                type="text"
                name="jobSource"
                value={job.jobSource || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Job URL
              </label>
              <input
                type="url"
                name="jobUrl"
                value={job.jobUrl || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-600">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={job.jobDescription || ""}
                onChange={handleChange}
                rows="6"
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Application Status
              </h3>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Status
              </label>
              <select
                name="status"
                value={job.status}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
                required
              >
                <option>Bookmarked</option>
                <option>Applying</option>
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Negotiating</option>
                <option>Accepted</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Date Applied
              </label>
              <input
                type="date"
                name="dateApplied"
                value={job.dateApplied ? job.dateApplied.substring(0, 10) : ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          {isEditing && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                Documents
              </h3>
              <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <ul>
                {job.documents &&
                  job.documents.map((doc, index) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2"
                    >
                      <a
                        href={`${API_BASE_URL}/api/document/download/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {doc.fileName}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716C7.59 2.75 6.68 3.704 6.68 4.884v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end mt-8 border-t pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState("list");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "dateSaved",
    direction: "desc",
  });

  const initialJobState = {
    id: null,
    jobPosition: "",
    company: "",
    location: "",
    maxSalary: null,
    status: "Bookmarked",
    dateApplied: null,
    jobUrl: "",
    jobDescription: "",
    jobSource: "",
    documents: [],
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobapplication`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      setJobs(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobToSave) => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${API_BASE_URL}/api/jobapplication/${jobToSave.id}`
      : `${API_BASE_URL}/api/jobapplication`;
    const payload = { ...jobToSave };
    delete payload.documents;
    if (!isEditing) delete payload.id;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save job");
      setView("list");
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/jobapplication/${id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to delete job");
        fetchJobs();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(
      (job) =>
        job.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.location &&
          job.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "dateSaved") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [jobs, searchTerm, sortConfig]);

  const showAddPage = () => {
    setIsEditing(false);
    setCurrentJob(initialJobState);
    setView("form");
  };

  const showEditPage = (job) => {
    setIsEditing(true);
    setCurrentJob({ ...job });
    setView("form");
  };

  const showListPage = () => {
    setView("list");
    setCurrentJob(null);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {view === "list" ? (
          <>
            <Header onShowAddPage={showAddPage} />
            <StatusSummary jobs={jobs} />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <JobList
              jobs={filteredAndSortedJobs}
              loading={loading}
              onEdit={showEditPage}
              onDelete={handleDeleteJob}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          </>
        ) : (
          currentJob && (
            <JobForm
              initialJob={currentJob}
              onSave={handleSaveJob}
              onCancel={showListPage}
              isEditing={isEditing}
            />
          )
        )}
      </div>
    </div>
  );
}
