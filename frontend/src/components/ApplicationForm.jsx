import { useState, useEffect } from "react"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import api from "../api/axios"
import "../styles/ApplicationForm.css"
import { ConfirmationDialog, SuccessDialog } from "./popups"

function RequiredMark() {
    return <span className="required-mark" aria-hidden="true">*</span>
}

const PWD_CATEGORIES = new Set(["OPEN", "OBC", "SC", "VJ/DT/NT"])
const DEFENCE_CATEGORIES = new Set(["OPEN", "OBC", "ST", "SEBC"])

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
    const [isPwd, setIsPwd] = useState(false)
    const [isDefence, setIsDefence] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState("")
    const [place, setPlace] = useState("")
    const [cgpa, setCgpa] = useState("")
    const [competitiveRank, setCompetitiveRank] = useState("")
    const [email, setEmail] = useState("")

    // Files
    const [resultFile, setResultFile] = useState(null)
    const [feesReceipt, setFeesReceipt] = useState(null)
    const [hostelId, setHostelId] = useState(null)
    const [collegeId, setCollegeId] = useState(null)
    const [admissionLetter, setAdmissionLetter] = useState(null)
    const [aadhaarCard, setAadhaarCard] = useState(null)

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState("")
    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [formStatus, setFormStatus] = useState(null)
    const [isStatusLoading, setIsStatusLoading] = useState(false)
    const [statusError, setStatusError] = useState("")
    const isFirstYear = year === "First Year"
    const hasAcademicSelection = Boolean(academicYear && course && year)
    const shouldRenderApplicationFields = hasAcademicSelection
        && formStatus?.isLive !== false
    const selectedCategoryName = String(
        category.find((item) => String(item.id) === selectedCategory)?.category_name || ""
    ).trim().toUpperCase()
    const canApplyForPwd = PWD_CATEGORIES.has(selectedCategoryName)
    const canApplyForDefence = DEFENCE_CATEGORIES.has(selectedCategoryName)

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
            "Second Year"
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

    useEffect(() => {
        if (!hasAcademicSelection) return;

        let isActive = true;

        const fetchFormStatus = async () => {
            setIsStatusLoading(true);
            setStatusError("");

            try {
                const response = await api.get("/form-status", {
                    params: {
                        academicYear,
                        course,
                        year,
                    },
                });

                if (isActive) {
                    setFormStatus({ isLive: Boolean(response.data?.isLive) });
                }
            } catch (error) {
                console.log(error);
                if (isActive) {
                    setFormStatus(null);
                    setStatusError(
                        error.response?.data?.message || "Unable to check application status.",
                    );
                }
            } finally {
                if (isActive) {
                    setIsStatusLoading(false);
                }
            }
        };

        fetchFormStatus();

        return () => {
            isActive = false;
        };
    }, [academicYear, course, hasAcademicSelection, year]);


    // Handle form submission
    const submitApplication = async () => {
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
            formData.append("competitiveRank", competitiveRank);
            formData.append("performanceType", isFirstYear ? "competitive_exam_percentile" : "cgpa");
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("parentPhone", parentPhone);
            formData.append("selectedCategory", selectedCategory);
            formData.append("isPwd", String(isPwd));
            formData.append("isDefence", String(isDefence));
            formData.append("place", place);

            // Append files (only if selected)
            if (resultFile) formData.append("resultFile", resultFile);
            if (!isFirstYear && feesReceipt) formData.append("feesReceipt", feesReceipt);
            if (isFirstYear) {
                if (admissionLetter) formData.append("admissionLetter", admissionLetter);
            } else {
                if (hostelId) formData.append("hostelId", hostelId);
                if (collegeId) formData.append("collegeId", collegeId);
            }
            if (aadhaarCard) formData.append("aadhaarCard", aadhaarCard);

            const response = await api.post("/form/submit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setShowSubmitConfirmation(false);
                setSuccessMessage(response.data?.message || "Application submitted successfully!");
                // Reset form
                setFullName("");
                setRollNo("");
                setPhone("");
                setParentPhone("");
                setAcademicYear("");
                setYear("");
                setCourse("");
                setFormStatus(null);
                setStatusError("");
                setSelectedBranch("");
                setSelectedCategory("");
                setIsPwd(false);
                setIsDefence(false);
                setPlace("");
                setCgpa("");
                setCompetitiveRank("");
                setEmail("");
                setResultFile(null);
                setFeesReceipt(null);
                setHostelId(null);
                setCollegeId(null);
                setAdmissionLetter(null);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowSubmitConfirmation(true);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="acadyear">
                    Select Academic Year <RequiredMark />
                </label>
                <select
                    value={academicYear}
                    onChange={(e) => {
                        setAcademicYear(e.target.value);
                        setFormStatus(null);
                        setStatusError("");
                    }}
                    required>
                    <option value="">Select Academic Year</option>
                    {acadYears.map((year) => (
                        <option key={year.value} value={year.value}>
                            {year.label}
                        </option>
                    ))}
                </select>

                <label htmlFor="course">
                    Course <RequiredMark />
                </label>
                <select
                    name="course"
                    value={course}
                    onChange={(e) => {
                        setCourse(e.target.value);
                        setSelectedBranch("");
                        setYear("");
                        setRollNo("");
                        setCgpa("");
                        setCompetitiveRank("");
                        setSubmitMessage("");
                        setFormStatus(null);
                        setStatusError("");
                    }}
                    required
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
                    Branch <RequiredMark />
                </label>
                <select name="branch"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    disabled={!course}
                    required
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
                    Year Of Study <RequiredMark />
                </label>
                <select
                    name="year"
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        setRollNo("");
                        setCgpa("");
                        setCompetitiveRank("");
                        setFeesReceipt(null);
                        setHostelId(null);
                        setCollegeId(null);
                        setAdmissionLetter(null);
                        setSubmitMessage("");
                        setFormStatus(null);
                        setStatusError("");
                    }}
                    disabled={!course || !selectedBranch}
                    required
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

                {hasAcademicSelection && isStatusLoading && (
                    <p className="submit-message">Checking application status...</p>
                )}

                {hasAcademicSelection && statusError && (
                    <p className="submit-message">{statusError}</p>
                )}

                {hasAcademicSelection && formStatus?.isLive === false && (
                    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "28px", textAlign: "center", background: "white", borderRadius: "20px", boxShadow: "0 15px 35px rgba(0,0,0,.08)" }}>
                        <p>Applications are currently closed.</p>
                        <p>Please wait until the hostel administration opens the application window.</p>
                    </div>
                )}

                {shouldRenderApplicationFields && <>
                <label htmlFor="name">
                    Enter Your Full Name <RequiredMark />
                </label>
                <input type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required />

                <label htmlFor="roll-number">
                    {isFirstYear ? "Enter Competitive Exam Application Number" : "Enter Your Roll Number"} <RequiredMark />
                </label>
                <input
                    id="roll-number"
                    type={isFirstYear ? "text" : "number"}
                    value={rollNo}
                    onChange={(e) => setRollNo(isFirstYear ? e.target.value.toUpperCase() : e.target.value)}
                    placeholder={isFirstYear ? "Application / competitive exam roll number" : "Roll No."}
                    pattern={isFirstYear ? "[A-Za-z0-9-]+" : undefined}
                    title={isFirstYear ? "Use letters, numbers, and hyphens only." : undefined}
                    required
                />


                <label htmlFor="academic-score">
                    {isFirstYear ? "Enter Latest Competitive Exam Score / Percentile" : "Enter Latest CGPA"} <RequiredMark />
                </label>
                <input type="number"
                    id="academic-score"
                    name={isFirstYear ? "competitive-score" : "cgpa"}
                    step="0.01"
                    min="0"
                    max={isFirstYear ? "100" : "10"}
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder={isFirstYear ? "Score or percentile" : "CGPA"}
                    required
                />

                {isFirstYear && <>
                    <label htmlFor="competitive-rank">
                        Enter Competitive Exam Rank <RequiredMark />
                    </label>
                    <input type="number"
                        id="competitive-rank"
                        name="competitive-rank"
                        min="1"
                        step="1"
                        value={competitiveRank}
                        onChange={(e) => setCompetitiveRank(e.target.value)}
                        placeholder="Exam rank"
                        required
                    />
                </>}

                <label htmlFor="email">
                    Enter Your Email <RequiredMark />
                </label>

                <input type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required />

                <label htmlFor="phone-number">
                    Enter Your Phone Number <RequiredMark />
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
                    Enter Your Parent's/Gaurdian's Phone Number <RequiredMark />
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
                    Category <RequiredMark />
                </label>
                <select name="category"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        // A different regular category can have different
                        // special-seat eligibility, so clear prior choices.
                        setIsPwd(false)
                        setIsDefence(false)
                    }}
                    required>
                    <option value="">Select Category</option>
                    {
                        category.map((c) => (
                            <option value={c.id} key={c.id}>
                                {c.category_name}
                            </option>
                        ))
                    }
                </select>

                {canApplyForPwd && <label>
                    <input
                        type="checkbox"
                        checked={isPwd}
                        onChange={(event) => setIsPwd(event.target.checked)}
                    />
                    PwD candidate
                </label>}

                {canApplyForDefence && <label>
                    <input
                        type="checkbox"
                        checked={isDefence}
                        onChange={(event) => setIsDefence(event.target.checked)}
                    />
                    Defence candidate
                </label>}

                <label htmlFor="native-place">
                    Enter Your Native Place <RequiredMark />
                </label>
                <input type="text"
                    name="native-place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Native Place"
                    required />

                <label htmlFor="result">
                    Upload Latest Result <RequiredMark />
                </label>
                <input type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setResultFile(e.target.files[0])}
                    placeholder="Latest Result"
                    required
                />

                {!isFirstYear && <>
                    <label htmlFor="fees">
                        Upload Mess & Hostel Fees Receipt (combined in one pdf) <RequiredMark />
                    </label>
                    <input type="file"
                        id="fees"
                        onChange={(e) => setFeesReceipt(e.target.files[0])}
                        accept=".pdf"
                        placeholder="Mess & Hostel Fees"
                        required
                    />
                </>}

                {isFirstYear ? <>
                    <label htmlFor="admission-letter">
                        Upload Admission Letter <RequiredMark />
                    </label>
                    <input type="file"
                        id="admission-letter"
                        onChange={(e) => setAdmissionLetter(e.target.files[0])}
                        accept=".pdf,image/*"
                        placeholder="Admission Letter"
                        required />
                </> : <>
                    <label htmlFor="hostelId">
                        Upload Hostel ID <RequiredMark />
                    </label>
                    <input type="file"
                        id="hostelId"
                        onChange={(e) => setHostelId(e.target.files[0])}
                        accept=".pdf,image/*"
                        placeholder="Hostel ID"
                        required />

                    <label htmlFor="collegeId">
                        Upload College ID <RequiredMark />
                    </label>
                    <input type="file"
                        id="collegeId"
                        onChange={(e) => setCollegeId(e.target.files[0])}
                        accept=".pdf,image/*"
                        placeholder="College ID"
                        required />
                </>}

                <label htmlFor="adharcard">
                    Upload Adhar Card <RequiredMark />
                </label>
                <input type="file"
                    onChange={(e) => setAadhaarCard(e.target.files[0])}
                    accept=".pdf,image/*"
                    placeholder="Adhar Card"
                    required />

                {submitMessage && (
                    <p className="submit-message">{submitMessage}</p>
                )}

                <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Apply"}
                </button>
                </>}
            </form>
            <ConfirmationDialog
                open={showSubmitConfirmation}
                title="Submit application?"
                description="Please confirm that the application details and uploaded documents are correct."
                confirmText="Submit application"
                variant="primary"
                loading={isSubmitting}
                onConfirm={submitApplication}
                onCancel={() => setShowSubmitConfirmation(false)}
            />
            <SuccessDialog open={Boolean(successMessage)} title="Application submitted" description={successMessage} onClose={() => setSuccessMessage("")} />
        </>
    )
}

export default ApplicationForm
