import React from 'react';
import TopMenu from '../components/TopMenu';
import EventManagement from '../components/EventManagement';
import PopupCalendar from '../components/PopupCalendar.js';
import Header from '../components/Header';
import Slider from '../components/Slider';

const BASE_URL = "http://localhost:5001/api";

const eventData = [
  {
    title: 'MJIIT Open Day 2024',
    description: 'Explore the campus and meet the faculty!',
    image: 'https://studentaffairs.utm.my/ksj/wp-content/uploads/sites/16/2023/01/gambar-ksj-e1674931929257.png',
  },
  // ...existing event data...
];

const PublicHomePage = () => {
  return (
    <div>
      <TopMenu />
      <Header />
      <Slider events={eventData} />
      <EventManagement />
      <PopupCalendar fetchEventsApi={`${BASE_URL}/events`} />
    </div>
  );
};

export default PublicHomePage;