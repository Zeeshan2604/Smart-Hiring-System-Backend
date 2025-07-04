import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { educationschema } from "../schema/schema";

const initialLabels = [
  "10th (Secondary)",
  "12th/Diploma (Senior Secondary)",
  "Graduate (Degree)",
  "Post Graduate (Optional)"
];

const Education = ({ eduinfo, onNext, onBack }) => {
  // Ensure at least 3 required entries
  const initialEducation = eduinfo.education && eduinfo.education.length >= 3
    ? eduinfo.education
    : [
        { name: "", collage: "", percentage: "", start: "", end: "" },
        { name: "", collage: "", percentage: "", start: "", end: "" },
        { name: "", collage: "", percentage: "", start: "", end: "" }
      ];
  return (
    <div className="flex justify-center items-center w-full min-h-full py-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Formik
          initialValues={{ education: initialEducation }}
          validationSchema={educationschema}
          onSubmit={values => {
            console.log('Education form onSubmit called with:', values);
            onNext(values);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col justify-center text-center align-middle border-2 rounded-2xl border-blue-200 w-full p-8 bg-white shadow-2xl">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Education Details</h2>
              <FieldArray name="education">
                {({ push, remove }) => (
                  <>
                    {Array.from({ length: Math.max(values.education.length, 3) }).map((_, idx) => (
                      <div key={idx} className={`mb-8 rounded-xl border-2 ${idx < 3 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'} shadow-sm p-4 relative`}> 
                        <div className="absolute -top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                          {initialLabels[idx] || `Education ${idx + 1}`}
                          {idx < 3 && <span className="ml-2 text-red-400">*</span>}
                </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-2">
                        <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Degree/Exam</label>
                            <Field name={`education[${idx}].name`} className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" placeholder="e.g. B.Tech, 12th, 10th" />
                            <ErrorMessage name={`education[${idx}].name`} component="div" className="text-red-500 text-xs text-left" />
                          </div>
                                    <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">College/School</label>
                            <Field name={`education[${idx}].collage`} className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" placeholder="e.g. ABC School/College" />
                            <ErrorMessage name={`education[${idx}].collage`} component="div" className="text-red-500 text-xs text-left" />
                                    </div>
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Percentage/CGPA</label>
                            <Field name={`education[${idx}].percentage`} className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" placeholder="e.g. 85% or 8.5 CGPA" />
                            <ErrorMessage name={`education[${idx}].percentage`} component="div" className="text-red-500 text-xs text-left" />
                                      </div>
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Start Date</label>
                            <Field name={`education[${idx}].start`} type="month" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                            <ErrorMessage name={`education[${idx}].start`} component="div" className="text-red-500 text-xs text-left" />
                                        </div>
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">End Date</label>
                            <Field name={`education[${idx}].end`} type="month" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                            <ErrorMessage name={`education[${idx}].end`} component="div" className="text-red-500 text-xs text-left" />
                                        </div>
                                      </div>
                        {idx >= 3 && (
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              className="text-red-600 hover:underline text-sm"
                              onClick={() => remove(idx)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        </div>
                    ))}
                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onBack}
                  >
                    Back
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => push({ name: "", collage: "", percentage: "", start: "", end: "" })}
                        disabled={values.education.length >= 4}
                      >
                        Add Education
                      </button>
                      <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Finish
                      </button>
                </div>
                  </>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Education;
