import React,{useRef}  from "react";
import { Link } from "react-router-dom";



  const OptionCategory=[
    {
        type:"Find booking questions",
        questions:["What should I do if I have concerns about a specific property or host?"
        ,"Does Shrbo offer accommodations for users with specific requirements?"
        ,"How can I provide feedback to improve Shrbo's services?"
        ,"What guidelines should I follow for a smooth experience on Shrbo?"
        ,"How can I search for accommodations on Shrbo?"
        ,"What factors should I consider when choosing a property for booking?"
        ,"How can I modify or cancel my booking on Shrbo"
        ,"What payment options are available on Shrbo?"
        ,"How can I verify the legitimacy of a property on Shrbo?"
        ,"What should I do in case of issues during my stay at a property?"
        ,"Are there specific guidelines for guests on Shrbo?"
        ,"Where can I view reviews and ratings of properties on Shrbo?"
        ,"How can I find pet-friendly accommodations on Shrbo?"
        ,"Can I make last-minute changes to my booking on Shrbo?"
         ]
    },
    {type:"Shrbo Support",questions:["How can I contact Shrbo's support team?"
    ,"What should I do if I encounter technical issues on Shrbo?"
    ,"Is there a knowledge base available for common queries?"
    ,"How can I report inappropriate behavior or content?"
    ,"How does Shrbo ensure the security of user data?"
    ,"How can I change my account settings and preferences?"]},

    {type:"Find hosting questions",questions:["How can I list my property on the Shrbo platform?"
    ,"What are the criteria for becoming a Shrbo host?"
    ,"How can I manage and update my property listing on Shrbo?"
    ,"What steps should I take to ensure guest safety and comfort?"
    ,"How can I handle guest inquiries and communication effectively?"
    ,"What are the best practices for setting competitive pricing for my property?"
    ,"How can I ensure my property meets the required hosting standards?"
    ,"What should I do if I encounter issues with a guest during their stay?"
    ,"How can I enhance the appeal of my property listing to attract more guests?"
    ,"What steps can I take to handle guest reviews and feedback effectively?"
    ,"Cancellation Options"]},
]


const ChatOptions=({selectedOption})=>{
    
const handleBookingQuestion = (question) => {
    // Handle booking question logic
    goTo.current.click();

    console.log(`Booking Question Selected: ${question}`);
    // You can send a message or perform other actions based on the selected question
  };

//   const handleHostingQuestion = (question,e) => {
//     e.preventDefault();
//     // Handle hosting question logic
//     console.log(`Hosting Question Selected: ${question}`);
//     // You can send a message or perform other actions based on the selected question
//   }; {` ${report.index===reportType?"block":"hidden"} transition-3`}

    const goTo=useRef(null);
    return(
        <>
           
           {/* {selectedOption === "Find booking questions" && ( */}
                <div className="self-start flex flex-row flex-wrap gap-3 text-sm max-w-[300px] " >
                {OptionCategory.map((cat) =>
                    cat.questions.map((question, index) => (
                    <button
                        key={index}
                        type="button"
                        className={` ${cat.type===selectedOption?"block":"hidden"} transition-3 text-slate-800 hover:bg-gray-300 bg-gray-200  hover:bg-blend-darken  p-2 rounded-lg`}
                        onClick={(e) => { e.preventDefault();handleBookingQuestion(question)}}
                        
                    >
                        {question}
                    </button>
                    ))
                )}
                </div>
      {/* )} */}

            <Link ref={goTo} to={"/FAQAccordion"} />
        </>

    )

}

export default ChatOptions;