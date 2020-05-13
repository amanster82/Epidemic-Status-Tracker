import React from 'react';

const MyContext = React.createContext(defaultValue);

function MyProvider(props) {
    return (
        <MyContext.Provider value="I'm the value">
            {this.props.children}
        </MyContext.Provider>
    );
}

export default MyProvider;