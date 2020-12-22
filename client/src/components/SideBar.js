import { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Link } from "react-router-dom";
import WorkIcon from "@material-ui/icons/Work";
import BarChartIcon from "@material-ui/icons/BarChart";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import TuneIcon from "@material-ui/icons/Tune";

const SideBar = ({
  classes,
  handleDrawerOpen,
  drawerOpen,
  handleDrawerClose,
}) => {
  const theme = useTheme();

  const items = [
    {
      path: "/",
      title: "Home",
      icon: <HomeIcon />,
    },
    {
      path: "/all-stocks",
      title: "all stocks",
      icon: <BarChartIcon />,
    },
    {
      path: "/portfolio",
      title: "portfolio",
      icon: <WorkIcon />,
    },
    {
      path: "/competition",
      title: "competition",
      icon: <GroupIcon />,
    },
    {
      path: "/calculator",
      title: "calculator",
      icon: <TuneIcon />,
    },
  ];

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      BackdropProps={{ invisible: false }}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        {items.map((item, index) => (
          <Link to={item.path} push>
            <ListItem button key={item}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
