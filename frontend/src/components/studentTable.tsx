import React, { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  age: number;
  email: string;
  course: string;
}

const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/students.json');
      const data: Student[] = await res.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const currentStudents = students.slice(
    currentPage * studentsPerPage,
    (currentPage + 1) * studentsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full border-collapse">
        <thead className="bg-[#1B4242] text-white">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Course</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr
              key={student.id}
              className="odd:bg-gray-100 even:bg-white hover:bg-gray-200 transition-colors"
            >
              <td className="px-4 py-2">{student.id}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.age}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">{student.course}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="bg-[#1B4242] text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="bg-[#1B4242] text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentTable;
