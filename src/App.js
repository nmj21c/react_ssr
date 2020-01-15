import React from "react";
import Helmet from "react-helmet";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import News from "./pages/News";


export default () => (
    <div>
        <Helmet>
            <title>App</title>
        </Helmet>
        <Route path="/" render={() => <Header/>} />
        <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/news" render={() => <News />} />
        </Switch>
    </div>
)