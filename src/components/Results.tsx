import React, { useState } from 'react';
import { Plus, FileText, Calculator, Trophy, Medal, Award } from 'lucide-react';
import { Student, Result, SUBJECTS, CLASSES } from '../types';
import { getStudents, getResults, saveResult, generateId, calculateGrade } from '../utils/storage';

const Results: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [activeView, setActiveView] = useState<'results' | 'merit' | 'subject-toppers'>('results');
  
  const [formData, setFormData] = useState<{[key: string]: string}>({});

  const students = getStudents().filter(student => 
    !selectedClass || student.class === selectedClass
  );

  const results = getResults().filter(result => 
    result.term === selectedTerm && result.year === selectedYear
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedTerm || !selectedYear) return;

    const studentResults: Result[] = SUBJECTS.map(subject => ({
      id: generateId(),
      studentId: selectedStudent,
      subjectId: subject.id,
      marks: parseInt(formData[subject.id] || '0'),
      totalMarks: 100,
      term: selectedTerm,
      year: selectedYear
    }));

    studentResults.forEach(result => saveResult(result));
    
    setFormData({});
    setShowForm(false);
    setSelectedStudent('');
    
    alert('Results saved successfully!');
  };

  const getStudentResults = (studentId: string) => {
    return results.filter(result => result.studentId === studentId);
  };

  const calculateStudentSummary = (studentId: string) => {
    const studentResults = getStudentResults(studentId);
    
    if (studentResults.length === 0) return null;

    const totalMarks = studentResults.reduce((sum, result) => sum + result.marks, 0);
    const totalPossible = studentResults.length * 100;
    const average = Math.round((totalMarks / totalPossible) * 100);
    const grade = calculateGrade(average);

    return {
      totalMarks,
      totalPossible,
      average,
      grade,
      subjects: studentResults.length
    };
  };

  // Merit List Functions
  const getClassMeritList = (className: string) => {
    const classStudents = getStudents().filter(s => s.class === className);
    const meritList = classStudents.map(student => {
      const summary = calculateStudentSummary(student.id);
      return {
        student,
        summary
      };
    }).filter(item => item.summary !== null)
      .sort((a, b) => (b.summary?.average || 0) - (a.summary?.average || 0));

    return meritList.map((item, index) => ({
      ...item,
      position: index + 1
    }));
  };

  const getOverallMeritList = () => {
    const allStudents = getStudents();
    const meritList = allStudents.map(student => {
      const summary = calculateStudentSummary(student.id);
      return {
        student,
        summary
      };
    }).filter(item => item.summary !== null)
      .sort((a, b) => (b.summary?.average || 0) - (a.summary?.average || 0));

    return meritList.map((item, index) => ({
      ...item,
      position: index + 1
    }));
  };

  const getSubjectToppers = () => {
    const subjectToppers: {[key: string]: any[]} = {};
    
    SUBJECTS.forEach(subject => {
      const subjectResults = results.filter(r => r.subjectId === subject.id);
      const toppers = subjectResults.map(result => {
        const student = getStudents().find(s => s.id === result.studentId);
        return {
          student,
          marks: result.marks,
          percentage: Math.round((result.marks / result.totalMarks) * 100)
        };
      }).filter(item => item.student !== undefined)
        .sort((a, b) => b.marks - a.marks)
        .slice(0, 10); // Top 10 per subject

      subjectToppers[subject.id] = toppers.map((item, index) => ({
        ...item,
        position: index + 1
      }));
    });

    return subjectToppers;
  };

  const generateReportCard = (student: Student) => {
    const summary = calculateStudentSummary(student.id);
    if (!summary) return;

    const studentResults = getStudentResults(student.id);
    
    const reportContent = `
      REPORT CARD
      
      Student: ${student.name}
      Admission Number: ${student.admissionNumber}
      Class: ${student.class}
      Term: ${selectedTerm}
      Year: ${selectedYear}
      
      SUBJECTS:
      ${studentResults.map(result => {
        const subject = SUBJECTS.find(s => s.id === result.subjectId);
        const percentage = Math.round((result.marks / result.totalMarks) * 100);
        return `${subject?.name}: ${result.marks}/${result.totalMarks} (${percentage}% - ${calculateGrade(percentage)})`;
      }).join('\n')}
      
      SUMMARY:
      Total Marks: ${summary.totalMarks}/${summary.totalPossible}
      Average: ${summary.average}%
      Grade: ${summary.grade}
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Report Card - ${student.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .student-info { margin-bottom: 20px; }
              .subjects { margin-bottom: 20px; }
              .summary { border-top: 2px solid #000; padding-top: 10px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${reportContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printMeritList = (type: 'class' | 'overall', className?: string) => {
    const meritList = type === 'class' && className ? getClassMeritList(className) : getOverallMeritList();
    const title = type === 'class' ? `${className} Merit List` : 'Overall Merit List';
    
    const content = `
      MINDSET LABS - SCHOOL MANAGEMENT SYSTEM
      ${title}
      Term: ${selectedTerm} ${selectedYear}
      
      POSITION | ADMISSION NO. | STUDENT NAME | CLASS | TOTAL | AVERAGE | GRADE
      ${'-'.repeat(80)}
      ${meritList.map(item => 
        `${item.position.toString().padEnd(8)} | ${item.student.admissionNumber.padEnd(12)} | ${item.student.name.padEnd(25)} | ${item.student.class.padEnd(8)} | ${item.summary?.totalMarks}/${item.summary?.totalPossible} | ${item.summary?.average}% | ${item.summary?.grade}`
      ).join('\n')}
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: 'Courier New', monospace; margin: 20px; }
              pre { white-space: pre-wrap; font-size: 12px; }
              .header { text-align: center; margin-bottom: 30px; }
            </style>
          </head>
          <body>
            <pre>${content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Results Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('results')}
            className={`px-4 py-2 rounded-lg ${activeView === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveView('merit')}
            className={`px-4 py-2 rounded-lg ${activeView === 'merit' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Merit Lists
          </button>
          <button
            onClick={() => setActiveView('subject-toppers')}
            className={`px-4 py-2 rounded-lg ${activeView === 'subject-toppers' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Subject Toppers
          </button>
          {activeView === 'results' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Results</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Term</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results View */}
      {activeView === 'results' && selectedTerm && selectedYear && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">
              Results - {selectedClass || 'All Classes'} - {selectedTerm} {selectedYear}
            </h3>
          </div>

          <div className="p-6">
            {students.length > 0 ? (
              <div className="space-y-4">
                {students.map((student) => {
                  const summary = calculateStudentSummary(student.id);
                  return (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.admissionNumber} • {student.class}</p>
                        </div>
                        
                        {summary ? (
                          <div className="text-right">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="text-sm text-gray-600">Average</p>
                                <p className="text-lg font-semibold">{summary.average}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Grade</p>
                                <p className={`text-lg font-semibold ${
                                  summary.grade === 'A' ? 'text-green-600' :
                                  summary.grade === 'B' ? 'text-blue-600' :
                                  summary.grade === 'C' ? 'text-yellow-600' :
                                  summary.grade === 'D' ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                  {summary.grade}
                                </p>
                              </div>
                              <button
                                onClick={() => generateReportCard(student)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                              >
                                <FileText className="h-4 w-4" />
                                <span>Print</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No results recorded</p>
                        )}
                      </div>

                      {summary && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {getStudentResults(student.id).map(result => {
                            const subject = SUBJECTS.find(s => s.id === result.subjectId);
                            const percentage = Math.round((result.marks / result.totalMarks) * 100);
                            return (
                              <div key={result.id} className="bg-gray-50 p-2 rounded">
                                <p className="font-medium">{subject?.name}</p>
                                <p className="text-gray-600">{result.marks}/100 ({percentage}%)</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No students found for the selected criteria
              </p>
            )}
          </div>
        </div>
      )}

      {/* Merit Lists View */}
      {activeView === 'merit' && selectedTerm && selectedYear && (
        <div className="space-y-6">
          {/* Class Merit Lists */}
          {selectedClass ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  {selectedClass} Merit List - {selectedTerm} {selectedYear}
                </h3>
                <button
                  onClick={() => printMeritList('class', selectedClass)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getClassMeritList(selectedClass).map((item) => (
                      <tr key={item.student.id} className={`${item.position <= 3 ? 'bg-yellow-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.position === 1 && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                            {item.position === 2 && <Medal className="h-5 w-5 text-gray-400 mr-2" />}
                            {item.position === 3 && <Award className="h-5 w-5 text-orange-500 mr-2" />}
                            <span className="font-semibold">{item.position}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.student.admissionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.summary?.totalMarks}/{item.summary?.totalPossible}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {item.summary?.average}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.summary?.grade === 'A' ? 'bg-green-100 text-green-800' :
                            item.summary?.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            item.summary?.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            item.summary?.grade === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.summary?.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Overall Merit List */
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Overall Merit List - {selectedTerm} {selectedYear}
                </h3>
                <button
                  onClick={() => printMeritList('overall')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getOverallMeritList().map((item) => (
                      <tr key={item.student.id} className={`${item.position <= 3 ? 'bg-yellow-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.position === 1 && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                            {item.position === 2 && <Medal className="h-5 w-5 text-gray-400 mr-2" />}
                            {item.position === 3 && <Award className="h-5 w-5 text-orange-500 mr-2" />}
                            <span className="font-semibold">{item.position}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.student.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.student.admissionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.summary?.totalMarks}/{item.summary?.totalPossible}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {item.summary?.average}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.summary?.grade === 'A' ? 'bg-green-100 text-green-800' :
                            item.summary?.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            item.summary?.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            item.summary?.grade === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.summary?.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subject Toppers View */}
      {activeView === 'subject-toppers' && selectedTerm && selectedYear && (
        <div className="space-y-6">
          {SUBJECTS.map(subject => {
            const toppers = getSubjectToppers()[subject.id] || [];
            if (toppers.length === 0) return null;

            return (
              <div key={subject.id} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-500" />
                    {subject.name} - Top Performers
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {toppers.map((item) => (
                        <tr key={`${subject.id}-${item.student?.id}`} className={`${item.position <= 3 ? 'bg-purple-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.position === 1 && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                              {item.position === 2 && <Medal className="h-5 w-5 text-gray-400 mr-2" />}
                              {item.position === 3 && <Award className="h-5 w-5 text-orange-500 mr-2" />}
                              <span className="font-semibold">{item.position}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.student?.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.student?.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.marks}/100
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {item.percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              calculateGrade(item.percentage) === 'A' ? 'bg-green-100 text-green-800' :
                              calculateGrade(item.percentage) === 'B' ? 'bg-blue-100 text-blue-800' :
                              calculateGrade(item.percentage) === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              calculateGrade(item.percentage) === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {calculateGrade(item.percentage)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Results Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Student Results</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.admissionNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                  </label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    {[2024, 2023, 2022].map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Subject Marks (Out of 100)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SUBJECTS.map(subject => (
                    <div key={subject.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {subject.name}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData[subject.id] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          [subject.id]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter marks"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Save Results
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({});
                    setSelectedStudent('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;