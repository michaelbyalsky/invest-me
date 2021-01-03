
import React from "react";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import WorkIcon from "@material-ui/icons/Work";
import BarChartIcon from "@material-ui/icons/BarChart";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import TuneIcon from "@material-ui/icons/Tune";

const SideBar = ({
  classes,
  drawerOpen,
  handleDrawerClose,
}) => {
  const theme = useTheme();

  const items = [
    {
      testId:"home",
      path: "/",
      title: "Home",
      icon: <HomeIcon />,
    },
    {
      testId:"allStocks",
      path: "/all-stocks",
      title: "all stocks",
      icon: <BarChartIcon />,
    },
    {
      testId:"portfolio",
      path: "/portfolio",
      title: "portfolio",
      icon: <WorkIcon />,
    },
    {
      testId:"competition",
      path: "/competition",
      title: "competition",
      icon: <GroupIcon />,
    },
    {
      testId:"calculator",
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
            <ListItem testId={item.testId} button key={item}>
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
