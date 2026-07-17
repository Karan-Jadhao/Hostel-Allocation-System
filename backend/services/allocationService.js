import { supabase } from "../utils/supabase.js";
import { seatMatrix } from "../data/seatMatrix.js";

const allocatePoolCategory = (
    students,
    course,
    branchId,
    categoryName,
    allottedStudents
) => {

    const pool = seatMatrix.pools[categoryName];

    let allocatedInBranch = 0;

    for (const student of students) {

        if (pool.remaining === 0)
            break;

        if (allocatedInBranch === pool.maxPerBranch)
            break;

        allottedStudents.push({
            application_id: student.id,
            branch_id: branchId,
            category_id: student.category_id
        });

        pool.remaining--;
        allocatedInBranch++;
    }
};

const allocateOpen = (
    students,
    course,
    branchId,
    allottedStudents
) => {

    let seats = seatMatrix[course][branchId][1].seats;

    for (const student of students) {

        if (seats === 0)
            break;

        allottedStudents.push({
            application_id: student.id,
            branch_id: branchId,
            category_id: 1
        });

        seats--;
    }

    seatMatrix[course][branchId][1].seats = seats;
};

const allocateOBC = (
    students,
    course,
    branchId,
    allottedStudents
) => {

    let seats = seatMatrix[course][branchId][2].seats;

    for (const student of students) {

        if (seats === 0)
            break;

        allottedStudents.push({
            application_id: student.id,
            branch_id: branchId,
            category_id: 2
        });

        seats--;
    }

    seatMatrix[course][branchId][2].seats = seats;
};

export const runAllocationAlgorithm = async () => {
    try{
        // Fetch all students from the database
        const { data: students, error } = await supabase
            .from("students")
            .select("*");

        if(error){
                throw error;
            }
const allottedStudents = [];
       for(let branch = 1; branch <= 9; branch++){

    const branchStudents = students
        .filter(student => student.branch_id === branch)
        .sort((a,b) => b.cgpa - a.cgpa);

    const openStudents =
        branchStudents.filter(s => s.category_id === 1);

    const obcStudents =
        branchStudents.filter(s => s.category_id === 2);

    const scStudents =
        branchStudents.filter(s => s.category_id === 3);

    const stStudents =
        branchStudents.filter(s => s.category_id === 4);

    const vjStudents =
        branchStudents.filter(s => s.category_id === 5);

    const sebcStudents =
        branchStudents.filter(s => s.category_id === 6);

    const ewsStudents =
        branchStudents.filter(s => s.category_id === 7);

    allocateOpen(
        openStudents,
        "B.tech",
        branch,
        allottedStudents
    );

    allocateOBC(
        obcStudents,
        "B.tech",
        branch,
        allottedStudents
    );

    allocatePoolCategory(
        scStudents,
        "B.tech",
        branch,
        "SC",
        allottedStudents
    );

    allocatePoolCategory(
        stStudents,
        "B.tech",
        branch,
        "ST",
        allottedStudents
    );

    allocatePoolCategory(
        vjStudents,
        "B.tech",
        branch,
        "VJDTNT",
        allottedStudents
    );

    allocatePoolCategory(
        sebcStudents,
        "B.tech",
        branch,
        "SEBC",
        allottedStudents
    );

    allocatePoolCategory(
        ewsStudents,
        "B.tech",
        branch,
        "EWS",
        allottedStudents
    );

   
}

 return allottedStudents;

    } catch (error) {
        console.error("Error occurred while fetching students:", error);
    }
}