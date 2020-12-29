import Toolbar from "@material-ui/core/Toolbar";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AuthApi from "../contexts/Auth";
import Grid from "@material-ui/core/Grid";
import React, { useCallback } from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import network from "../network/index";
import { financial } from "../functions/helpers";
import { useEffect, useState } from "react";
import UpdateMoney from "./UpdateMoney";
import CircleLoading from "./CircularLoading";

export default function Header({ classes, handleDrawerOpen, drawerOpen }) {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { userValue } = React.useContext(AuthApi);
  const [currentUser, setCurrentUser] = userValue;
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const getUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await network.get("/users/info");
      setLoading(false);
      if (data.cash === 0) {
        setOpenModal(true);
      }
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleProfile = useCallback(() => {
    setAnchorEl(null);
    history.push("/profile");
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await network.post("/auth/logout", {
        token: Cookies.get("refreshToken"),
      });
      Cookies.remove("accessToken");
      Cookies.remove("userId");
      Cookies.remove("refreshToken");
      Cookies.remove("rememberMe");
      Cookies.remove("username");
      setCurrentUser(null);
      history.push("/login");
      setAnchorEl(null);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: drawerOpen,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, drawerOpen && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          InvestMe
        </Typography>
        {loading ? (
           <Grid
           container
           direction="row"
           justify="center"
           alignItems="flex-start"
         >
          <CircleLoading />
          </Grid>
        ) : (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={4} sm={5}>
              {/* <Typography className={classes.title}>total money</Typography> */}
            </Grid>
            <Grid item xs={4} sm={2}>
              <Typography className={classes.title}>
                cash: {currentUser.cash}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2}>
              <Typography className={classes.title}>
                investments: {financial(currentUser.investments)}
              </Typography>
            </Grid>
          </Grid>
        )}
        {auth && (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
              <Typography>&nbsp;{currentUser.username}</Typography>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>logout</MenuItem>
              <MenuItem onClick={handleProfile}>My account</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
      {openModal && (
        <UpdateMoney
          getUserInfo={getUserInfo}
          setOpen={setOpenModal}
          open={openModal}
        />
      )}
    </AppBar>
    // </div>
  );
}
