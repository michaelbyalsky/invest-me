import React, { useEffect, useCallback, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
// import { useAuth } from '../contexts/AuthContext'
import AuthApi from "../contexts/Auth";
import Cookies from "js-cookie";
import network from "../network/index";

export default function PrivateRoute({ component: Component, ...rest }) {
  // const { currentUser } = useAuth()
  const { userValue } = React.useContext(AuthApi);
  const [currentUser, setCurrentUser] = userValue;
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await network.get("/users/info");
      setLoading(false);
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
    let token = Cookies.get("accessToken");
    if (token) {
      return;
    } else {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("userId");
      Cookies.remove("username");
      Cookies.remove("rememberMe");
      history.push("/login");
    }
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        return Cookies.get("accessToken") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to="/login
            "
          />
        );
      }}
    ></Route>
  );
}
