import React from 'react';
import './EventOverview.css';

const EventManagement = () => {
  const events = [
    { 
      no: 1, 
      program: 'Solat Hajat', 
      date: '13-DEC-2016', 
      time: '6:30 PM', 
      venue: 'Dewan Sri Resak, Johor Bahru, Johor, Malaysia', 
      participants: '165/400', 
      category: 'Limited' 
    },
    { 
      no: 2, 
      program: 'Seminar Kecemerlangan "Ulul Albab"', 
      date: '13-DEC-2016', 
      time: '8:00 PM', 
      venue: 'Banquet Hall, Batu Pahat, Johor, Malaysia', 
      participants: '300/500', 
      category: 'Open' 
    },
    { 
      no: 3, 
      program: 'Majlis Ramah Mesra dan Pendaftaran Ahli Baru HIMSAK 2016', 
      date: '18-DEC-2016', 
      time: '8:00 PM', 
      venue: 'Tasik PKU, UTM, Johor Bahru, Johor, Malaysia', 
      participants: '220/250', 
      category: 'Open' 
    },
    { 
      no: 4, 
      program: 'Charity Run', 
      date: '17-FEB-2017', 
      time: '7:00 AM', 
      venue: 'Dataran UTM, Johor Bahru, Johor, Malaysia', 
      participants: '400/400', 
      category: 'Open' 
    },
    { 
      no: 5, 
      program: 'Program Rakan Mengaji 5ETP', 
      date: '20-FEB-2017', 
      time: '7:00 PM', 
      venue: 'Surau KTHO, Johor Bahru, Johor, Malaysia', 
      participants: '25/50', 
      category: 'Limited' 
    },
  ];

  return (
    <div className="event-management">
      <header className="event-header">
        <h1>List of Activities</h1>
        <button className="add-activity-btn">+ Add New Activity</button>
      </header>
      <table className="event-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Program</th>
            <th>Date</th>
            <th>Time</th>
            <th>Venue</th>
            <th>Participant(s)</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.no}</td>
              <td>{event.program}</td>
              <td>{event.date}</td>
              <td>{event.time}</td>
              <td>{event.venue}</td>
              <td>{event.participants}</td>
              <td>{event.category}</td>
              <td>
                <button className="action-btn">
                  <button>+</button><button>-</button>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventManagement;
