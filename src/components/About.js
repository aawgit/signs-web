import React, { Component } from "react";


class About extends Component {
  render() {
    return (
      <div className="container py-4">
        <h2>Contributors</h2>
        <ul>
          <li>Mr. Buddika Gunathilaka, Special Eduction Teacher</li>
          <li>Ms. Geshani Amila, Special Eduction Teacher</li>
          <li>Ms. Samantha Madurangi, Special Eduction Teacher</li>
        </ul>
        <h2>Thanks to</h2>
        <ul>
          <li>Ms. Sunitha Karunaratna, The Ceylon School for the Deaf & Blind</li>
          <li>Mr. Brayan Susantha, Sri Lanka Central Federation of the Deaf</li>
          <li>Mr. Janaka Perera, Sri Lanka Central Federation of the Deaf</li>
        </ul>
      </div>
    );
  }
}

export default About;
