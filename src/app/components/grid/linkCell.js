import React,{ Component }  from 'react';
import { Route, Link } from "react-router-dom";
class LinkCell extends Component {
    constructor(props) {
        super(props);
    }
 
    render(){
        return (
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                <Link
                    to={this.props.link}
                    className="df line"
                    onClick={this.props.onclick}
                >
                <p>{this.props.value}</p>
                </Link>
            </div>
        );
    }
}
export default LinkCell;
