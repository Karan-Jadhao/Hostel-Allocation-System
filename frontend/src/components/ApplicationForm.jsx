import { useState, useEffect } from "react"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import api from "../api/axios"
import "./ApplicationForm.css"

function ApplicationForm() {
    // Data
    const [fullName, setFullName] = useState("")
    const [rollNo, setRollNo] = useState("")
    const [phone, setPhone] = useState("")
    const [parentPhone, setParentPhone] = useState("")
    const [academicYear, setAcademicYear] = useState("")
    const [year, setYear] = useState("")
    const [course, setCourse] = useState("")
    const [branch, setBranch] = useState([])
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedBranch, setSelectedBranch] = useState("")
    const [place, setPlace] = useState("")
    const [cgpa, setCgpa] = useState("")
    const [email, setEmail] = useState("")

    // Files
    const [resultFile, setResultFile] = useState(null)
    const [feesReceipt, setFeesReceipt] = useState(null)
    const [hostelId, setHostelId] = useState(null)
    const [collegeId, setCollegeId] = useState(null)
    const [aadhaarCard, setAadhaarCard] = useState(null)

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState("")

    //For Generation of Academic Year
    const currentYear = new Date().getFullYear();
    const acadYears = Array.from({ length: 6 }, (_, i) => ({
        value: `${currentYear - i}-${currentYear - i + 1}`,
        label: `${currentYear - i} - ${currentYear - i + 1}`,
    }));

    //Years of Study
    const years = {
        "B.tech": [
            "First Year",
            "Second Year",
            "Third Year",
            "Final Year"
        ],
        "M.tech": [
            "First Year",
            "second Year"
        ],
        "MCA": [
            "First Year",
            "Second Year"
        ],
        "Diploma": [
            "First Year",
            "Second Year",
            "Final Year"
        ]
    };

    //Fetch Branches From databse to dropdown
    useEffect(() => {
        const fetchBranches = async () => {
            if (!course) return;
            try {
                const response = await api.get(`/branches/${course}`);
                setBranch(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBranches();
    }, [course]);


    //fetch category from database
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/category`);
                setCategory(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.log(error);
            }
        }
        fetchCategory();
    }, []);


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            const formData = new FormData();

            // Append text fields
            formData.append("fullName", fullName);
            formData.append("rollNo", rollNo);
            formData.append("academicYear", academicYear);
            formData.append("course", course);
            formData.append("selectedBranch", selectedBranch);
            formData.append("year", year);
            formData.append("cgpa", cgpa);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("parentPhone", parentPhone);
            formData.append("selectedCategory", selectedCategory);
            formData.append("place", place);

            // Append files (only if selected)
            if (resultFile) formData.append("resultFile", resultFile);
            if (feesReceipt) formData.append("feesReceipt", feesReceipt);
            if (hostelId) formData.append("hostelId", hostelId);
            if (collegeId) formData.append("collegeId", collegeId);
            if (aadhaarCard) formData.append("aadhaarCard", aadhaarCard);

            const response = await api.post("/form/submit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setSubmitMessage("✅ Application submitted successfully!");
                // Reset form
                setFullName("");
                setRollNo("");
                setPhone("");
                setParentPhone("");
                setAcademicYear("");
                setYear("");
                setCourse("");
                setSelectedBranch("");
                setSelectedCategory("");
                setPlace("");
                setCgpa("");
                setEmail("");
                setResultFile(null);
                setFeesReceipt(null);
                setHostelId(null);
                setCollegeId(null);
                setAadhaarCard(null);

                // Reset file inputs
                const fileInputs = document.querySelectorAll('input[type="file"]');
                fileInputs.forEach(input => input.value = "");
            }
        } catch (error) {
            console.error("Submission error:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
            setSubmitMessage(`❌ ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAllocation = async () => {
        const response = await api.post("/allocation");
        console.log(response);
        
        console.log(response.data.data);
    }  

    return (
        <>
        <button type="submit" className="btn" onClick={handleAllocation}>
            Allocate
        </button>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">
                    Enter Your Full Name
                </label>
                <input type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required />

                <label htmlFor="reg-no">
                    Enter Your Roll Number
                </label>
                <input type="number"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="Roll No."
                    required
                />

                <label htmlFor="acadyear">
                    Select Academic Year
                </label>
                <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}>
                    <option value="">Select Academic Year</option>
                    {acadYears.map((year) => (
                        <option key={year.value} value={year.value}>
                            {year.label}
                        </option>
                    ))}
                </select>

                <label htmlFor="course">
                    Course
                </label>
                <select
                    name="course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                >
                    <option value="">
                        Select Course
                    </option>
                    <option value="B.tech">
                        B.Tech
                    </option>
                    <option value="M.tech">
                        M.Tech
                    </option>
                    <option value="Diploma">
                        Diploma
                    </option>
                    <option value="MCA">
                        MCA
                    </option>
                </select>

                <label htmlFor="branch">
                    Branch
                </label>
                <select name="branch"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                >
                    <option value="">Select Your Branch</option>
                    {
                        branch.map((b) => (
                            <option value={b.id} key={b.id}>
                                {b.branch_name}
                            </option>
                        ))
                    }
                </select>

                <label htmlFor="year">
                    Year Of Study
                </label>
                <select
                    name="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">
                        Select Your Year
                    </option>
                    {
                        course && years[course].map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))
                    }
                </select>
                <label htmlFor="cgpa">
                    Enter Latest CGPA
                </label>
                <input type="number"
                    name="cgpa"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="CGPA"
                />

                <label htmlFor="email">
                    Enter Your Email 
                </label>

                <input type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" 
                required/>

                <label htmlFor="phone-number">
                    Enter Your Phone Number
                </label>
                <PhoneInput
                    international
                    defaultCountry="IN"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Phone Number"
                    required
                />

                <label htmlFor="phone-number">
                    Enter Your Parent's/Gaurdian's Phone Number
                </label>
                <PhoneInput
                    international
                    defaultCountry="IN"
                    value={parentPhone}
                    onChange={setParentPhone}
                    placeholder="Parent's/Gaurdian's Phone Number"
                    required
                />

                <label htmlFor="category">
                    Category
                </label>
                <select name="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {
                        category.map((c) => (
                            <option value={c.id} key={c.id}>
                                {c.category_name}
                            </option>
                        ))
                    }
                </select>

                <label htmlFor="native-place">
                    Enter Your Native Place
                </label>
                <input type="text"
                    name="native-place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Native Place" />

                <label htmlFor="result">
                    Upload Latest Result
                </label>
                <input type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setResultFile(e.target.files[0])}
                    placeholder="Latest Result"
                />

                <label htmlFor="fees">
                    Upload Mess & Hostel Fees Receipt (combined in one pdf)
                </label>
                <input type="file"
                    onChange={(e) => setFeesReceipt(e.target.files[0])}
                    accept=".pdf"
                    placeholder="Mess & Hostel Fees"
                />

                <label htmlFor="hostelId">
                    Upload Hostel ID
                </label>
                <input type="file"
                    onChange={(e) => setHostelId(e.target.files[0])}
                    accept=".pdf,image/*"
                    placeholder="Hostel ID" />

                <label htmlFor="collegeId">
                    Upload College ID
                </label>
                <input type="file"
                    onChange={(e) => setCollegeId(e.target.files[0])}
                    accept=".pdf,image/*"
                    placeholder="College ID" />

                <label htmlFor="adharcard">
                    Upload Adhar Card
                </label>
                <input type="file"
                    onChange={(e) => setAadhaarCard(e.target.files[0])}
                    accept=".pdf,image/*"
                    placeholder="Adhar Card" />

                {submitMessage && (
                    <p className="submit-message">{submitMessage}</p>
                )}

                <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Apply"}
                </button>
            </form>
        </>
    )
}

export default ApplicationForm