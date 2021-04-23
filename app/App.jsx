'use strict';
import React from 'react'
import ReactDOM from 'react-dom'

import { List } from './list.jsx';

const e = React.createElement;
const domContainer = document.getElementById('app');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { test: 'test' };
    }

    render() {

        return (
        <div>
            <h1> Todos </h1>
            <List />
        </div>
        )
    }
}

ReactDOM.render(e(App), domContainer);
