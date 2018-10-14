import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Grid from '../Grid/Grid';
import Settings from '../Settings/Settings';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

<Grid />

const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    },
    chartContainer: {
        marginLeft: -22,
    },
    tableContainer: {
        height: 320,
    },
    toolbar: theme.mixins.toolbar,
});

const drawerWidth = 200;

class Main extends React.Component {

    state = {
        open: true,
        selectedIndex: 1,
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    menuSelect = (evt, idx) => {
        this.setState({ selectedIndex: idx });
    };

    renderSelectedScreen = () => {
        switch(this.state.selectedIndex) {
            case 1:
                return (<Grid />);
            case 2:
                return (<Settings />);
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <div className={classes.root}>
                    <AppBar position="absolute" className={classNames(classes.appBar)}>
                        <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
                            {/* <Typography
                                component="h1"
                                variant="title"
                                color="inherit"
                                noWrap
                                className={classes.title}
                            >
                                Dashboard
                            </Typography> */}
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                        }}
                        open={this.state.open}>
                        <div className={classes.toolbar} />
                        <List>
                            <ListItem button selected={this.state.selectedIndex === 1} onClick={evt => this.menuSelect(evt, 1)}>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Layout" />
                            </ListItem>
                            <ListItem button selected={this.state.selectedIndex === 2} onClick={evt => this.menuSelect(evt, 2)}>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>
                        </List>
                        <Divider />
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <div className={classes.tableContainer}>
                          { this.renderSelectedScreen() }
                        </div>
                    </main>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {

    };
};

export default withStyles(styles)(connect(mapStateToProps)(Main));