// Template1.js (Final: Picture at Top-Left)
import React, { useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";

const Template1 = React.memo(({ basicinfo, eduinfo, workinfo, preview = false }) => {
  const { name, designation, email, phone, objective, git, lin, skills, image } = basicinfo || {};
  const education = eduinfo?.education || [];
  const work = workinfo?.work || [];
  const skillList = useMemo(() => (skills || "").split(",").map(s => s.trim()).filter(Boolean), [skills]);
  const educationList = useMemo(() => education, [education]);
  const workList = useMemo(() => work, [work]);
  const componentRef = useRef();

  // Always call the hook
  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  if (preview) {
    return (
      <div ref={componentRef} className="bg-white w-[800px] min-h-[1122px] shadow-2xl rounded-xl border border-gray-200 font-sans print:shadow-none print:border-none overflow-hidden">
        {/* Header with Picture at Top-Left */}
        <header className="flex gap-6 px-10 pt-8 pb-4 border-b border-gray-300 bg-slate-50 items-start">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 shadow-md">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-slate-200">{name?.[0]}</div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight leading-snug">{name}</h1>
            <h2 className="text-xl text-slate-600 mt-1 font-medium">{designation}</h2>
            <div className="text-sm text-gray-500 mt-3 space-y-1">
              <div>📧 {email}</div>
              <div>📞 {phone}</div>
              <div>🐙 <a href={git} className="text-blue-600 underline break-all">{git}</a></div>
              <div>🔗 <a href={lin} className="text-blue-600 underline break-all">{lin}</a></div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-10">
          {/* Objective */}
          {objective && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Career Objective</h3>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line italic">{objective}</p>
            </section>
          )}

          {/* Skills */}
          {skillList.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Skills</h3>
              <ul className="flex flex-wrap gap-3">
                {skillList.map((skill, i) => (
                  <li key={i} className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium border border-blue-300 shadow-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {educationList.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Education</h3>
              <ul className="space-y-4">
                {educationList.map((edu, i) => (
                  <li key={i} className="p-4 bg-slate-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="text-lg font-semibold text-blue-900">{edu.name}</div>
                    <div className="text-sm text-gray-700">{edu.collage}</div>
                    <div className="text-xs text-gray-500">{edu.start} - {edu.end} | {edu.percentage}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Work Experience */}
          {workList.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Work Experience</h3>
              <ul className="space-y-4">
                {workList.map((exp, i) => (
                  <li key={i} className="p-4 bg-slate-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="text-lg font-semibold text-blue-900">{exp.position} - {exp.company}</div>
                    <div className="text-sm text-gray-700">{exp.start} - {exp.end} | {exp.location}</div>
                    {exp.certificate && <a href={exp.certificate} className="text-xs text-blue-500 underline block">Certificate</a>}
                    <p className="text-sm mt-1 text-gray-700 whitespace-pre-line">{exp.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-slate-100 to-white min-h-screen py-10">
      <div ref={componentRef} className="bg-white w-[800px] min-h-[1122px] shadow-2xl rounded-xl border border-gray-200 font-sans print:shadow-none print:border-none overflow-hidden">
        {/* Header with Picture at Top-Left */}
        <header className="flex gap-6 px-10 pt-8 pb-4 border-b border-gray-300 bg-slate-50 items-start">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 shadow-md">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-slate-200">{name?.[0]}</div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight leading-snug">{name}</h1>
            <h2 className="text-xl text-slate-600 mt-1 font-medium">{designation}</h2>
            <div className="text-sm text-gray-500 mt-3 space-y-1">
              <div>📧 {email}</div>
              <div>📞 {phone}</div>
              <div>🐙 <a href={git} className="text-blue-600 underline break-all">{git}</a></div>
              <div>🔗 <a href={lin} className="text-blue-600 underline break-all">{lin}</a></div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-10">
          {/* Objective */}
          {objective && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Career Objective</h3>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line italic">{objective}</p>
            </section>
          )}

          {/* Skills */}
          {skillList.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Skills</h3>
              <ul className="flex flex-wrap gap-3">
                {skillList.map((skill, i) => (
                  <li key={i} className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium border border-blue-300 shadow-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {educationList.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Education</h3>
              <ul className="space-y-4">
                {educationList.map((edu, i) => (
                  <li key={i} className="p-4 bg-slate-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="text-lg font-semibold text-blue-900">{edu.name}</div>
                    <div className="text-sm text-gray-700">{edu.collage}</div>
                    <div className="text-xs text-gray-500">{edu.start} - {edu.end} | {edu.percentage}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Work Experience */}
          {workList.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-blue-800 mb-2 border-b-2 border-blue-200 pb-1">Work Experience</h3>
              <ul className="space-y-4">
                {workList.map((exp, i) => (
                  <li key={i} className="p-4 bg-slate-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="text-lg font-semibold text-blue-900">{exp.position} - {exp.company}</div>
                    <div className="text-sm text-gray-700">{exp.start} - {exp.end} | {exp.location}</div>
                    {exp.certificate && <a href={exp.certificate} className="text-xs text-blue-500 underline block">Certificate</a>}
                    <p className="text-sm mt-1 text-gray-700 whitespace-pre-line">{exp.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>

      <button
        className="mt-6 bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-800 transition-all"
        onClick={handlePrint}
      >
        Download PDF
      </button>
    </div>
  );
});

export default Template1;