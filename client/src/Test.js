import React from 'react';

class Test extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            html:""
        }
    }

    componentDidMount(){
        const result = fetch(
            "http://localhost:3000/",
        ).then(res=>res.text()).then(text=>this.setState({html:text}))
    }

    render(){
        return(
            <div dangerouslySetInnerHTML={{__html:this.state.html}}/>
        );
    }
}

export default Test;