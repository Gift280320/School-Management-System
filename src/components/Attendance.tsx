import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import { Student, Attendance as AttendanceType, CLASSES } from '../types';
import { getStudents, getAttendanceByDate, saveAttendance, formatDate, generateId } from '../utils/storage';

const Attendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'Present' | 'Absent'}>({});
  const [viewMode, setViewMode] = useState<'mark' | 'view'>('mark');

  const students = getStudents().filter(student => 
    !selectedClass || student.class === selectedClass
  );

  React.useEffect(() => {
    if (selectedClass && selectedDate) {
      const existingAttendance = getAttendanceByDate(selectedDate, selectedClass);
      const attendanceMap: {[key: string]: 'Present' | 'Absent'} = {};
      
      existingAttendance.forEach(record => {
        attendanceMap[record.studentId] = record.status;
      });
      
      setAttendanceData(attendanceMap);
    }
  }, [selectedClass, selectedDate]);

  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || !selectedDate) return;

    const attendanceRecords: AttendanceType[] = students.map(student => ({
      id: generateId(),
      studentId: student.id,
      date: selectedDate,
      status: attendanceData[student.id] || 'Absent',
      class: selectedClass
    }));

    saveAttendance(attendanceRecords);
    alert('Attendance saved successfully!');
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendanceData).filter(status => status === 'Present').length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('mark')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'mark' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setViewMode('view')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'view' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            View History
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a class</option>
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {selectedClass && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-semibold">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-semibold">{stats.present}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-semibold">{stats.absent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-semibold">{stats.percentage}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedClass} - {new Date(selectedDate).toLocaleDateString()}
              </h3>
              {viewMode === 'mark' && (
                <button
                  onClick={handleSaveAttendance}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save Attendance
                </button>
              )}
            </div>

            <div className="p-6">
              {students.length > 0 ? (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.admissionNumber}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'Present')}
                          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                            attendanceData[student.id] === 'Present'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          disabled={viewMode === 'view'}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Present</span>
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'Absent')}
                          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                            attendanceData[student.id] === 'Absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          disabled={viewMode === 'view'}
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No students found for the selected class
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;