'use strict';

const e = React.createElement;
const domContainer = document.getElementById('app');

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return 'You did not liked this.';
        }
        return <button onClick={() => this.setState({ liked: true })}>Like</button>
    }
}

ReactDOM.render(e(LikeButton), domContainer);
