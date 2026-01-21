import React from 'react';

const NotAuthorised = () => {
    return (
        <div style={styles.container}>
            <p style={styles.text}>Not Authorised for this action:</p>
                Back
        </div>
    );
}

// Basic styles
const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f2f3f6',
    },
    text: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
    },
};

export default NotAuthorised;
