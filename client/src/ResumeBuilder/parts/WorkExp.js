import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { workexpschema } from "../schema/schema";

const WorkExp = ({ workinfo, onNext, onBack }) => {
  const [isFresher, setIsFresher] = useState(false);
  return (
    <div className="flex justify-center items-center w-full min-h-full py-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Formik
          initialValues={workinfo}
          onSubmit={values => onNext(isFresher ? { work: [] } : values)}
          validationSchema={workexpschema}
        >
          {({ values }) => (
            <Form className="flex flex-col justify-center text-center align-middle border-2 rounded-2xl border-blue-200 w-full p-8 bg-white shadow-2xl">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Work Experience</h2>
              <FieldArray name="work">
                {({ push, remove }) => (
                  <>
                    {values.work.map((exp, idx) => (
                      <div key={idx} className="mb-8 rounded-xl border-2 border-blue-400 bg-blue-50 shadow-sm p-4 relative">
                        <div className="absolute -top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                          Experience {idx + 1}
                          {!isFresher && <span className="ml-2 text-red-400">*</span>}
                </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-2">
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Position</label>
                            <Field name={`work[${idx}].position`} className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" disabled={isFresher} />
                            <ErrorMessage name={`work[${idx}].position`} component="div" className="text-red-500 text-xs text-left" />
              </div>
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Company</label>
                            <Field name={`work[${idx}].company`} className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" disabled={isFresher} />
                            <ErrorMessage name={`work[${idx}].company`} component="div" className="text-red-500 text-xs text-left" />
                </div>
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Certificate Link</label>
                            <Field name={`work[${idx}].certificate`} className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" disabled={isFresher} />
                            <ErrorMessage name={`work[${idx}].certificate`} component="div" className="text-red-500 text-xs text-left" />
                </div>
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Location</label>
                            <Field name={`work[${idx}].location`} className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" disabled={isFresher} />
                            <ErrorMessage name={`work[${idx}].location`} component="div" className="text-red-500 text-xs text-left" />
                </div>
                          <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">Start Date</label>
                            <Field name={`work[${idx}].start`} type="month" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" disabled={isFresher} />
                            <ErrorMessage name={`work[${idx}].start`} component="div" className="text-red-500 text-xs text-left" />
              </div>
                      <div>
                            <label className="block text-left font-medium text-gray-700 mb-1">End Date</label>
                            <Field name={`work[${idx}].end`} type="month" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" disabled={isFresher} />
                            <ErrorMessage name={`work[${idx}].end`} component="div" className="text-red-500 text-xs text-left" />
                                      </div>
                                    </div>
                        <div className="mb-2">
                          <label className="block text-left font-medium text-gray-700 mb-1">Description</label>
                          <Field name={`work[${idx}].description`} as="textarea" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full min-h-[60px]" disabled={isFresher} />
                          <ErrorMessage name={`work[${idx}].description`} component="div" className="text-red-500 text-xs text-left" />
                                      </div>
                        <div className="flex justify-end">
                          {values.work.length > 1 && !isFresher && (
                          <button
                            type="button"
                              className="text-red-600 hover:underline mr-2"
                              onClick={() => remove(idx)}
                          >
                              Remove
                          </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between mt-4 items-center">
                <button
                  type="button"
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={onBack}
                >
                  Back
                </button>
                      {!isFresher && (
                        <button
                          type="button"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          onClick={() => push({ position: "", company: "", certificate: "", location: "", start: "", end: "", description: "" })}
                        >
                          Add Experience
                        </button>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        <label htmlFor="fresher-checkbox" className="text-sm font-medium text-gray-700 select-none">Fresher</label>
                        <input
                          id="fresher-checkbox"
                          type="checkbox"
                          checked={isFresher}
                          onChange={e => setIsFresher(e.target.checked)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </div>
                      {isFresher ? (
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                          onClick={() => onNext({ work: [] })}
                        >
                          Next
                        </button>
                      ) : (
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
                      )}
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

export default WorkExp;
