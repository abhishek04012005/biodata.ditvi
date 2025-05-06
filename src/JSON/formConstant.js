import { Height, Palette, Person, CalendarMonth } from '@mui/icons-material';

const defaultName = {
    label: "Name",
    value: "Ayush Kumar"
};


const languageEnglish = "En";
const languageHindi = "Hi";

const modelTypeProfessional = "Professional";
const modelTypeStudent = "Student";

const ICON_MAPPING = {
    "Date of Birth": <CalendarMonth className="g1111-icon" />,
    "Height": <Height className="g1111-icon" />,
    "Complexion": <Palette className="g1111-icon" />,
    "Caste": <Person className="g1111-icon" />
};


const personalData = [
    { icon: <CalendarMonth className="g1111-icon" />, label: "Date of Birth", value: "01 January 1995" },
    { icon: <Height className="g1111-icon" />, label: "Height", value: "5'10\"" },
    { icon: <Palette className="g1111-icon" />, label: "Complexion", value: "Fair" },
    { icon: <Person className="g1111-icon" />, label: "Caste", value: "Hindu, Brahmin" }
];

const professionalData = [
    {
        company: "TCS",
        position: "Software Engineer",
        experience: "2+",
        salary: "8 LPA"
    }
];

const educationData = [
    {
        degree: "Post Graduation (MCA)",
        institution: "RGPV, Bhopal (M.P)",
        year: "2021-2023",
        score: "8.5 CGPA"
    },
    {
        degree: "Graduation (BCA)",
        institution: "RGPV, Bhopal (M.P)",
        year: "2018-2021",
        score: "8.0 CGPA"
    },
    {
        degree: "12th Standard",
        institution: "CBSE",
        year: "2017-2018",
        score: "85%"
    },
    {
        degree: "10th Standard",
        institution: "CBSE",
        year: "2015-2016",
        score: "88%"
    }
];


const familyData = [
    {
        relation: "Father",
        name: ["Mr. Suraj Kumar"],
        married: ["-"],
        occupation: ["Business"]
    },
    {
        relation: "Mother",
        name: ["Mrs. Surbhi Kumari"],
        married: ["-"],
        occupation: ["Homemaker"]
    },
    {
        relation: "Brother(s)",
        name: ["Mr. Vishal Kumar", "Mr. Vaibhav Kumar"],
        married: ["Yes", "No"],
        occupation: ["Businessman", "Software Engineer"]
    },
    {
        relation: "Sister(s)",
        name: ["Mrs. Komal Kumari", "Ms. Mehak Kumari"],
        married: ["Yes", "No"],
        occupation: ["Housewife", "Studying"]
    }
];

const contactData = {
    address: "H.No. 521, Vijay Nagar Square, Indore, \nMadhya Pradesh-402310",
    mobile: "+91 9263767441"
};


export {
 
    personalData, educationData, professionalData, contactData, familyData, defaultName, ICON_MAPPING, languageEnglish, languageHindi, modelTypeProfessional, modelTypeStudent

};