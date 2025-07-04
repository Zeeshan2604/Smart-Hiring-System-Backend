import * as Yup from "yup";
import "yup-phone";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const regex =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

// Basic Information Schema

export const basicinfoschema = Yup.object({
  title: Yup.string().required("Please fill this field"),
  name: Yup.string().min(2).max(25).required("Please enter your name"),
  email: Yup.string().email().required("Please enter your email"),
  designation: Yup.string().max(25).required("This field is required"),
  objective: Yup.string().required("This field is required"),

  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .max(10, "Phone number is not valid")
    .min(10, "Phone number is not valid"),

  git: Yup.string()
    .matches(regex, "Enter correct url!")
    .required("Please enter url"),
  lin: Yup.string()
    .matches(regex, "Enter correct url!")
    .required("Please enter url"),
});

// Work Experience Schema

export const workexpschema = Yup.object({
  work: Yup.array().of(
    Yup.object().shape({
      position: Yup.string().required('Position is required'),
      company: Yup.string().required('Company is required'),
      certificate: Yup.string().url('Certificate must be a valid URL').nullable(),
      location: Yup.string().required('Location is required'),
      start: Yup.string().required('Start date is required'),
      end: Yup.string().required('End date is required'),
      description: Yup.string().required('Description is required'),
    })
  ),
});

// Education Schema

export const educationschema = Yup.object({
  education: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Degree/Exam is required'),
        collage: Yup.string().required('College/School is required'),
        percentage: Yup.string().required('Percentage/CGPA is required'),
        start: Yup.string().required('Start date is required'),
        end: Yup.string().required('End date is required'),
      })
    )
    .min(3, 'At least 3 education entries are required'),
});
