import React, { useEffect, useState } from 'react'
import './signup.css'
import SignupForm from './signupform';
import { on } from '../utils/events';

const Signup = () => {

    const [activeNav, setActiveNav] = useState("what");

    useEffect(() => {
        on ('progression:signup', () => {
            setActiveNav("signup");
        })
    }, [])

    return (
        <div id="signup-wrapper">
            <div id="signup-container" style={{backgroundImage: `url("grunge-vintage-old-paper-background.jpg")`}}>
                    
                    <div id="signup-nav">
                        <div id="signup-nav-1" className={"signup-nav-item" + (activeNav === "what" ? " active" : "")} onClick={() => {setActiveNav("what")}}>What?</div>
                        <div id="signup-nav-2" className={"signup-nav-item" + (activeNav === "how" ? " active" : "")} onClick={() => {setActiveNav("how")}}>How?</div>
                        <div id="signup-nav-3" className={"signup-nav-item" + (activeNav === "tickets" ? " active" : "")} onClick={() => {setActiveNav("tickets")}}>Tickets</div>
                        <div id="signup-nav-4" className={"signup-nav-item" + (activeNav === "signup" ? " active" : "")} onClick={() => {setActiveNav("signup")}}>Signup</div>
                    </div>

                    {/* <img id="separator" src="./separator.png" alt="Separator"/> */}

                    {/* backgroundImage: `url("parchment-background.jpg")`,  */}
                    <div id="signup-content">
                        <div id="signup-what" style={{display: activeNav === "what" ? "block" : "none"}}> 
                            {/* <img id="signup-background-card" src="./card/gladecardbackpretty.png" alt="Background"/> */}
                            <div id="signup-what-text">
                                <img id="what-cover" src="./cover.jpg" alt=""/>   
                                <h1>Welcome, human</h1>
                                <p>Settle yourself in silence as you unveil this invitation.</p>
                                <p>There are whispers of a place deep within the forests of the North. It calls to you, dear wanderer. What does your wild heart yearn for in the darkness? In the depths of the unknown?</p>
                                <p>The Glade summons you to an immersive multisensory event this summer. Let us meet the forest and her divinity together.</p>
                                <p>This journey is not for the faint hearted. You may be called upon to confront the horrors and pleasures deep within your psyche. If she demands it, you must be ready. The ritual has already begun.</p>
                                <p>This curated artistic event will integrate elements of Nordic folklore, performance, communal collaboration, narrative immersion, music and ritual with the intention of creating a deeply mystical experience.</p>
                                <p>As an independent festival we offer a truly unique experience that sits somewhere between an art festival, music festival, burner event and live role playing event. You as the participant will be taken on a carefully crafted journey, together with us</p>
                            </div>
                        </div>

                        <div id="signup-how" style={{display: activeNav === "how" ? "flex" : "none"}}>
                            <div className="how-box box-single">
                                <h2>When</h2>
                                <p>Arrival is Thursday the 10th of August. It will end on Sunday after lunch, on the 13th. For a truly immersive experience we encourage all participants to stay for the entire event.</p>
                            </div>
                            <div className="how-box box-single">
                                <h2>Where</h2>
                                <p>The event will take place outside in a forest somewhere in the Eksjö Municipality, in the south of Sweden. You are required to bring everything you need to camp comfortably outdoors and cook, during your stay. Food is not included but there is water for drinking and cooking. There is a lake nearby for swimming. It is possible to get there by both car and public transport.</p>
                            </div>
                            <div className="how-box box-single">
                                <h2>Tickets</h2>
                                <p>Early bird tickets will start at 1400 SEK. Regular tickets are 1600 SEK. After you've signed up, you will receive an email to purchase your ticket. The amount of tickets are limited to ~ 200 people.</p>
                            </div>
                            <div className="how-box box-single">
                                <h2>Principles</h2>
                                <p>We apply the following burner principles: Radical self-reliance, Participation, Immediacy, and Leave a Better Trace. It is very important to note that this event is not suitable for children, pets or those who struggle with sensory overstimulation. We craft experiences that are not only beautiful or magical but sometimes also frightening and provocative, all in the name of art.</p>
                            </div>
                            <div className="how-box box-double">
                                <h2>Creators</h2>
                                <p>We who organise this event are an international art collective called The Glade. We have members from the Nordics as well as other parts of the world. We are a ​​tribe of visionaries, artists, and technicians who are driven to create multidisciplinary art experiences that connect us to the wilderness. We welcome people from all walks of life and though we do not have any political or religious associations, we do feel a spiritual connection to the divinity of nature. If you wish to get in contact with us feel free to reach out at dwellers.of.the.glade@gmail.com</p>
                            </div>
                        </div>

                        <div id="signup-tickets" style={{display: activeNav === "tickets" ? "block" : "none"}}>


                            <div className="ticket-wrapper">
                                <h1>Early bird tickets</h1>
                                <h2>Three-Day Tickets | 1400 SEK</h2>
                                <p>inclusive of booking fee and local taxes.</p>
                            </div>

                            <br/>

                            <div className="ticket-wrapper">
                                <h1>General tickets</h1>
                                <h2>Three-Day Tickets | 1600 SEK</h2>
                                <p>inclusive of booking fee and local taxes.</p>
                            </div>

                            <br/>

                            <p>The amount of tickets are limited to ~200 people.</p>
                            <p>After you've signed up, you will receive an email to purchase your ticket.</p>

                        </div>

                        <div id="signup-signup" style={{display: activeNav === "signup" ? "block" : "none"}}>
                            <SignupForm/>
                        </div>
                    </div>

            </div>
        </div>
  )
}

export default Signup