'use strict';
import { LikeButton } from './likeButton.js';
import { List } from './list.js';

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
            <LikeButton />
        </div>
        )
    }
}

ReactDOM.render(e(App), domContainer);
