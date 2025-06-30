import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { TimetableEntry, CLASSES, SUBJECTS, DAYS } from '../types';
import { getTimetable, saveTimetableEntry, deleteTimetableEntry, generateId } from '../utils/storage';

const Timetable: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(getTimetable());
  const [selectedClass, setSelectedClass] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  const [formData, setFormData] = useState({
    class: '',
    day: '',
    period: 1,
    subject: '',
    teacher: '',
    startTime: '',
    endTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry: TimetableEntry = {
      id: editingEntry?.id || generateId(),
      ...formData
    };

    saveTimetableEntry(entry);
    setTimetable(getTimetable());
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      class: '',
      day: '',
      period: 1,
      subject: '',
      teacher: '',
      startTime: '',
      endTime: ''
    });
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setFormData({
      class: entry.class,
      day: entry.day,
      period: entry.period,
      subject: entry.subject,
      teacher: entry.teacher,
      startTime: entry.startTime,
      endTime: entry.endTime
    });
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      deleteTimetableEntry(id);
      setTimetable(getTimetable());
    }
  };

  const getClassTimetable = (className: string) => {
    return timetable
      .filter(entry => entry.class === className)
      .sort((a, b) => {
        const dayIndex = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
        if (dayIndex !== 0) return dayIndex;
        return a.period - b.period;
      });
  };

  const getTimetableGrid = (className: string) => {
    const classTimetable = getClassTimetable(className);
    const grid: {[key: string]: TimetableEntry} = {};
    
    classTimetable.forEach(entry => {
      const key = `${entry.day}-${entry.period}`;
      grid[key] = entry;
    });
    
    return grid;
  };

  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Timetable Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Class Selection */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class to View Timetable
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
      </div>

      {/* Timetable Grid */}
      {selectedClass && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {selectedClass} - Weekly Timetable
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  {DAYS.map(day => (
                    <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {periods.map(period => {
                  const grid = getTimetableGrid(selectedClass);
                  return (
                    <tr key={period}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        Period {period}
                      </td>
                      {DAYS.map(day => {
                        const entry = grid[`${day}-${period}`];
                        return (
                          <td key={day} className="px-6 py-4 whitespace-nowrap">
                            {entry ? (
                              <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm font-medium text-blue-900">{entry.subject}</p>
                                    <p className="text-xs text-blue-700">{entry.teacher}</p>
                                    <p className="text-xs text-blue-600">{entry.startTime} - {entry.endTime}</p>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleEdit(entry)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(entry.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-16 border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs">Free Period</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Class</option>
                  {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Day</option>
                    {DAYS.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    {periods.map(period => (
                      <option key={period} value={period}>Period {period}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>  
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter teacher name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  {editingEntry ? 'Update' : 'Add'} Entry
                </button>
                <button
                  type="button"
                  onClick={resetForm}
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

export default Timetable;