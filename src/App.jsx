import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";

// Library Imports
import { Document, Page, pdfjs } from "react-pdf";
import { Editor } from "@tinymce/tinymce-react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "react-big-calendar/lib/css/react-big-calendar.css";

// --- Configure worker for react-pdf ---
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:2025"; // Your backend URL

// --- Date Localizer for Calendar ---
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// --- Theme Management ---
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- Helper Components ---

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      {theme === "light" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      )}
    </button>
  );
};

const Header = ({ onShowAddPage, onNavigate, activeView }) => {
  const getLinkClass = (viewName) =>
    `cursor-pointer px-3 py-2 rounded-md text-sm font-medium ${
      activeView === viewName
        ? "bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-white"
        : "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md mb-6 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                JobTracker
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <span
                  onClick={() => onNavigate("dashboard")}
                  className={getLinkClass("dashboard")}
                >
                  Dashboard
                </span>
                <span
                  onClick={() => onNavigate("calendar")}
                  className={getLinkClass("calendar")}
                >
                  Calendar
                </span>
                <span
                  onClick={() => onNavigate("reports")}
                  className={getLinkClass("reports")}
                >
                  Reports
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={onShowAddPage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Job
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

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
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {statusCounts[status] || 0}
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
            {status}
          </p>
        </div>
      ))}
    </div>
  );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
    <div className="relative flex-grow">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Filter Jobs..."
        className="w-full p-2 pl-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
      <div className="text-center p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md">
        Loading applications...
      </div>
    );
  }
  if (jobs.length === 0) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md">
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
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300 uppercase text-sm">
            <SortableHeader name="jobPosition">Job Position</SortableHeader>
            <SortableHeader name="company">Company</SortableHeader>
            <SortableHeader name="location">Location</SortableHeader>
            <SortableHeader name="status">Status</SortableHeader>
            <SortableHeader name="dateSaved">Date Saved</SortableHeader>
            <th className="py-3 px-5 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-300">
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-4 px-5 font-semibold text-gray-900 dark:text-white">
                {job.jobUrl ? (
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {job.jobPosition}
                  </a>
                ) : (
                  job.jobPosition
                )}
              </td>
              <td className="py-4 px-5">{job.company}</td>
              <td className="py-4 px-5">{job.location}</td>
              <td className="py-4 px-5">
                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700 rounded-full">
                  {job.status}
                </span>
              </td>
              <td className="py-4 px-5">
                {new Date(job.dateSaved).toLocaleDateString()}
              </td>
              <td className="py-4 px-5 text-center">
                <button
                  onClick={() => onEdit(job)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(job.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
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

const PdfViewerModal = ({ fileUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            PDF Viewer
          </h3>
          <button
            onClick={onClose}
            className="text-gray-800 dark:text-gray-100 font-bold text-2xl hover:text-red-500"
          >
            &times;
          </button>
        </div>
        <div className="pdf-container">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
            loading="Loading PDF..."
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

const JobForm = ({ initialJob, onSave, onCancel, isEditing }) => {
  const [job, setJob] = useState(initialJob);
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    setJob(initialJob);
  }, [initialJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };
  const handleEditorChange = (content, editor) => {
    setJob((prevJob) => ({ ...prevJob, jobDescription: content }));
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {isEditing ? "Edit" : "Add"} Application
        </h1>
        <button
          onClick={onCancel}
          className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg"
        >
          &larr; Back to List
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600 pb-2">
                Job Details
              </h3>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Job Position
              </label>
              <input
                type="text"
                name="jobPosition"
                value={job.jobPosition || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={job.company || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={job.location || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Max Salary (Optional)
              </label>
              <input
                type="number"
                name="maxSalary"
                value={job.maxSalary || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Job Source
              </label>
              <input
                type="text"
                name="jobSource"
                value={job.jobSource || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Job URL
              </label>
              <input
                type="url"
                name="jobUrl"
                value={job.jobUrl || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Job Description
              </label>
              <Editor
                apiKey="9nnfzl9bp9yteyr4agsr3ikgfrnox3xml4ktziuyonr5obg0"
                value={job.jobDescription || ""}
                onEditorChange={handleEditorChange}
                init={{
                  height: 350,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  skin: theme === "dark" ? "oxide-dark" : "oxide",
                  content_css: theme === "dark" ? "dark" : "default",
                }}
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600 pb-2">
                Application Status
              </h3>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={job.status}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                Date Applied
              </label>
              <input
                type="date"
                name="dateApplied"
                value={job.dateApplied ? job.dateApplied.substring(0, 10) : ""}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
          {isEditing && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600 pb-2 mb-4">
                Documents
              </h3>
              <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
              <ul>
                {job.documents &&
                  job.documents.map((doc, index) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2"
                    >
                      <span className="truncate pr-4">{doc.fileName}</span>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        {doc.contentType === "application/pdf" && (
                          <button
                            type="button"
                            onClick={() =>
                              setViewingPdfUrl(
                                `${API_BASE_URL}/api/document/view/${doc.id}`
                              )
                            }
                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                          >
                            View
                          </button>
                        )}
                        <a
                          href={`${API_BASE_URL}/api/document/download/${doc.id}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Download
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id, index)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 4.8.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716C7.59 2.75 6.68 3.704 6.68 4.884v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end mt-8 border-t dark:border-gray-600 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded mr-2"
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
      {viewingPdfUrl && (
        <PdfViewerModal
          fileUrl={viewingPdfUrl}
          onClose={() => setViewingPdfUrl(null)}
        />
      )}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState("dashboard");
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
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
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
      handleNavigate("dashboard");
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this job and all its documents?"
      )
    ) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/jobapplication/${id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to delete job");
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
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

  const handleNavigate = (newView) => {
    setView(newView);
    setCurrentJob(null);
    setIsEditing(false);
  };
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

  const DashboardPage = () => (
    <>
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
  );

  const ReportsPage = () => {
    const { theme } = useContext(ThemeContext);
    const applicationsByStatus = useMemo(() => {
      const counts = jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(counts).map((key) => ({
        name: key,
        count: counts[key],
      }));
    }, [jobs]);
    const applicationsOverTime = useMemo(() => {
      const counts = jobs.reduce((acc, job) => {
        const month = format(new Date(job.dateSaved), "yyyy-MM");
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(counts)
        .sort()
        .map((key) => ({ name: key, count: counts[key] }));
    }, [jobs]);
    const chartTextColor = theme === "dark" ? "#f3f4f6" : "#374151";
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Applications by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationsByStatus}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis dataKey="name" tick={{ fill: chartTextColor }} />
              <YAxis tick={{ fill: chartTextColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  border: `1px solid ${
                    theme === "dark" ? "#4b5563" : "#e5e7eb"
                  }`,
                }}
              />
              <Legend wrapperStyle={{ color: chartTextColor }} />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Applications Over Time (by Date Saved)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationsOverTime}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis dataKey="name" tick={{ fill: chartTextColor }} />
              <YAxis tick={{ fill: chartTextColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  border: `1px solid ${
                    theme === "dark" ? "#4b5563" : "#e5e7eb"
                  }`,
                }}
              />
              <Legend wrapperStyle={{ color: chartTextColor }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const CalendarPage = () => {
    const events = useMemo(
      () =>
        jobs
          .filter((job) => job.dateApplied)
          .map((job) => ({
            id: job.id,
            title: `${job.jobPosition} @ ${job.company}`,
            start: new Date(job.dateApplied),
            end: new Date(job.dateApplied),
            allDay: true,
          })),
      [jobs]
    );
    return (
      <div
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-gray-800 dark:text-gray-100"
        style={{ height: "75vh" }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (view === "form") {
      return (
        currentJob && (
          <JobForm
            initialJob={currentJob}
            onSave={handleSaveJob}
            onCancel={() => handleNavigate("dashboard")}
            isEditing={isEditing}
          />
        )
      );
    }
    switch (view) {
      case "dashboard":
        return <DashboardPage />;
      case "calendar":
        return <CalendarPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ThemeProvider>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Header
              onShowAddPage={showAddPage}
              onNavigate={handleNavigate}
              activeView={view}
            />
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading data...
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
