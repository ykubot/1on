import React, { Component } from 'react';
import styled from 'styled-components';

class MessageList extends Component {
    render() {
        return(
            <MessageListUlStyle className="message-list">                 
                {this.props.messages.map(message => {
                    if(message.itsMe) {
                        return (
                            <MessageListLiStyle key={message.id}>
                                <MessageMeBoxStyle>
                                    {message.text}
                                </MessageMeBoxStyle>
                            </MessageListLiStyle>
                        )
                    }
                    return (
                        <MessageListLiStyle key={message.id}>
                            <MessageBoxStyle>
                                {message.text}
                            </MessageBoxStyle>
                        </MessageListLiStyle>
                    )
                })}
            </MessageListUlStyle>
        );
    }
}

const MessageListUlStyle = styled.ul`
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const MessageListLiStyle = styled.li`
    width: 100%;
    padding: 5px;
`

const MessageMeBoxStyle = styled.div`
    background-color: #45b2d3;
    color: #FFFFFF;
    margin-left: 1em;
    padding: 5px 10px;
    border-radius: 15px;
`

const MessageBoxStyle = styled.div`
    background-color: #FFFFFF; 
    margin-right: 1em;
    padding: 5px 10px;
    border: .5px solid #EEEEEE;
    border-radius: 15px;
`

export default MessageList;