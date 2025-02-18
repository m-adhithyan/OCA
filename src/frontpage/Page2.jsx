import React from "react";
import "./Page2.css";
import cel from "../assets/cel.png";
import edl from "../assets/edl.png";
import udl from "../assets/udl.png";

function Page2() {
    return (
        <div className="overlay-2">
            <div className="mission">
                <div className="mission-text">
                 <h1 className="our">OUR</h1>
                 <h2 className="mission-heading">MISSION</h2>
                </div>
                <div className="mission-p">
                    <p>
                        Learn Bridge empowers individuals through accessible, engaging, <br />and 
                        transformative education, fostering lifelong growth, innovation, and success.
                    </p>
                </div>
            </div>
            <div className="cardcontainer-2">
                <div className="card-2" id="c21">
                    <img src={cel} alt="Coursera" />
                </div>
                <div className="card-2" id="c22">
                    <img src={edl} alt="edX" />
                </div>
                <div className="card-2" id="c23">
                    <img src={udl} alt="Udemy" />
                </div>
                <div className="card-2" id="c24">
                    <img src={cel} alt="Coursera" />
                </div>
                <div className="card-2" id="c25">
                    <img src={edl} alt="edX" />
                </div>
                <div className="card-2" id="c26">
                    <img src={udl} alt="Udemy" />
                </div>
            </div>
            <div className="contact">
                <div className="contact-item">
                    <h2 className="contactname">CONTACT</h2>
                    <h1 className="us">US</h1>
                </div>
                <div className="contact-item">
                    <h3>CALL @</h3>
                    <p>+915522884445</p>
                </div>
                <div className="contact-item">
                    <h3>EMAIL</h3>
                    <p>PROJECTSEVEN@GMAIL.COM</p>
                </div>
                <div className="contact-item">
                    <h3>SOCIALS</h3>
                    <p>INSTAGRAM<br/>FACEBOOK<br/>YOUTUBE<br/>TIKTOK</p>
                </div>
                <div className="contact-item">
                    <h3>ADDRESS</h3>
                    <p>ANYWHERE<br/>STREET 123<br/>DISTRICT</p>
                </div>
            </div>
        </div>
    );
}

export default Page2;
