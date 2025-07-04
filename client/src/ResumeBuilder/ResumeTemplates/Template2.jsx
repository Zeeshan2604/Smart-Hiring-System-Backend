// Template2.js (Enhanced Modern Look)
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Template2 = ({ basicinfo, eduinfo, workinfo, preview = false }) => {
  const { name, designation, email, phone, objective, git, lin, skills, image } = basicinfo || {};
  const education = eduinfo?.education || [];
  const work = workinfo?.work || [];
  const skillList = (skills || "").split(",").map(s => s.trim()).filter(Boolean);
  const componentRef = useRef();

  // Always call the hook
  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  if (preview) {
  return (
      <div ref={componentRef} className="bg-white w-[800px] min-h-[1122px] px-12 py-10 shadow-2xl rounded-xl border border-gray-200 text-gray-900 font-sans print:shadow-none print:border-none">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-blue-900">{name}</h1>
            <h2 className="text-2xl text-gray-600 mt-1">{designation}</h2>
          </div>
          {image && <img src={image} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg" />}
            </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-10 text-sm mb-6">
          <div><span className="font-semibold">📧 Email:</span> {email}</div>
          <div><span className="font-semibold">📞 Phone:</span> {phone}</div>
          <div><span className="font-semibold">💻 GitHub:</span> <a href={git} className="text-blue-600 underline">{git}</a></div>
          <div><span className="font-semibold">🔗 LinkedIn:</span> <a href={lin} className="text-blue-600 underline">{lin}</a></div>
            </div>

        {/* Objective */}
        {objective && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-2">Career Objective</h3>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line italic">{objective}</p>
          </section>
        )}

        {/* Skills */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-3">Skills</h3>
          <ul className="flex flex-wrap gap-3">
            {skillList.map((skill, idx) => (
              <li key={idx} className="bg-blue-100 px-4 py-2 rounded-full text-sm font-semibold text-blue-800 border border-blue-300 shadow-sm">
                        {skill}
              </li>
                    ))}
          </ul>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-3">Education</h3>
          <ul className="space-y-4">
            {education.map((edu, idx) => (
              <li key={idx} className="border-l-4 border-blue-400 pl-4">
                <div className="text-lg font-semibold text-blue-900">{edu.name} - {edu.collage}</div>
                <div className="text-sm text-gray-600">{edu.start} - {edu.end}</div>
                <div className="text-sm text-gray-500 italic">{edu.percentage}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Work Experience */}
        <section>
          <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-3">Work Experience</h3>
          <ul className="space-y-5">
            {work.map((job, idx) => (
              <li key={idx} className="border-l-4 border-blue-400 pl-4">
                <div className="text-lg font-semibold text-blue-900">{job.position} - {job.company}</div>
                <div className="text-sm text-gray-600">{job.start} - {job.end} | {job.location}</div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{job.description}</p>
              </li>
            ))}
          </ul>
        </section>
                </div>
    );
  }
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-gray-100 to-white min-h-screen py-10">
      <div ref={componentRef} className="bg-white w-[800px] min-h-[1122px] px-12 py-10 shadow-2xl rounded-xl border border-gray-200 text-gray-900 font-sans print:shadow-none print:border-none">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-blue-900">{name}</h1>
            <h2 className="text-2xl text-gray-600 mt-1">{designation}</h2>
          </div>
          {image && <img src={image} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg" />}
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-10 text-sm mb-6">
          <div><span className="font-semibold">📧 Email:</span> {email}</div>
          <div><span className="font-semibold">📞 Phone:</span> {phone}</div>
          <div><span className="font-semibold">💻 GitHub:</span> <a href={git} className="text-blue-600 underline">{git}</a></div>
          <div><span className="font-semibold">🔗 LinkedIn:</span> <a href={lin} className="text-blue-600 underline">{lin}</a></div>
        </div>

        {/* Objective */}
        {objective && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-2">Career Objective</h3>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line italic">{objective}</p>
          </section>
        )}

        {/* Skills */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-3">Skills</h3>
          <ul className="flex flex-wrap gap-3">
            {skillList.map((skill, idx) => (
              <li key={idx} className="bg-blue-100 px-4 py-2 rounded-full text-sm font-semibold text-blue-800 border border-blue-300 shadow-sm">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-3">Education</h3>
          <ul className="space-y-4">
            {education.map((edu, idx) => (
              <li key={idx} className="border-l-4 border-blue-400 pl-4">
                <div className="text-lg font-semibold text-blue-900">{edu.name} - {edu.collage}</div>
                <div className="text-sm text-gray-600">{edu.start} - {edu.end}</div>
                <div className="text-sm text-gray-500 italic">{edu.percentage}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Work Experience */}
        <section>
          <h3 className="text-2xl font-bold text-blue-800 border-b border-gray-300 mb-3">Work Experience</h3>
          <ul className="space-y-5">
            {work.map((job, idx) => (
              <li key={idx} className="border-l-4 border-blue-400 pl-4">
                <div className="text-lg font-semibold text-blue-900">{job.position} - {job.company}</div>
                <div className="text-sm text-gray-600">{job.start} - {job.end} | {job.location}</div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{job.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <button
        onClick={handlePrint}
        className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow-lg transition-all"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Template2;
