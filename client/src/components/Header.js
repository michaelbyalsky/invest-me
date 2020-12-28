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
import { userMoneyState } from "../recoil/Atom";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import UpdateMoney from './UpdateMoney'

export default function Header({ classes, handleDrawerOpen, drawerOpen }) {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { userValue } = React.useContext(AuthApi);
  const [currentUser, setCurrentUser] = userValue;
  const [userMoney, setUserMoney] = useRecoilState(userMoneyState);
  const [openModal, setOpenModal] = useState(false)
  const history = useHistory();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

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

  const fetchUserMoney = useCallback(async () => {
    try {
      const {
        data: { cash },
      } = await network.get("/transactions/money");
      const { data } = await network.get("/transactions/investments");
      setUserMoney({
        cash: cash,
        investments: financial(data[0].currentPrice / 100),
      });
      if (cash == 0){
       setOpenModal(true) 
      }
    } catch (err) {
      console.error(err);
    }
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
    fetchUserMoney();
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
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Grid item xs={6} sm={5}>
            {/* <Typography className={classes.title}>total money</Typography> */}
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography className={classes.title}>
              cash: {userMoney.cash}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography className={classes.title}>
              investments: {userMoney.investments}
            </Typography>
          </Grid>
        </Grid>
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
      <UpdateMoney setOpen={setOpenModal} open={openModal} />
    </AppBar>
    // </div>
  );
}
