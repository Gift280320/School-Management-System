import React from 'react';
import { Users, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import { getStudents, getAttendance, getResults } from '../utils/storage';
import { formatDate } from '../utils/storage';

const Dashboard: React.FC = () => {
  const students = getStudents();
  const attendance = getAttendance();
  const results = getResults();
  
  const today = formatDate(new Date());
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
  const totalStudents = students.length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Present Today',
      value: presentToday,
      icon: Calendar,
      color: 'bg-green-500',
      change: `${attendanceRate}%`
    },
    {
      title: 'Total Results',
      value: results.length,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const recentStudents = students.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
          </div>
          <div className="p-6">
            {recentStudents.length > 0 ? (
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.class} • {student.admissionNumber}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No students registered yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Register New Student</p>
                    <p className="text-sm text-gray-500">Add a new student to the system</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Mark Attendance</p>
                    <p className="text-sm text-gray-500">Record today's attendance</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Add Results</p>
                    <p className="text-sm text-gray-500">Enter student exam results</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;