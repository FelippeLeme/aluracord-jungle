import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import HeaderMenu from '../components/HeaderMenu';

function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
            ${Tag} {
                color: ${appConfig.theme.colors.neutrals['000']};
                font-size: 24px;
                font-weight: 600;
            }
            `}</style>
        </>
    );
}

export default function PaginaInicial() {

    const [username, setUsername] = React.useState('FelippeLeme')
    const [githubAccount, setGithubAccount] = React.useState('')
    const [heroe, setHeroe] = React.useState('marvel')

    const roteamento = useRouter()

    useEffect(() => {
        fetch(`https://api.github.com/users/${username}`)
            .then((res) => {
                if (!res.ok) {
                    throw Error('Não conseguiu fazer a requisição')
                }
                return res.json()
            })
            .then(async (resultado) => {
                await setGithubAccount(resultado)
                sessionStorage.setItem('userName' , resultado.name)
                sessionStorage.setItem('userIcon' , resultado.login)
            })
            .catch(err => {
                console.log(err.message)
            })
    }, [username])

    useEffect(() => {
        sessionStorage.setItem('heroeTheme', heroe)
    }, [heroe])


    return (
        <>
            <HeaderMenu heroe={ heroe } toogle={ setHeroe } />
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors[heroe]['000'],
                    backgroundImage: appConfig.theme.colors[heroe].imageBackground,
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        minHeight: '360px',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals[700] + 90
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (event) {
                            event.preventDefault()
                            roteamento.push('/chat')
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px'
                        }}
                    >
                        <Titulo tag="h2">Boas vindas de volta!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            fullWidth
                            value={username}
                            onChange={function (event) {
                                const valor = event.target.value
                                setUsername(valor)
                            }}
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors[heroe][500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors[heroe][600],
                                mainColorLight: appConfig.theme.colors[heroe][400],
                                mainColorStrong: appConfig.theme.colors[heroe][700],
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    {username.length > 2 && (
                        <Box
                            styleSheet={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                maxWidth: '200px',
                                padding: '16px',
                                backgroundColor: appConfig.theme.colors[heroe][700],
                                border: '1px solid',
                                borderColor: appConfig.theme.colors.neutrals[999],
                                borderRadius: '10px',
                                flex: 1,
                                minHeight: '240px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    borderRadius: '50%',
                                    marginBottom: '16px',
                                }}
                                src={`https://github.com/${username}.png`}
                            />
                            <Box
                                styleSheet={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'

                                }}
                            >
                                <Text
                                    variant="body4"
                                    styleSheet={{
                                        color: appConfig.theme.colors.neutrals[200],
                                        backgroundColor: appConfig.theme.colors.neutrals[900],
                                        padding: '3px 10px',
                                        borderRadius: '1000px'
                                    }}
                                >
                                    {username}
                                </Text>
                                <ul
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                                >
                                    <li><Text variant="body4" styleSheet={{ color: appConfig.theme.colors.neutrals[300] }}> {githubAccount.name} </Text></li>
                                    <li><Text variant="body4" styleSheet={{ color: appConfig.theme.colors.neutrals[300] }}> {githubAccount.location} </Text></li>
                                    <li><a variant="body4" style={{ border: 'solid 1px grey', padding: '0px 5px', borderRadius: '10px', textDecoration: 'none', color: appConfig.theme.colors.neutrals[300], fontSize: '10px', cursor: 'pointer' }} href={ githubAccount.html_url }> Go to Git</a></li>
                                </ul>
                            </Box>

                        </Box>
                    )}
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}