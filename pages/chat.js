import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState, useEffect } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function ChatPage() {
    
    const [message, setMessage] = React.useState('')
    const [messageList, setMessageList] = React.useState([])
    const [theme, setTheme] = useState('marvel')
    const [icon, setIcon] = useState(null)
    const [name, setName] = useState('Loading...')

    useEffect(() => {
        supabaseClient
          .from('mensagens')
          .select('*')
          .order('id', { ascending: false })
          .then(({ data }) => {
            console.log('Dados da consulta:', data);
            setMessageList(data);
          });
      }, []);

    useEffect(() => setTheme(sessionStorage.heroeTheme), [])
    useEffect(() => setIcon(sessionStorage.userIcon), [])
    useEffect(() => setName(sessionStorage.userName), [])

    function handleNewMessage(newMessage) {
        const mensagem = {
          // id: listaDeMensagens.length + 1,
          de: name,
          texto: newMessage,
        };
    
        supabaseClient
          .from('mensagens')
          .insert([
            // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
            mensagem
          ])
          .then(({ data }) => {
            console.log('Criando mensagem: ', data);
            setMessageList([
              data[0],
              ...messageList,
            ]);
          });
    
        setMessage('');
      }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors[theme][500],
                backgroundImage: appConfig.theme.colors[theme].imageBackground,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList messages={messageList} user={ icon } setMessageList = { setMessageList } />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => {
                                setMessage(event.target.value)
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault()
                                    handleNewMessage(message)
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    function handleDelete(id) {
        const deleteMsg = props.messages.filter((message) => message.id !== id);
        props.setMessageList(deleteMsg);
    }

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map((msg, index) => {
                return (
                    <Text
                        key={index}
                        id={msg.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${props.user}.png`}
                            />
                            <Text tag="strong">
                                {msg.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Button
                                iconName="FaTrash"
                                variant="tertiary"
                                colorVariant="neutral"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(msg.id);
                                }}
                            />
                        </Box>
                        {msg.texto}
                    </Text>
                )
            })}

        </Box>
    )
}