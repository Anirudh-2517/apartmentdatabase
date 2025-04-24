import React, { useState } from 'react';

const ApartmentCalendar = () => {
  // Sample data for apartment events and festivals
  const eventsData = [
    { id: 1, name: "New Year's Party", date: "January 1", location: "Main Courtyard", description: "Annual celebration to welcome the new year with food, music, and fireworks display." },
    { id: 2, name: "Spring Cleaning Day", date: "March 15", location: "Throughout Complex", description: "Community cleanup event with refreshments provided afterward." },
    { id: 3, name: "Easter Egg Hunt", date: "April 4", location: "Garden Area", description: "Fun event for children with prizes and treats." },
    { id: 4, name: "Summer BBQ", date: "June 12", location: "Pool Area", description: "Annual BBQ with swimming, games, and food for all residents." },
    { id: 5, name: "Independence Day Celebration", date: "July 4", location: "Rooftop", description: "Fireworks viewing party with potluck dinner." },
    { id: 6, name: "Back to School Drive", date: "August 20", location: "Community Center", description: "Collecting school supplies for children in need." },
    { id: 7, name: "Halloween Party", date: "October 31", location: "Clubhouse", description: "Costume contest, spooky decorations, and treats for all ages." },
    { id: 8, name: "Thanksgiving Potluck", date: "November 22", location: "Community Center", description: "Residents bring dishes to share in a community meal." },
    { id: 9, name: "Holiday Lighting Ceremony", date: "December 1", location: "Main Entrance", description: "Lighting of holiday decorations with hot chocolate and cookies." },
    { id: 10, name: "Holiday Gift Exchange", date: "December 18", location: "Clubhouse", description: "Annual gift exchange party with festive activities." },
    { id: 11, name: "Quarterly Residents Meeting", date: "Mar 10, Jun 10, Sep 10, Dec 10", location: "Meeting Room", description: "Discussion of community matters and upcoming changes." },
    { id: 12, name: "Monthly Game Night", date: "First Friday of each month", location: "Recreation Room", description: "Board games, card games, and snacks provided." }
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter events for the selected month
  const getEventsForMonth = (monthIndex) => {
    return eventsData.filter(event => {
      // For events that have multiple dates or recurring patterns
      if (event.date.includes(months[monthIndex]) || 
          (event.date.includes("each month")) ||
          (monthIndex === 2 && event.date.includes("Mar")) ||
          (monthIndex === 5 && event.date.includes("Jun")) ||
          (monthIndex === 8 && event.date.includes("Sep")) ||
          (monthIndex === 11 && event.date.includes("Dec"))) {
        return true;
      }
      return false;
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Event Calendar</h1>
      
      {/* Month Selector */}
      <div className="flex justify-between mb-6">
        <button 
          onClick={() => setSelectedMonth((selectedMonth - 1 + 12) % 12)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Previous
        </button>
        <h2 className="text-2xl font-semibold">{months[selectedMonth]}</h2>
        <button 
          onClick={() => setSelectedMonth((selectedMonth + 1) % 12)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
      
      {/* Events List */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4">Events for {months[selectedMonth]}</h3>
        {getEventsForMonth(selectedMonth).length > 0 ? (
          <ul className="space-y-2">
            {getEventsForMonth(selectedMonth).map(event => (
              <li 
                key={event.id}
                className="p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="font-medium">{event.name}</div>
                <div className="text-sm text-gray-600">{event.date} • {event.location}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No events scheduled for this month.</p>
        )}
      </div>
      
      {/* Year at a glance */}
      {/* <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Year at a Glance</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {months.map((month, index) => (
            <div 
              key={index}
              onClick={() => setSelectedMonth(index)}
              className={`p-2 text-center rounded cursor-pointer ${selectedMonth === index ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              <div>{month.substring(0, 3)}</div>
              <div className="text-xs mt-1">{getEventsForMonth(index).length} events</div>
            </div>
          ))}
        </div>
      </div> */}
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-2">{selectedEvent.name}</h3>
            <p className="text-gray-600 mb-4"><strong>Date:</strong> {selectedEvent.date}</p>
            <p className="text-gray-600 mb-4"><strong>Location:</strong> {selectedEvent.location}</p>
            <p className="mb-6">{selectedEvent.description}</p>
            <div className="flex justify-end">
              <button 
                onClick={closeEventDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentCalendar;