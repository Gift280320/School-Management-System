# MINDSET LABS - School Management System

A comprehensive School Management System built with React, TypeScript, and Tailwind CSS. This system is designed for Kenyan schools and supports the complete school management workflow.

## Features

### 🎓 Student Management
- Complete student registration with admission numbers
- Student profiles with personal details
- Class-wise student organization
- Search and filter functionality

### 📅 Attendance Management
- Daily attendance marking by class
- Visual attendance status indicators
- Attendance history and reporting
- Real-time attendance statistics

### 📊 Results Management
- Subject-wise marks entry
- Automatic grade calculation (A-E grading system)
- Printable report cards
- Term and year-wise result tracking
- Student performance analytics

### 🕒 Timetable Management
- Weekly timetable creation for all classes
- Period-wise subject scheduling
- Teacher assignment
- Visual timetable grid display

### 📈 Admin Dashboard
- Overview statistics and metrics
- Recent activity tracking
- Quick action shortcuts
- Modern, intuitive interface

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Storage**: Local Storage (for demo purposes)

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

## System Overview

### Academic Structure
The system supports the Kenyan Competency-Based Curriculum (CBC) structure:
- Pre-Primary 1 & 2
- Grades 1-9
- Standard subjects including Mathematics, English, Kiswahili, Science, Social Studies, Religious Education, Physical Education, and Creative Arts

### Grading System
- A: 80-100% (Excellent)
- B: 70-79% (Good)
- C: 60-69% (Satisfactory)
- D: 50-59% (Needs Improvement)
- E: Below 50% (Below Expectations)

## Features in Detail

### Student Registration
- Comprehensive student information capture
- Unique admission number assignment
- Gender and date of birth tracking
- Class assignment with validation

### Attendance System
- Class-specific attendance marking
- Present/Absent status tracking
- Daily attendance statistics
- Historical attendance viewing

### Results Management
- Multi-subject result entry
- Automatic total and average calculation
- Grade assignment based on performance
- Printable report card generation

### Timetable System
- Visual weekly timetable grid
- Period-wise scheduling (8 periods per day)
- Subject and teacher assignment
- Easy editing and management

## Data Storage

For demonstration purposes, this system uses browser localStorage for data persistence. In a production environment, you would integrate with a proper database system such as:
- MySQL
- PostgreSQL
- MongoDB
- Firebase

## Customization

The system is highly customizable:
- Modify subjects in `src/types/index.ts`
- Adjust grading scales in `src/utils/storage.ts`
- Update class structures as needed
- Customize colors and branding in Tailwind configuration

## Future Enhancements

Potential areas for expansion:
- Fee management system
- Parent portal
- SMS/Email notifications
- Mobile app development
- Integration with payment systems
- Exam scheduling
- Library management
- Transport management

## Contributing

This project is designed as a student portfolio project. Contributions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions about this School Management System, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for Kenyan Schools**

This system demonstrates modern web development practices while addressing real-world school management needs in the Kenyan education context.