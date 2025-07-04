import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCode, FaDatabase, FaTools, FaProjectDiagram, FaTrophy, FaBriefcase, FaTimes } from "react-icons/fa";
import axios from "axios";

const StudentProfilePage = ({ UserDataData }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const BASEURL = process.env.REACT_APP_SAMPLE;

  useEffect(() => {
    if (UserDataData) {
      setStudentData(UserDataData);
      setEditedData(UserDataData);
      setLoading(false);
    }
  }, [UserDataData]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(studentData);
  };

  const handleClose = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError(null);
    setSuccess(false);

    const requestData = {
      Res_EmailId: studentData.emailId,
      Res_Name: editedData.Name,
      Res_PhoneNumber: editedData.PhoneNumber,
      Res_Address: editedData.Address,
      Res_TechinalSkillsProgrammingLanguage: editedData.TechinalSkillsProgrammingLanguage,
      Res_TechnicalSkillsFrameworks: editedData.TechnicalSkillsFrameworks,
      Res_TechnicalSkillsDatabase: editedData.TechnicalSkillsDatabase,
      Res_PastPerformanceProjectDetails: editedData.PastPerformanceProjectDetails,
      Res_PastPerformanceInternshipDetails: editedData.PastPerformanceInternshipDetails,
      Res_PastPerformanceHackathonDetails: editedData.PastPerformanceHackathonDetails
    };

    console.log('Sending update request to:', `${BASEURL}/ViewProfile/update`);
    console.log('Request data:', requestData);

    try {
      // First check if the server is running
      const healthCheckUrl = `${BASEURL.replace('/api/v1', '')}/health`;
      console.log('Checking server health at:', healthCheckUrl);
      const healthCheck = await axios.get(healthCheckUrl);
      console.log('Server health check:', healthCheck.data);

      // Log the full URL we're trying to access
      const updateUrl = `${BASEURL}/ViewProfile/update`;
      console.log('Attempting to update profile at:', updateUrl);

      const response = await axios.post(updateUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Update response:', response.data);

      if (response.data.status === "Success") {
        setStudentData(editedData);
        setSuccess(true);
        setTimeout(() => {
          setIsEditing(false);
          setSuccess(false);
        }, 2000);
      } else {
        console.error('Unexpected response:', response.data);
        setError(response.data.message || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error('Update error:', err);
      console.error('Error response:', err.response);
      console.error('Error config:', err.config);
      
      if (err.response?.status === 404) {
        if (err.config?.url?.includes('/health')) {
          setError("Server is not responding. Please check if the backend server is running.");
        } else if (err.config?.url?.includes('/ViewProfile/update')) {
          setError("Profile update endpoint is not available. Please try again later.");
        } else {
          setError(`The requested endpoint is not available. Please try again later. (URL: ${err.config?.url})`);
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while updating profile. Please try again.");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  className="h-full w-full object-cover"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.Name)}&background=4F46E5&color=fff&bold=true&size=128`}
                  alt="Profile"
                />
              </div>
            </div>
          </div>
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {studentData.Name || 'N/A'}
                </h1>
                <p className="text-lg text-gray-600">{studentData.emailId || 'N/A'}</p>
              </div>
              <button 
                onClick={handleEdit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-start text-left">
                <FaUser className="mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="space-y-4 w-full">
                <div className="flex flex-row items-center justify-start text-gray-600 text-left">
                  <FaEnvelope className="mr-3 text-blue-600" />
                  <span>{studentData.emailId || 'N/A'}</span>
                </div>
                <div className="flex flex-row items-center justify-start text-gray-600 text-left">
                  <FaPhone className="mr-3 text-blue-600" />
                  <span>{studentData.PhoneNumber || 'N/A'}</span>
                </div>
                <div className="flex flex-row items-center justify-start text-gray-600 text-left">
                  <FaMapMarkerAlt className="mr-3 text-blue-600" />
                  <span>{studentData.Address || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaCode className="mr-2 text-blue-600" />
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaCode className="mr-2 text-blue-600" />
                    Programming Languages
                  </h3>
                  <p className="text-gray-600">
                    {studentData.TechinalSkillsProgrammingLanguage || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaTools className="mr-2 text-blue-600" />
                    Frameworks & Libraries
                  </h3>
                  <p className="text-gray-600">
                    {studentData.TechnicalSkillsFrameworks || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaDatabase className="mr-2 text-blue-600" />
                    Database Technologies
                  </h3>
                  <p className="text-gray-600">
                    {studentData.TechnicalSkillsDatabase || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Past Performance */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaTrophy className="mr-2 text-blue-600" />
                Past Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaProjectDiagram className="mr-2 text-blue-600" />
                    Projects
                  </h3>
                  <p className="text-gray-600">
                    {studentData.PastPerformanceProjectDetails || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaTrophy className="mr-2 text-blue-600" />
                    Hackathons
                  </h3>
                  <p className="text-gray-600">
                    {studentData.PastPerformanceHackathonDetails || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-600" />
                    Internships
                  </h3>
                  <p className="text-gray-600">
                    {studentData.PastPerformanceInternshipDetails || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
                    Profile updated successfully!
                  </div>
                )}

                <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={editedData.Name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="PhoneNumber"
                      value={editedData.PhoneNumber || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="Address"
                      value={editedData.Address || ''}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Programming Languages
                    </label>
                    <textarea
                      name="TechinalSkillsProgrammingLanguage"
                      value={editedData.TechinalSkillsProgrammingLanguage || ''}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frameworks & Libraries
                    </label>
                    <textarea
                      name="TechnicalSkillsFrameworks"
                      value={editedData.TechnicalSkillsFrameworks || ''}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Database Technologies
                    </label>
                    <textarea
                      name="TechnicalSkillsDatabase"
                      value={editedData.TechnicalSkillsDatabase || ''}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Projects
                    </label>
                    <textarea
                      name="PastPerformanceProjectDetails"
                      value={editedData.PastPerformanceProjectDetails || ''}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hackathons
                    </label>
                    <textarea
                      name="PastPerformanceHackathonDetails"
                      value={editedData.PastPerformanceHackathonDetails || ''}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internships
                    </label>
                    <textarea
                      name="PastPerformanceInternshipDetails"
                      value={editedData.PastPerformanceInternshipDetails || ''}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-profile-form"
                  disabled={updateLoading}
                  className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] h-[40px]"
                  style={{ visibility: 'visible', opacity: 100 }}
                >
                  {updateLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;
