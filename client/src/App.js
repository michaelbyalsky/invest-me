import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthApi from "./contexts/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Portfolio from "./components/Portfolio";
import { useStyles } from "./AppStyle";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import clsx from "clsx";
import SideBar from "./components/SideBar";
import BigDataList from "./components/BigDataList";
import Calculator from "./components/Calculator";
import Profile from "./components/Profile";
import Competition from "./components/Competition";
import OneStock from "./components/OneStock";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  return (
    <AuthApi.Provider
      value={{
        userValue: [currentUser, setCurrentUser],
      }}
    >
      <Router>
        <div className={classes.wrapper}>
          <div className={classes.root}>
            <CssBaseline />
            {currentUser && (
              <Header
                handleDrawerClose={handleDrawerClose}
                drawerOpen={drawerOpen}
                handleDrawerOpen={handleDrawerOpen}
                classes={classes}
              />
            )}
            {currentUser && (
              <SideBar
                handleDrawerClose={handleDrawerClose}
                drawerOpen={drawerOpen}
                handleDrawerOpen={handleDrawerOpen}
                classes={classes}
              />
            )}
            <Switch>
              <main
                className={clsx(classes.content, {
                  [classes.contentShift]: drawerOpen,
                })}
              >
                <div className={classes.drawerHeader} />
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute exact path="/portfolio" component={Portfolio} />
                <PrivateRoute
                  exact
                  path="/all-stocks"
                  component={BigDataList}
                />
                <PrivateRoute exact path="/calculator" component={Calculator} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute
                  exact
                  path="/competition"
                  component={Competition}
                />
                <PrivateRoute
                  exact
                  path="/one-stock/:symbol"
                  component={OneStock}
                />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                {/* <Route component={NotFound} /> */}
              </main>
            </Switch>
          </div>
          <div className={classes.footer}>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthApi.Provider>
  );
}

export default App;
