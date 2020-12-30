import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push("/");
  }, []);
  return (
    <div>
      <div>404 not found</div>
      <button onClick={handleClick}>Back to home</button>
    </div>
  );
};

export default NotFound;
