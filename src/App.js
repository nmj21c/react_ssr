import React from "react";
import Helmet from "react-helmet";
import { Route, Switch } from "react-router-dom";
import loadable from "@loadable/component";

const Home = loadable(() => import(/* webpackChunkName: "Home" */ "./pages/Home"));
const Header = loadable(() => import(/* webpackChunkName: "Header" */ "./components/Header"));
const News = loadable(() => import(/* webpackChunkName: "News" */ "./pages/News"));
const Footer = loadable(() => import(/* webpackChunkName: "Footer" */ "./components/Footer"));

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
        <Footer />
    </div>
)