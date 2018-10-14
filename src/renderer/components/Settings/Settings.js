import React from 'react';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Settings extends React.Component {
    
    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h2">
                        Settings
                    </Typography>
                </Paper>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {

    };
};

export default withStyles(styles)(connect(mapStateToProps)(Settings));