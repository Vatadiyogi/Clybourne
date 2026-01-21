import React from 'react';

export default function VerticalStickWithBox({ count = 1 }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', height: 'auto' }}>
            {/* Vertical stick */}
            <div style={{
                width: '2px',
                height: '100%',
                backgroundColor: '#1aa79c',
                position: 'relative'
            }}>
                {/* Box attached to the right of the stick, vertically centered */}
                <div style={{
                    position: 'absolute',
                    left: '8%',
                    top: '30%',
                    transform: 'translateY(-50%)',
                    marginLeft: '0px',
                    padding: '4px 10px',
                    backgroundColor: '#1aa79c',
                    borderTopRightRadius: '2px',
                    borderBottomRightRadius: '2px',
                    borderTopLeftRadius: '0px',
                    borderBottomLeftRadius: '0px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#fff', // white text for contrast
                    whiteSpace: 'nowrap'
                }}>
                    {count+1}
                </div>
            </div>
        </div>
    );
}
