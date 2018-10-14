import React from 'react';
import { connect } from 'react-redux';
import ImageButton from '../ImageButton/ImageButton';

import MaterialGrid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import './Grid.scss';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Grid extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h2">
                        Layout
                    </Typography>

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
                </Paper>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {

    };
};

export default withStyles(styles)(connect(mapStateToProps)(Grid));