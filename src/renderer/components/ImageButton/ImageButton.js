import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import './ImageButton.scss';

class ImageButton extends React.Component {

    clickButton(evt) {
        console.log(evt, this.props.col, this.props.row);
    }

    render() {
        const {col, row} = this.props;

        return (
            <div className="image-button" onClick={(evt) => this.clickButton(evt)}>
                <Typography component="div" variant="body1">
                    {col}, {row}
                </Typography>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps)(ImageButton);