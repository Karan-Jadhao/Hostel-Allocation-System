import { useEffect, useState } from "react";
import api from "../api/axios.js";
import "../styles/seatConfig.css"

function RequiredMark() {
    return <span className="required-mark" aria-hidden="true">*</span>
}

function SeatConfig() {

    const [course, setCourse] = useState("")
    const [academicYear, setAcademicYear] = useState("")
    const [branch, setBranch] = useState([])
    const [year, setYear] = useState("")
    const [category, setCategory] = useState([])
    const [seatConfig, setSeatConfig] = useState({})


    const currentYear = new Date().getFullYear();
    const acadYears = Array.from({ length: 6 }, (_, i) => ({
        value: `${currentYear - i}-${currentYear - i + 1}`,
        label: `${currentYear - i} - ${currentYear - i + 1}`,
    }));

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
                console.log(response.data);

            } catch (error) {
                console.log(error);
            }
        };
        fetchBranches();
    }, [course]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/category`);
                setCategory(Array.isArray(response.data) ? response.data : [])
            } catch (error) {
                console.error(error)
            }
        }
        fetchCategory()
    }, [])

    const handleSeatChange = (catId, field, value) => {
        setSeatConfig((prev) => ({
            ...prev, [catId]: {
                ...prev[catId], [field]: Number(value) || 0
            }
        }))
    }

    const handleSeatSubmit = async (e) => {
        e.preventDefault()
        try {
            const body = {
                academicYear,
                course,
                year,
                seatConfig
            }

            const response = await api.post(
                "/seat-matrix",
                body
            );
            console.log(response.data)
            setCourse("")
            setAcademicYear("")
            setYear("")
            setSeatConfig("")
        } catch (error) {
            console.log(error);
            
            console.error(error)
        }
    }

    useEffect(() => {
        if (!academicYear || !year || !course) return;
        const fetchSeat = async () => {
            try {
                const response = await api.get("/seat-matrix", {
                    params: {
                        academicYear,
                        year,
                        course
                    }
                })
                const config = {};
                response.data.forEach((rows) => {
                    config[rows.category_id] = {
                        perBranchSeats: rows.per_branch_seats,
                        extraSeats: rows.extra_seats
                    }
                })
                setSeatConfig(config)
            } catch (error) {
                console.error(error)
            }
        }

        fetchSeat()
    }, [academicYear, course, year])

    const handleReset = () => {
        setAcademicYear("");
        setCourse("");
        setYear("");
        setBranch([]);
        setSeatConfig({});
    };

    const handleDelete = async () => {
        try {
            const response = await api.delete("/seat-matrix", {
                data: {
                    academicYear,
                    course,
                    year
                },
            });

            console.log(response.data);
            // Clear the table after successful deletion
            setSeatConfig({});
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>

            <div className="seat-config-container">

                <div className="page-header">

                    <div className="header-content">
                        <h1 className="title">
                            Seat Matrix Configuration
                        </h1>

                        <p className="subtitle">
                            Configure category-wise hostel seat allocation for the selected
                            academic year, course and year of study.
                        </p>
                    </div>

                </div>


                <form onSubmit={handleSeatSubmit}>
                    <div className="form-grid">

                        <div className="form-group">
                            <label htmlFor="acadyear">
                                Academic Year <RequiredMark />
                            </label>

                            <select
                                id="acadyear"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                required
                            >
                                <option value="">Select Academic Year</option>

                                {acadYears.map((year) => (
                                    <option
                                        key={year.value}
                                        value={year.value}
                                    >
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="course">
                                Course <RequiredMark />
                            </label>

                            <select
                                id="course"
                                value={course}
                                onChange={(e) => {
                                    setCourse(e.target.value);
                                    setYear("");
                                }}
                                required
                            >
                                <option value="">Select Course</option>

                                <option value="B.tech">B.Tech</option>
                                <option value="M.tech">M.Tech</option>
                                <option value="Diploma">Diploma</option>
                                <option value="MCA">MCA</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="year">
                                Year of Study <RequiredMark />
                            </label>

                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                disabled={!course}
                                required
                            >
                                <option value="">Select Year</option>

                                {course &&
                                    years[course].map((y) => (
                                        <option
                                            key={y}
                                            value={y}
                                        >
                                            {y}
                                        </option>
                                    ))}
                            </select>
                        </div>

                    </div>

                    <div className="summary-grid">

                        <div className="summary-card branches">
                            <div className="summary-content">
                                <h2>{branch.length}</h2>
                                <p>Total Branches</p>
                            </div>
                        </div>

                        <div className="summary-card categories">
                            <div className="summary-content">
                                <h2>{category.length}</h2>
                                <p>Categories</p>
                            </div>
                        </div>

                        <div className="summary-card seats">
                            <div className="summary-content">
                                <h2>
                                    {category.reduce((sum, cat) => {
                                        const p = seatConfig[cat.id]?.perBranchSeats || 0;
                                        const e = seatConfig[cat.id]?.extraSeats || 0;

                                        return sum + (branch.length * p) + e;
                                    }, 0)}
                                </h2>
                                <p>Total Seats</p>
                            </div>
                        </div>

                    </div>


                    <div className="table-wrapper">
                        <table className="seat-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Per Branch Seats</th>
                                    <th>Extra Seats</th>
                                    <th>Total Seats</th>
                                </tr>
                            </thead>

                            <tbody>
                                {category.map((cat) => {
                                    const perBranchSeats =
                                        seatConfig[cat.id]?.perBranchSeats || 0;

                                    const extraSeats =
                                        seatConfig[cat.id]?.extraSeats || 0;

                                    const totalSeats =
                                        (branch.length * perBranchSeats) + extraSeats;

                                    return (
                                        <tr key={cat.id}>
                                            <td className="category-cell">
                                                {cat.category_name}
                                            </td>

                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={perBranchSeats}
                                                    onChange={(e) =>
                                                        handleSeatChange(
                                                            cat.id,
                                                            "perBranchSeats",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={extraSeats}
                                                    onChange={(e) =>
                                                        handleSeatChange(
                                                            cat.id,
                                                            "extraSeats",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td>{totalSeats}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <th colSpan="3">Grand Total Seats</th>
                                    <th>
                                        {category.reduce((sum, cat) => {
                                            const perBranchSeats =
                                                seatConfig[cat.id]?.perBranchSeats || 0;

                                            const extraSeats =
                                                seatConfig[cat.id]?.extraSeats || 0;

                                            return (
                                                sum +
                                                (branch.length * perBranchSeats) +
                                                extraSeats
                                            );
                                        }, 0)}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="form-footer">
                        <div className="button-group">
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={handleDelete}
                            >
                                Delete Configuration
                            </button>

                            <button
                                type="button"
                                className="reset-btn"
                                onClick={handleReset}
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SeatConfig