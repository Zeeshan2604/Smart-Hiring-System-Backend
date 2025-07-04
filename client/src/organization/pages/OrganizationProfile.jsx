import React, { useEffect, useState } from "react";
import { FiBriefcase, FiMail, FiPhone, FiLinkedin, FiGlobe, FiUsers, FiEdit2, FiMapPin, FiCheckCircle, FiActivity } from "react-icons/fi";
import axios from "axios";

const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-8 border-blue-600 transition-all hover:shadow-2xl">
    <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-3">
      {icon} <span>{title}</span>
    </h3>
    <div className="text-gray-700 text-lg space-y-2">{children}</div>
  </div>
);

const OrganizationProfile = ({ UserDataData }) => {
  const [OrgData, setOrgData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const BASEURL = process.env.REACT_APP_SAMPLE;

  useEffect(() => {
    setOrgData(UserDataData);
    setFormData(UserDataData);
    if (UserDataData) {
      setLoading(false);
    }
  }, [UserDataData]);

  const handleEditClick = () => {
    setFormData(OrgData);
    setEditMode(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        Res_EmailId: OrgData.emailId,
        Res_Name: formData.Name,
        Res_Industry: formData.Industry,
        Res_Founded: formData.Founded,
        Res_Location: formData.Location,
        Res_Website: formData.Website,
        Res_Size: formData.Size,
        Res_Specialities: formData.Specialities,
        Res_Mission: formData.Mission,
        Res_Projects: formData.Projects,
        Res_Technologies: formData.Technologies,
        Res_OpenPositions: formData.OpenPositions,
        Res_Description: formData.Description,
        Res_Linkedin: formData.Linkedin,
        Res_PhoneNumber: formData.PhoneNumber,
      };
      const res = await axios.post(`${BASEURL}/ViewProfile/update`, payload);
      if (res.data.status === "Success") {
        setOrgData(res.data.data);
        setEditMode(false);
        setSuccessMsg("Profile updated successfully!");
      } else {
        setErrorMsg(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      setErrorMsg("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-blue-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            <FiBriefcase className="text-blue-700 text-5xl drop-shadow" />
            <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight drop-shadow">Organization Profile</h1>
          </div>
          <p className="text-blue-700/70 text-lg text-center max-w-2xl">View and manage your organization details below. All information is kept confidential and secure.</p>
        </div>
        {successMsg && <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>}
        {errorMsg && <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>}
        {/* Main Card with Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* If in edit mode, show form */}
          {editMode ? (
            <form onSubmit={handleSave} className="col-span-2 bg-white rounded-2xl shadow-xl p-8 border-l-8 border-blue-600">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2"><FiEdit2 className="text-blue-600" /> Edit Organization Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold">Name</label>
                  <input name="Name" value={formData.Name || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Industry</label>
                  <input name="Industry" value={formData.Industry || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Founded</label>
                  <input name="Founded" value={formData.Founded || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Location</label>
                  <input name="Location" value={formData.Location || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Website</label>
                  <input name="Website" value={formData.Website || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Size</label>
                  <input name="Size" value={formData.Size || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Specialities</label>
                  <input name="Specialities" value={formData.Specialities || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                </div>
                <div>
                  <label className="font-semibold">Mission</label>
                  <input name="Mission" value={formData.Mission || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Projects</label>
                  <input name="Projects" value={formData.Projects || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Technologies</label>
                  <input name="Technologies" value={formData.Technologies || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Open Positions</label>
                  <input name="OpenPositions" value={formData.OpenPositions || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">About Organization</label>
                  <input name="Description" value={formData.Description || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">LinkedIn</label>
                  <input name="Linkedin" value={formData.Linkedin || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                  <label className="font-semibold">Phone</label>
                  <input name="PhoneNumber" value={formData.PhoneNumber || ''} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg mb-3" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                <button type="button" className="bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors" onClick={() => setEditMode(false)} disabled={saving}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <SectionCard icon={<FiActivity className="text-blue-600" />} title="Company Details">
                <div className="flex items-center"><FiBriefcase className="mr-2 text-blue-600" /> <span className="font-semibold">Organization Name:</span> <span className="ml-2">{OrgData.Name || 'N/A'}</span></div>
                <div className="flex items-center"><FiCheckCircle className="mr-2 text-blue-600" /> <span className="font-semibold">Founded:</span> <span className="ml-2">{OrgData.Founded || 'N/A'}</span></div>
                <div className="flex items-center"><FiMapPin className="mr-2 text-blue-600" /> <span className="font-semibold">Location:</span> <span className="ml-2">{OrgData.Location || 'N/A'}</span></div>
                <div className="flex items-center"><FiGlobe className="mr-2 text-blue-600" /> <span className="font-semibold">Website:</span> <a href={OrgData.Website} className="ml-2 text-blue-700 underline" target="_blank" rel="noopener noreferrer">{OrgData.Website || 'N/A'}</a></div>
                <div className="flex items-center"><FiUsers className="mr-2 text-blue-600" /> <span className="font-semibold">Size:</span> <span className="ml-2">{OrgData.Size || 'N/A'} employees</span></div>
                <div className="flex items-center"><FiCheckCircle className="mr-2 text-blue-600" /> <span className="font-semibold">Specialties:</span> <span className="ml-2">{OrgData.Specialities || 'N/A'}</span></div>
              </SectionCard>
              <SectionCard icon={<FiActivity className="text-blue-600" />} title="Mission">
                <span>{OrgData.Mission || 'N/A'}</span>
              </SectionCard>
              <SectionCard icon={<FiActivity className="text-blue-600" />} title="Projects">
                <span>{OrgData.Projects || 'N/A'}</span>
              </SectionCard>
              <SectionCard icon={<FiActivity className="text-blue-600" />} title="Technologies">
                <span>{OrgData.Technologies || 'N/A'}</span>
              </SectionCard>
              <SectionCard icon={<FiActivity className="text-blue-600" />} title="Open Positions">
                <span>{OrgData.OpenPositions || 'N/A'}</span>
              </SectionCard>
              <SectionCard icon={<FiActivity className="text-blue-600" />} title="About Organization">
                <span>{OrgData.Description || 'N/A'}</span>
              </SectionCard>
              <SectionCard icon={<FiActivity className="text-blue-600" />} title="Contact Information">
                <div className="flex items-center"><FiMail className="mr-2 text-blue-600" /> <span className="font-semibold">Email:</span> <a href={`mailto:${OrgData.emailId}`} className="ml-2 text-blue-700 underline">{OrgData.emailId || 'N/A'}</a></div>
                <div className="flex items-center"><FiPhone className="mr-2 text-blue-600" /> <span className="font-semibold">Phone:</span> <a href={`tel:${OrgData.PhoneNumber}`} className="ml-2 text-blue-700 underline">{OrgData.PhoneNumber || 'N/A'}</a></div>
                <div className="flex items-center"><FiLinkedin className="mr-2 text-blue-600" /> <span className="font-semibold">LinkedIn:</span> <a href={OrgData.Linkedin} className="ml-2 text-blue-700 underline" target="_blank" rel="noopener noreferrer">{OrgData.Linkedin || 'N/A'}</a></div>
              </SectionCard>
            </>
          )}
        </div>
        {/* Edit Button Floating */}
        {!editMode && (
          <div
            className="fixed right-8 z-50"
            style={{
              bottom: '32px',
              ...(window.innerWidth <= 768 ? { bottom: '80px', left: '50%', right: 'auto', transform: 'translateX(-50%)' } : {})
            }}
          >
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-full shadow-xl hover:bg-blue-800 transition-colors duration-200 font-bold text-xl"
            >
              <FiEdit2 /> Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationProfile;
