import React, { useState } from 'react';
import ReactQRCode from 'react-qr-code';
import { Dialog, Fab } from '@material-ui/core';

export default function QRCode() {

    const [open, setOpen] = useState(false);

    return <React.Fragment>
        <Fab onClick={() => setOpen(true)}>
            <QRIcon diameter={25}/>
        </Fab>
        <Dialog
            open={open}
            onClose={() => setOpen(false)}>
            <ReactQRCode value={window.location.href}/>
        </Dialog>
    </React.Fragment>
}

function QRIcon({ diameter }) {
    return <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width={`${diameter}px`} height={`${diameter}px`} viewBox="0 0 401.994 401.994">
    <g>
    <g>
        <path d="M0,401.991h182.724V219.265H0V401.991z M36.542,255.813h109.636v109.352H36.542V255.813z"/>
        <rect x="73.089" y="292.355" width="36.544" height="36.549"/>
        <rect x="292.352" y="365.449" width="36.553" height="36.545"/>
        <rect x="365.442" y="365.449" width="36.552" height="36.545"/>
        <polygon points="365.446,255.813 328.904,255.813 328.904,219.265 219.265,219.265 219.265,401.991 255.813,401.991 
            255.813,292.355 292.352,292.355 292.352,328.904 401.991,328.904 401.991,219.265 401.991,219.265 365.446,219.265 		"/>
        <path d="M0,182.728h182.724V0H0V182.728z M36.542,36.542h109.636v109.636H36.542V36.542z"/>
        <rect x="73.089" y="73.089" width="36.544" height="36.547"/>
        <path d="M219.265,0v182.728h182.729V0H219.265z M365.446,146.178H255.813V36.542h109.633V146.178z"/>
        <rect x="292.352" y="73.089" width="36.553" height="36.547"/>
    </g>
    </g>
    </svg>
}