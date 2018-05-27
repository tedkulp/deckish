import React from 'react';
import { connect } from 'react-redux';
import ImageButton from '../ImageButton/ImageButton';

import './Grid.scss';

class Grid extends React.Component {

    render() {
        return (
            <div className="grid">
                {[1, 2, 3].map(rowNumber => (
                    <div className="grid-row row" key={rowNumber}>
                        <div className="col-md-12">
                            <div className="grid-col first">
                                <ImageButton row={rowNumber} col={1} />
                            </div>
                            <div className="grid-col">
                                <ImageButton row={rowNumber} col={2} />
                            </div>
                            <div className="grid-col">
                                <ImageButton row={rowNumber} col={3} />
                            </div>
                            <div className="grid-col">
                                <ImageButton row={rowNumber} col={4} />
                            </div>
                            <div className="grid-col">
                                <ImageButton row={rowNumber} col={5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps)(Grid);