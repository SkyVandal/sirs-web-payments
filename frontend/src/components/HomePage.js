import React, {Fragment, useEffect, useState} from "react";
import {Checkout} from "./Checkout";

export const HomePage = (props) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setIsAuth(true);
    }
  }, []);
  return(
    isAuth === true ? (
      <Fragment>
        <Checkout />
      </Fragment>
    ) : (
      <Fragment>
        <img src="https://i.imgur.com/EHyR2nP.png" />
      </Fragment>
    )
  )
};