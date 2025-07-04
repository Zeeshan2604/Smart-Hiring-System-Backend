import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { basicinfoschema } from "../schema/schema";
import { FaCameraRetro } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const BasicInfo1 = (props) => {
  const {
    basicinfo,
    onNext,
    picture,
    setpicture,
  } = props;
  const img = useRef(null);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setpicture(reader.result);
        setFieldValue("image", reader.result);
  };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-full py-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Formik
          initialValues={{ ...basicinfo, image: picture }}
          validationSchema={basicinfoschema}
          onSubmit={values => {
            onNext({ ...values, image: picture });
          }}
        >
          {({ setFieldValue }) => (
            <Form className="flex flex-col justify-center text-center align-middle border-2 rounded-2xl border-blue-200 w-full p-8 bg-white shadow-2xl">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Basic Information</h2>
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <label className="font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="relative w-32 h-32 mb-2">
                  {picture ? (
                    <img
                      src={picture}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-2 border-blue-500 shadow"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full border-2 border-dashed border-blue-300">
                      <FaCameraRetro className="text-4xl text-blue-400" />
                    </div>
                    )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={img}
                    className="hidden"
                    onChange={e => handleImageChange(e, setFieldValue)}
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700"
                    onClick={() => img.current && img.current.click()}
                  >
                    <FaCameraRetro />
                  </button>
                  {picture && (
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                      onClick={() => { setpicture(""); setFieldValue("image", ""); }}
                    >
                      <MdDeleteForever />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-left font-medium text-gray-700 mb-1">Full Name</label>
                  <Field name="name" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs text-left" />
                </div>
                <div>
                  <label className="block text-left font-medium text-gray-700 mb-1">Designation</label>
                  <Field name="designation" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                  <ErrorMessage name="designation" component="div" className="text-red-500 text-xs text-left" />
                </div>
                <div>
                  <label className="block text-left font-medium text-gray-700 mb-1">Email</label>
                  <Field name="email" type="email" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs text-left" />
              </div>
                <div>
                  <label className="block text-left font-medium text-gray-700 mb-1">Phone</label>
                  <Field name="phone" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-xs text-left" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-left font-medium text-gray-700 mb-1">Objective</label>
                  <Field name="objective" as="textarea" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full min-h-[60px]" />
                  <ErrorMessage name="objective" component="div" className="text-red-500 text-xs text-left" />
                </div>
                <div>
                  <label className="block text-left font-medium text-gray-700 mb-1">GitHub</label>
                  <Field name="git" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                  <ErrorMessage name="git" component="div" className="text-red-500 text-xs text-left" />
              </div>
                <div>
                  <label className="block text-left font-medium text-gray-700 mb-1">LinkedIn</label>
                  <Field name="lin" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                  <ErrorMessage name="lin" component="div" className="text-red-500 text-xs text-left" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-left font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <Field name="skills" className="px-3 py-2 rounded-md outline-none border border-gray-300 w-full" />
                  <ErrorMessage name="skills" component="div" className="text-red-500 text-xs text-left" />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BasicInfo1;

