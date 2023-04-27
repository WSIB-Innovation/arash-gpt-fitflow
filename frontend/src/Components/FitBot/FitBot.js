import React, { useEffect, useState }from 'react';
import './FitBot.scss';
import axios from 'axios';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar } from '@chatscope/chat-ui-kit-react';
import gpt from '../../images/gpt.png'



// Icons

function FitBot() {
    const [messages, setMessages] = useState([
        {
            message: "Hello, I am your personal Fitness Bot!",
            sender: "assistant"
        }
    ])
    const [isTyping, setTyping] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => { 
        const id = localStorage.getItem('id');
        axios.get(`http://localhost:5000/users/${id}`).then(
            res => {
                setUserData(res.data);
            }
        ).catch(error => {
            console.error(error);
        });
    },[]);

    async function handleSend(messageText) {
        const message = {
            message: messageText,
            sender: "user",
            direction: "outgoing"
        }

        const newMessageArr = [...messages, message];
        setMessages(newMessageArr);

        setTyping(true);

        let apiMessages = newMessageArr.map((message) => {
            return {role: message.sender, content: message.message};
        })

        let systemMessage = {
            role: "system",
            content: "Explain everthing as a personal trainer. If you feel that you are incapable of providing an answer, do your best and do not mention that you are an AI. Do not mention that you are an AI language model, you are a personal trainer. Here is some background info on the user in JSON format: " + JSON.stringify(userData)
        }

        const sendMessages = [systemMessage, ...apiMessages];

        try {
            const res = await axios.get("http://localhost:5000/users/fitbot", { 
                params: {
                    messages: JSON.stringify(sendMessages),
                    dummy: '12'
                }
            });


            setMessages([...newMessageArr, {
                message: res.data.content,
                sender: "assistant"
            }]);
            setTyping(false);

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className='fitBot'>

            <div className='container-fluid'>
                <h1>Introducing FitBot, your very own AI fitness pal!</h1>
                <h5>FitBot can answer questions on anything related to fitness. Ask him about form, nutrition, exercises, or anything else!</h5>


                <div className='bot'>
                    <MainContainer>
                        <Avatar src={gpt} name={"assistant"} />
                        <ChatContainer>       
                            <MessageList 
                            scrollBehavior="smooth" 
                            typingIndicator={isTyping ? <TypingIndicator content="FitFlow Bot is typing" /> : null}
                            >
                            {messages.map((message, i) => {
                                return <Message key={i} model={message} />
                            })}
                            </MessageList>
                            <MessageInput placeholder="Let me know what I can help with!" onSend={handleSend} attachButton={false} autoFocus={true}/>        
                        </ChatContainer>
                    </MainContainer>
                </div>
            
            </div>
        </div>
    );
}

export default FitBot;
