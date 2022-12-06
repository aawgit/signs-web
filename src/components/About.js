import React from "react";
import { Box } from "@mui/material";

const About = () => {
  return (
    <Box marginTop={4}>
      <h2>Developed by</h2>
      <p>
        <a href="https://lk.linkedin.com/in/akalanka-weerasooriya-7812b3171">
          Akalanka Weerasooriya
        </a>
        ,<br />
        based on the research{" "}
        <a href="https://www.researchgate.net/publication/364120463_Sinhala_Fingerspelling_Sign_Language_Recognition_with_Computer_Vision">
          Sinhala Fingerspelling Sign Language Recognition with Computer Vision
        </a>
        , <br />
        co-authored by{" "}
        <a href="https://lk.linkedin.com/in/thanujad">Dr.Thanuja Ambegoda</a>
      </p>
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
      <h2>Source code</h2>
      <a href="https://github.com/aawgit/signs-web">
        https://github.com/aawgit/signs-web
      </a>{" "}
      <br /> <br />
      <h2>Contact</h2>
      akalankaweerasooriya@gmail.com
    </Box>
  );
};

export default About;
