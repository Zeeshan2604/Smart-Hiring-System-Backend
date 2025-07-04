import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

import BasicInfo1 from "../parts/BasicInfo1";
import WorkExp from "../parts/WorkExp";
import Education from "../parts/Education";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "",
  },
}));
function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle "></div>
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: "1",
    2: "2",
    3: "3",
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = [
  { num: 1, label: "Basic Information" },
  { num: 2, label: "Work Experience" },
  { num: 3, label: "Education" },
];

const Home = ({ basicinfo, workinfo, eduinfo, setBasicInfo, setWorkInfo, setEduInfo, setResume, picture, setpicture }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (data) => {
    console.log('Home handleNext called, activeStep:', activeStep, 'data:', data);
    if (activeStep === 0) {
      setBasicInfo(data);
      setActiveStep(1);
    } else if (activeStep === 1) {
      setWorkInfo(data);
      setActiveStep(2);
    } else if (activeStep === 2) {
      setEduInfo(data);
      console.log('Setting resume true in Home');
      setResume(true);
    }
  };

  const getStepperPage = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfo1
            basicinfo={basicinfo}
            onNext={handleNext}
            picture={picture}
            setpicture={setpicture}
          />
        );
      case 1:
        return (
          <WorkExp
            workinfo={workinfo}
            onNext={handleNext}
            onBack={() => setActiveStep(0)}
          />
        );
      case 2:
        return (
          <Education
            eduinfo={eduinfo}
            onNext={handleNext}
            onBack={() => setActiveStep(1)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
        {getStepperPage()}
    </div>
  );
};

export default Home;
