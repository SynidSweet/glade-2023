import React, { useState } from 'react';
import './signupform.scss';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com';

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


const SignupForm = () => {

    const [submitted, setSubmitted] = useState(false);
    const [buttonText, setButtonText] = useState("Sign up");
    const [done, setDone] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {

        setSubmitted(true);
        setButtonText("Submitting...");

        fetch(
            'https://v1.nocodeapi.com/dreamish/google_sheets/KRmeODGfcfgNalRm?tabId=Submits', {
                method: 'post',
                headers: myHeaders,
                redirect: "follow",
                body: JSON.stringify
                    ([[
                    data.is18yo,
                    data.date_available,
                    data.name,
                    data.email,
                    data.phone,
                    data.motivation,
                    data.connection_nature,
                    data.connection_inner_nature,
                    data.life_description,
                    data.expectation,
                    data.contribute,
                    ]])
            }
            ).then((response) => {       
                
                setDone(true);
                setButtonText("Thank you!");
                document.querySelector('#submit-button').style.color = "#65f08a";

                emailjs.send('the_glade_signup', 'template_dh511t9', data, 'UYJcIQoTKDxnxfNYW')
                .then((result) => {
                    console.log(result.text);
                }, (error) => {
                    console.log(error.text);
                });
                	                
            }).catch((error) => {
                console.log(error);
        });

    }

    return (
    <form onSubmit={handleSubmit(onSubmit)} id="form">

    <div className="question-item">
        <label className="label">Are you above 18 y/o?</label>
        <input type="hidden" name="18yo" value="no" />

        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">

            <div className="checkbox-radio-container">
                <input type="radio" name="18yo" value="yes" id="18yo-yes" className="radio" disabled={submitted} {...register('is18yo', { required: true })}/>
                <label htmlFor="18yo-yes" className="label">Yes</label>
            </div>
            <div className="checkbox-radio-container">
                <input type="radio" name="18yo" value="no" id="18yo-no"  className="radio" disabled={submitted} {...register('is18yo', { required: true })}/>
                <label htmlFor="18yo-no" className="label">No</label>
            </div>
        </div>
    </div>


    <div className="question-item">
        <label className="label">Are you available for all of the dates: 10th, 11th, 12th and 13th of August?</label>


        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
            <div className="checkbox-radio-container">
                <input type="radio" name="date_available" value="yes" id="date_available-yes" className="radio" disabled={submitted} {...register('date_available', { required: true })}/>
                <label htmlFor="date_available-yes" className="label">Yes</label>
            </div>
            <div className="checkbox-radio-container">
                <input type="radio" name="date_available" value="no" id="date_available-no"  className="radio" disabled={submitted} {...register('date_available', { required: true })}/>
                <label htmlFor="date_available-no" className="label">No</label>
            </div>
        </div>
    </div>

    <div className="question-item">
        <label htmlFor="motivation" className="label">What is your motivation to participate in this event?</label>
        <input type="text" name="motivation" id="motivation" className="text-input" maxLength="250" disabled={submitted} {...register("motivation")}/>
    </div>

    <div className="question-item">
        <label htmlFor="connection_nature" className="label">What is your connection to nature?</label>
        <input type="text" name="connection_nature" id="connection_nature" className="text-input"  maxLength="250" disabled={submitted} {...register("connection_nature")}/>
    </div>

    <div className="question-item">
        <label htmlFor="connection_inner_nature" className="label">What is your connection to your inner nature?</label>
        <input type="text" name="connection_inner_nature" id="connection_inner_nature" className="text-input"  maxLength="250" disabled={submitted} {...register("connection_inner_nature")}/>
    </div>

    <div className="question-item">
        <label htmlFor="life_description" className="label">Describe your life in one sentence.</label>
        <textarea name="life_description" className="textarea text-input"  maxLength="500" disabled={submitted} {...register("life_description")}></textarea>
    </div>

    <div className="question-item">
        <label htmlFor="expectation" className="label">What do you hope to experience during this event?</label>
        <input type="text" name="expectation" id="expectation" className="text-input" maxLength="250" disabled={submitted} {...register("expectation")}/>
    </div>

    <div className="question-item">
        <label htmlFor="contribute" className="label">If anything, what would you like to contribute with to this event?</label>
        <input type="text" name="contribute" id="contribute" className="text-input" maxLength="250" disabled={submitted} {...register("contribute")}/>
    </div>

    <br/>
    <br/>

    <label className="label">When signing up for this event you agree to the following:</label>

    <div className="checkbox-radio-container question-item">
        <input type="hidden" name="agreement[attendence]" value="no" />
        <input type="checkbox" name="agreement[attendence]" value="yes" className="checkbox" id="agreement-attendence" required disabled={submitted}/>
        <label htmlFor="agreement-attendence" className="label">I have the intention to fully participate in the event and attend all of the days. </label>
    </div>

    <div className="checkbox-radio-container question-item">
        <input type="hidden" name="agreement[understand]" value="no" />
        <input type="checkbox" name="agreement[understand]" value="yes" id="agreement-understand" className="checkbox" required disabled={submitted}/>
        <label htmlFor="agreement-understand" className="label">
            I understand that this event may start emotional processes and unlock many
            hidden doors in myself and others. I want to do my best to meet everything with love, respect and compassion.
        </label>
    </div>

    <div className="checkbox-radio-container question-item">
        <input type="hidden" name="agreement[deep_willing]" value="no" />
        <input type="checkbox" name="agreement[deep_willing]" value="yes" className="checkbox" id="agreement-deep_willing" required disabled={submitted}/>
        <label htmlFor="agreement-deep_willing" className="label">I am willing to go deep within myself with the intention to rediscover my true nature.</label>
    </div>


    <div className="checkbox-radio-container question-item">
        <input type="hidden" name="agreement[needs]" value="no" />
        <input type="checkbox" name="agreement[needs]" value="yes" className="checkbox" id="agreement-needs" required disabled={submitted}/>
        <label htmlFor="agreement-needs" className="label">I am willing to stay attuned to the needs of my body and psychological wellbeing.</label>
    </div>

    <div className="checkbox-radio-container question-item">
        <input type="hidden" name="agreement[inclusive]" value="no" />
        <input type="checkbox" name="agreement[inclusive]" value="yes" id="agreement-inclusive"  className="checkbox" required disabled={submitted}/>
        <label htmlFor="agreement-inclusive" className="label">I understand that this is an inclusive event for all kinds of people. That discrimination, exclusion or derogatory behaviour will not be tolerated. </label>
    </div>

    <div className="checkbox-radio-container question-item">
        <input type="hidden" name="agreement[assistance]" value="no" />
        <input type="checkbox" name="agreement[assistance]" value="yes" id="agreement-assistance"  className="checkbox" required disabled={submitted}/>
        <label htmlFor="agreement-assistance" className="label">I understand the organisers are here to help and I am willing to come to them for assistance or support if needed.</label>
    </div>

    <div className="checkbox-radio-container question-item">
        <input type="hidden" name="agreement[gdpr]" value="no" />
        <input type="checkbox" name="agreement[gdpr]" value="yes" id="agreement-gdpr"  className="checkbox" required disabled={submitted}/>
        <label htmlFor="agreement-gdpr" className="label">I understand my details will be saved in accordance with GDPR.</label>
    </div>

    <div className="question-item">
        <label htmlFor="name" className="label">Your name</label>
        <input type="text" name="name" id="name" className="text-input" required maxLength="60" disabled={submitted} {...register('name', { required: true })}/>
    </div>

    <div className="question-item">
        <label htmlFor="email" className="label">Your e-mail</label>
        <input type="email" name="email" id="email" className="text-input" required maxLength="250" disabled={submitted} {...register('email', { required: true })}/>
    </div>

    <div className="question-item">
        <label htmlFor="phone_number" className="label">Phone number</label>
        <input type="text" name="phone_number" id="phone_number" className="text-input" required maxLength="30" disabled={submitted} {...register('phone', { required: true })}/>
    </div>

    <br/>
    <br/>
    <br/>
    <br/>


    <div id="submit-button-wrapper">
        <button id="submit-button"
            type="submit"
            className="button-arounder"
        >
            {buttonText}
        </button>
    </div>

    <br/>
    <br/>
            

        </form>
    );
};

export default SignupForm;
