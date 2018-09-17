import React from 'react';
import { connect } from 'react-redux';
import ImageButton from '../ImageButton/ImageButton';

import MaterialGrid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withTheme from '@material-ui/core/styles/withTheme';

import './Grid.scss';

const styles = theme => ({
    root: {
      ...theme.typography.button,
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing.unit,
    },
  });
  

class Grid extends React.Component {

    render() {
        return (
            <div className="grid">
                {[1, 2, 3].map(rowNumber => (
                    <MaterialGrid container justify="center" key={"row-"+rowNumber}>
                    {[1,2,3,4,5].map(colNumber => (
                        <MaterialGrid item key={"col-"+rowNumber+"-"+colNumber}>
                            <Paper className="cell-wrapper">
                                <ImageButton row={rowNumber} col={colNumber} />
                            </Paper>
                        </MaterialGrid>
                    ))}
                    </MaterialGrid>
                ))}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {

    };
};

export default withTheme(styles)(connect(mapStateToProps)(Grid));