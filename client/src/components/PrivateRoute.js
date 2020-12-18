import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
// import { useAuth } from '../contexts/AuthContext'
import AuthApi from "../contexts/Auth";
import Cookies from "js-cookie";
import { useHistory, Link } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
  // const { currentUser } = useAuth()
  const { userValue } = React.useContext(AuthApi);
  const [currentUser, setCurrentUser] = userValue;
  const history = useHistory();

  useEffect(() => {
    let rememberMeValue = Cookies.get("rememberMe");
    let token = Cookies.get("accessToken");
    if (token) {
      setCurrentUser({
        id: Cookies.get("userId"),
        username: Cookies.get("username"),
      });
    } else {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      Cookies.remove('userId');
      Cookies.remove('username');
      Cookies.remove('rememberMe');
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
