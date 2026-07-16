import { useState } from "react"
import "./ApplicationForm.css";
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"

function ApplicationForm() {
    const [phone, setPhone] = useState("")
    const [parentPhone, setParentPhone] = useState("")
    return (
        <>
        <form action="">
        <label htmlFor="name">
            Enter Your Full Name
        </label>
        <input type="text" placeholder="Full Name" required/>
        <label htmlFor="reg-no">
            Enter Your Roll Number
        </label>
        <input type="number" placeholder="Roll No." required/>
        <label htmlFor="course">
             Course
        </label>
        <select name="course" id="">
            <option value="">
                Select Course
            </option>
             <option value="b-tech">
                B.Tech
            </option>
             <option value="m-tech">
                M.Tech
            </option>
             <option value="diploma">
                Diploma
            </option>
             <option value="mca">
                MCA
            </option>
        </select>
        <label htmlFor="cgpa">
            Enter Latest CGPA
        </label>
        <input type="number"
        name="cgpa"
        step="0.01" 
        min="0"
        max="10"
        placeholder="CGPA"
        />

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

        <label htmlFor="result">
            Upload Latest Result
        </label>
        <input type="file" 
        accept=".pdf,image/*"
        placeholder="Latest Result"
        />

        <label htmlFor="fees">
            Upload Mess & Hostel Fees Receipt (combined in one pdf)
        </label>
        <input type="file" 
        accept=".pdf"
        placeholder="Mess & Hostel Fees"
        />

        <label htmlFor="hostelId">
            Upload Hostel ID
        </label>
        <input type="file" 
        accept=".pdf,image/*"
        placeholder="Hostel ID"/>

        <label htmlFor="hostelId">
            Upload College ID
        </label>
        <input type="file" 
        accept=".pdf,image/*"
        placeholder="College ID"/>

        <label htmlFor="hostelId">
            Upload Adhar Card
        </label>
        <input type="file" 
        accept=".pdf,image/*"
        placeholder="Adhar Card"/>

        <button type="submit" className="btn">
            Apply 
        </button>
        </form>
        </>
    )
}

export default ApplicationForm