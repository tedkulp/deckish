import React from 'react';
import { connect } from 'react-redux';

import './ImageButton.scss';

class ImageButton extends React.Component {

    clickButton(evt) {
        console.log(evt, this.props.col, this.props.row);
    }

    render() {
        const {col, row} = this.props;

        return (
            <div className="image-button" onClick={(evt) => this.clickButton(evt)}>
                {col}, {row}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps)(ImageButton);