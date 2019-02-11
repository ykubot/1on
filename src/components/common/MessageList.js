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
                                    {message.itsMe ? 'Me: ' : ''}
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
    display: flex;
    flex-direction: column;
    align-items: center;
`

const MessageListLiStyle = styled.li`
    width: 100%;
    padding: 5px;
`

const MessageMeBoxStyle = styled.div`
    background-color: #8E76B6; 
    margin-left: 1em;
    padding: 5px 10px;
    border-radius: 15px;
`

const MessageBoxStyle = styled.div`
    background-color: #FFFFFF; 
    margin-right: 1em;
    padding: 5px;
    border: .5px solid #323940;
    border-radius: 15px;
`

export default MessageList;