import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import aicon from '../assets/Avatar.png';
import profilephoto from '../assets/ProfilePhoto.jpg';
import FetchAPI from './FetchAPI';
import { Avatar, Box, Typography, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function MessageLine({ chatId }) {
    const navigate = useNavigate();
    const [chatMessages, setChatsMessages] = useState([]);

    useEffect(() => {
        if (chatId !== 0) {
            async function fetchChats() {
                const response = await FetchAPI(`Chats/ChatMessages?chatId=${parseInt(chatId)}`, "GET");
                setChatsMessages(response.result);
            }
            fetchChats();
        } else {
            setChatsMessages(null);
        }
    }); // Add chatId as a dependency

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
    };

    const renderMessageContent = (message) => {
        if (message.type === "text") {
            if (isTableFormat(message.messageContent)) {
                const [intro, tableContent, outro] = splitTableIntroOutro(message.messageContent);
                return (
                    <>
                        {intro && <Typography sx={{ fontSize: 'small', color: 'white', marginBottom: 2 }}>{intro}</Typography>}
                        {renderTable(tableContent)}
                        {outro && <Typography sx={{ fontSize: 'small', color: 'white', marginTop: 2 }}>{outro}</Typography>}
                    </>
                );
            } else if (isTreeFormat(message.messageContent)) {
                return renderTree(JSON.parse(message.messageContent));
            } else if (isCodeFormat(message.messageContent)) {
                return renderTextWithCode(message.messageContent);
            } else {
                return <ReactMarkdown children={message.messageContent} remarkPlugins={[remarkGfm]} components={{ p: ({ node, ...props }) => <Typography {...props} sx={{ color: 'white' }} /> }} />;
            }
        } else if (message.type === "image_url") {
            return <img src={message.messageImage} alt="user upload" style={{ maxHeight: '300px', maxWidth: '300px', borderRadius: 5 }} />;
        }
    };
    
    

    const renderTextWithCode = (content) => {
        const parts = content.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (isCodeFormat(part)) {
                return renderCode(part, index);
            } else {
                return <Typography key={index} sx={{ color: 'white', marginBottom: 2 }}>{part}</Typography>;
            }
        });
    };

    const isCodeFormat = (content) => {
        const codeBlockPattern = /```([\s\S]*?)```/g;
        return codeBlockPattern.test(content);
    };

    const renderCode = (content, key) => {
        const codeBlockPattern = /```(.*?)\n([\s\S]*?)```/;
        const match = content.match(codeBlockPattern);
    
        if (match) {
            const language = match[1].trim();
            const code = match[2].trim();
    
            return (
                <Box key={key} sx={{ position: 'relative', backgroundColor: '#2d2d2d', borderRadius: 1, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e1e1e', borderTopLeftRadius: 1, borderTopRightRadius: 1, p: '4px 8px' }}>
                        <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>{language}</Typography>
                        <Box sx={{ position: 'relative' }}>
                            <IconButton
                                onClick={() => copyToClipboard(code)}
                                sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, p: '4px' }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                            <Box sx={{ display: 'none', position: 'absolute', top: '100%', right: 0, backgroundColor: '#1e1e1e', color: 'white', padding: '2px 4px', borderRadius: 1, fontSize: '0.75rem' }}>
                                Copy
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <SyntaxHighlighter language={language} style={coy}>
                            {code}
                        </SyntaxHighlighter>
                    </Box>
                </Box>
            );
        } else {
            return null;
        }
    };
    
    
    
    const isTableFormat = (content) => {
        return content.includes('|') && content.includes('\n');
    };

    const splitTableIntroOutro = (content) => {
        const lines = content.split('\n');
        const tableStartIndex = lines.findIndex(line => line.includes('|'));
        const tableEndIndex = lines.slice(tableStartIndex).findIndex(line => !line.includes('|')) + tableStartIndex;
        const intro = lines.slice(0, tableStartIndex).join('\n').trim();
        const tableContent = lines.slice(tableStartIndex, tableEndIndex).join('\n').trim();
        const outro = lines.slice(tableEndIndex).join('\n').trim();
        return [intro, tableContent, outro];
    };
    
    

    const renderTable = (content) => {
        const rows = content.split('\n').map(row => row.split('|').map(cell => cell.trim()));
        return (
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            {rows[0].map((cell, index) => (
                                <TableCell key={index} style={{ fontWeight: 'bold', color: 'white', backgroundColor: '#242424' }}>
                                    {formatCell(cell)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(1).map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex} style={{ color: 'white', backgroundColor: '#242424' }}>
                                        {formatCell(cell)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const formatCell = (cell) => {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const headerRegex = /\*(.*?)\*/g;

        if (boldRegex.test(cell)) {
            return <span style={{ fontWeight: 'bold' }}>{cell.replace(boldRegex, '$1')}</span>;
        } else if (headerRegex.test(cell)) {
            return <span style={{ fontWeight: 'bold', fontSize: 'larger' }}>{cell.replace(headerRegex, '$1')}</span>;
        } else {
            return cell;
        }
    };

    const isTreeFormat = (content) => {
        try {
            const parsed = JSON.parse(content);
            return parsed && typeof parsed === 'object';
        } catch {
            return false;
        }
    };

    const renderTree = (node) => (
        <ul style={{ color: 'white' }}>
            <li>
                {node.name}
                {node.children && node.children.map(child => renderTree(child))}
            </li>
        </ul>
    );

    if (Array.isArray(chatMessages)) {
        return (
            <>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: '#242424', color: 'white' }}>
                    {chatMessages.map(c => {
                        if (c.roleName === "user") {
                            return (
                                <Box key={c.messageId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', backgroundColor: '#242424' }}>
                                    <ListItemText
                                        sx={{ mr: 2, mb: 0, textAlign: 'end', color: 'white', maxWidth: '800px' }}
                                        primary={'Osman Faruk Er'}
                                        secondary={<Typography sx={{ color: 'white' }}>{renderMessageContent(c)}</Typography>}
                                    />
                                    <Avatar src={profilephoto} />
                                </Box>
                            );
                        } else if (c.roleName === "assistant") {
                            return (
                                <Box key={c.messageId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', backgroundColor: '#242424' }}>
                                    <Avatar src={aicon} />
                                    <ListItemText
                                        sx={{ ml: 2, mb: 1.5, maxWidth: '800px', color: 'white' }}
                                        primary={'PilzAI'}
                                        secondary={<Typography sx={{ color: 'white' }}>{renderMessageContent(c)}</Typography>}
                                    />
                                </Box>
                            );
                        } else {
                            return null;
                        }
                    })}
                </Box>
                <br /><br /><br /><br />
                <br /><br /><br /><br />
            </>
        );
    } else {
        navigate({ pathname: '*' });
    }
}
