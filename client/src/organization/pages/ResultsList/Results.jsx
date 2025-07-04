import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FiUsers, FiBarChart2, FiEye, FiSearch, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from '../../../Snackbar/Snackbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tooltip } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function Results({ UserDataData }) {
  const [tempUserData, setTemUserData] = useState({});
  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [status, setStatus] = useState('');
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const ViewInterviewResults = async () => {
    try {
      console.log('[Results] Fetching interview results for org:', tempUserData.Name);
      const Temp = await axios.post(`${BASEURL}/FindResult`, {
        Res_Company_Name: tempUserData.Name,
      });
      console.log('[Results] Backend response:', Temp.data);
      if (Temp.data.message === "Interview result found successfully !") {
        setResultList(Temp.data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('[Results] Error fetching interview results:', err);
      setLoading(false);
      showSnackbar('Failed to fetch interview results.', 'error');
    }
  };

  useEffect(() => {
    setTemUserData(UserDataData);
    console.log('[Results] useEffect set tempUserData:', UserDataData);
  }, [UserDataData]);

  useEffect(() => {
    if (tempUserData && tempUserData.Name) {
      console.log('[Results] useEffect triggered, tempUserData:', tempUserData);
      ViewInterviewResults();
    }
    // eslint-disable-next-line
  }, [tempUserData]);

  // Optimized filtered and sorted results using useMemo and a single loop
  const filteredResults = useMemo(() => {
    return resultList.reduce((acc, Item) => {
      // Search filter
      if (search && !(
        (Item.Candidate_Name && Item.Candidate_Name.toLowerCase().includes(search.toLowerCase())) ||
        (Item.Candidate_Email && Item.Candidate_Email.toLowerCase().includes(search.toLowerCase()))
      )) return acc;
      // Date filter
      if (startDate && endDate) {
        const date = new Date(Item.Date_Of_Interview);
        if (!(date >= startDate && date <= endDate)) return acc;
      }
      // Score range filter
      const score = Item.Text_Percentage || 0;
      if (!(score >= scoreRange[0] && score <= scoreRange[1])) return acc;
      // Status filter
      if (status) {
        if (status === 'passed' && !(score >= 60)) return acc;
        if (status === 'failed' && !(score < 60 && score !== undefined)) return acc;
        if (status === 'pending' && score !== undefined) return acc;
      }
      acc.push(Item);
      return acc;
    }, []);
  }, [resultList, search, startDate, endDate, scoreRange, status]);

  // Optimized sort using useMemo
  const sortedResults = useMemo(() => {
    if (!sortType) return filteredResults;
    const sorted = [...filteredResults];
    if (sortType === "name") {
      sorted.sort((a, b) => (a.Candidate_Name || "").localeCompare(b.Candidate_Name || ""));
    } else if (sortType === "performance") {
      sorted.sort((a, b) => (b.Text_Percentage || 0) - (a.Text_Percentage || 0));
    } else if (sortType === "time") {
      sorted.sort((b, a) => (b.Time_Percentage || 0) - (a.Time_Percentage || 0));
    } else if (sortType === "interview") {
      sorted.sort((a, b) => (a.Name_Technology || "").localeCompare(b.Name_Technology || ""));
    }
    return sorted;
  }, [filteredResults, sortType]);

  // Pagination logic
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const paginatedResults = useMemo(() => sortedResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage), [sortedResults, currentPage, resultsPerPage]);

  // Memoize top performers
  const topPerformers = useMemo(() => {
    return sortedResults
      .filter(r => r.Text_Percentage !== undefined)
      .sort((a, b) => (b.Text_Percentage || 0) - (a.Text_Percentage || 0))
      .slice(0, 3)
      .map(r => r._id);
  }, [sortedResults]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Interview Name', 'Performance Score (%)', 'Time Score (%)', 'Date', 'Status'
    ];
    const rows = sortedResults.map(Item => [
      Item.Candidate_Name,
      Item.Candidate_Email,
      Item.Name_Technology || '-',
      Item.Text_Percentage !== undefined ? Item.Text_Percentage.toFixed(2) : '',
      Item.Time_Percentage !== undefined ? Item.Time_Percentage.toFixed(2) : '',
      Item.Date_Of_Interview ? new Date(Item.Date_Of_Interview).toLocaleDateString() : '',
      Item.Text_Percentage === undefined ? 'Pending' : (Item.Text_Percentage >= 60 ? 'Passed' : 'Failed')
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',') + '\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'interview_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSnackbar('Exported results to CSV!', 'success');
  };

  const handleRowClick = (item) => {
    setModalData(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-blue-700 font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            <FiBarChart2 className="text-blue-700 text-5xl drop-shadow" />
            <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight drop-shadow">Interview Results</h1>
          </div>
          <p className="text-blue-700/70 text-lg text-center max-w-2xl">View the performance and time scores of all candidates for your interviews.</p>
          <div className="flex w-full justify-end mt-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow font-semibold"
              onClick={exportToCSV}
            >
              <FiDownload /> Export CSV
            </button>
          </div>
          {/* Search Bar, Sort Dropdown, and Filters below header */}
          <div className="flex flex-wrap items-center justify-between w-full mt-8 mb-2 px-2 gap-4">
            <div className="flex items-center gap-2">
              <FiSearch className="text-blue-700 text-2xl" />
              <input
                type="text"
                className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[220px]"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-700">Sort by:</span>
              <select
                className="px-2 py-1 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-700 font-semibold"
                value={sortType}
                onChange={e => setSortType(e.target.value)}
              >
                <option value="">None</option>
                <option value="name">Name</option>
                <option value="performance">Performance Score</option>
                <option value="time">Time Score</option>
                <option value="interview">Interview Name</option>
              </select>
            </div>
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-700">Date:</span>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="Select date range"
                className="px-2 py-1 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-700 font-semibold"
              />
            </div>
            {/* Score Range Filter */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-700">Score:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={scoreRange[0]}
                onChange={e => setScoreRange([Number(e.target.value), scoreRange[1]])}
                className="w-14 px-2 py-1 border border-blue-300 rounded"
                aria-label="Min Score"
              />
              <span>-</span>
              <input
                type="number"
                min={0}
                max={100}
                value={scoreRange[1]}
                onChange={e => setScoreRange([scoreRange[0], Number(e.target.value)])}
                className="w-14 px-2 py-1 border border-blue-300 rounded"
                aria-label="Max Score"
              />
            </div>
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-700">Status:</span>
              <select
                className="px-2 py-1 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-700 font-semibold"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col border-l-8 border-blue-600 relative overflow-hidden">
          <div className="absolute -top-8 left-8 opacity-10 text-[8rem] pointer-events-none select-none">
            <FiUsers />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2 z-10">
            <FiBarChart2 className="text-blue-600" /> Candidate Results
          </h2>
          <div className="overflow-x-auto z-10" style={{ maxWidth: '100vw' }}>
            <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Interview Results Table">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    <Tooltip title="Candidate's full name" arrow><span>Name</span></Tooltip>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    <Tooltip title="Candidate's email address" arrow><span>Email</span></Tooltip>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    <Tooltip title="Technology or interview name" arrow><span>Interview Name</span></Tooltip>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    <Tooltip title="Performance score as a percentage" arrow><span>Performance Score (%)</span></Tooltip>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    <Tooltip title="Time score as a percentage" arrow><span>Time Score (%)</span></Tooltip>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    <Tooltip title="Result status (Passed, Failed, Pending)" arrow><span>Status</span></Tooltip>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    <Tooltip title="View full result details" arrow><span>Action</span></Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedResults.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-24">
                      <div className="flex flex-col items-center justify-center min-h-[240px] h-full w-full">
                        <FiBarChart2 className="text-4xl mb-2 animate-bounce text-blue-400" />
                        <span className="text-blue-600 text-xl font-semibold text-center">No interview results available.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((Item, index) => {
                    const status = Item.Text_Percentage === undefined ? 'Pending' : (Item.Text_Percentage >= 60 ? 'Passed' : 'Failed');
                    const isTopPerformer = topPerformers.includes(Item._id);
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-blue-50 transition-colors ${isTopPerformer ? 'ring-2 ring-green-400' : ''} ${modalData && modalData._id === Item._id ? 'bg-blue-100' : ''}`}
                        style={isTopPerformer ? { fontWeight: 700, background: '#f0fdf4' } : {}}
                        tabIndex={0}
                        aria-label={`View details for ${Item.Candidate_Name}`}
                        aria-selected={modalData && modalData._id === Item._id}
                        onClick={e => { if (e.target.tagName !== 'BUTTON') handleRowClick(Item); }}
                        onKeyDown={e => { if (e.key === 'Enter') handleRowClick(Item); }}
                        role="row"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{Item.Candidate_Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{Item.Candidate_Email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{Item.Name_Technology || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{Item.Text_Percentage !== undefined ? Item.Text_Percentage.toFixed(2) : ''}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{Item.Time_Percentage !== undefined ? Item.Time_Percentage.toFixed(2) : ''}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'Passed' ? 'bg-green-100 text-green-700' : status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
                          {isTopPerformer && <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">Top</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition-colors font-semibold"
                            onClick={() => {
                              console.log('View Result clicked, _id:', Item._id);
                              navigate(`/viewresult/${Item._id}`);
                            }}
                          >
                            <FiEye /> View Result
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white font-bold disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="font-semibold text-blue-700">Page {currentPage} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white font-bold disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
        {/* Modal for detail view */}
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="interview-result-detail-title"
          aria-describedby="interview-result-detail-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '2px solid #1976d2',
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            outline: 'none',
          }}
            tabIndex={-1}
            role="dialog"
          >
            {modalData && (
              <div>
                <h2 id="interview-result-detail-title" className="text-2xl font-bold mb-4 text-blue-700">Interview Result Details</h2>
                <div className="mb-2"><b>Name:</b> {modalData.Candidate_Name}</div>
                <div className="mb-2"><b>Email:</b> {modalData.Candidate_Email}</div>
                <div className="mb-2"><b>Interview Name:</b> {modalData.Name_Technology || '-'}</div>
                <div className="mb-2"><b>Date:</b> {modalData.Date_Of_Interview ? new Date(modalData.Date_Of_Interview).toLocaleString() : '-'}</div>
                <div className="mb-2"><b>Performance Score:</b> {modalData.Text_Percentage !== undefined ? modalData.Text_Percentage.toFixed(2) : '-'}%</div>
                <div className="mb-2"><b>Time Score:</b> {modalData.Time_Percentage !== undefined ? modalData.Time_Percentage.toFixed(2) : '-'}%</div>
                <div className="mb-2"><b>Status:</b> {modalData.Text_Percentage === undefined ? 'Pending' : (modalData.Text_Percentage >= 60 ? 'Passed' : 'Failed')}</div>
                <div className="mb-2"><b>HR Name:</b> {modalData.HR_Name || '-'}</div>
                <div className="mb-2"><b>Company:</b> {modalData.Company_Name || '-'}</div>
                <div className="mb-2"><b>Number of Questions:</b> {modalData.Number_Of_Questions || '-'}</div>
                <div className="mb-2"><b>Duration:</b> {modalData.Time_Duration || '-'} min</div>
                <div className="mb-2"><b>Overall %:</b> {modalData.Overall_Percentage !== undefined ? modalData.Overall_Percentage.toFixed(2) : '-'}</div>
                {/* Add more details as needed */}
                <button
                  className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold"
                  onClick={handleModalClose}
                  autoFocus
                >
                  Close
                </button>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Results;
