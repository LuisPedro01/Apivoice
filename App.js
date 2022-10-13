import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StyleSheet, Text, View } from "react-native";

import './App.css'
import Home from "./src/Screens/Home";
import NavBar from "./src/components/Header";
import Footer from "./src/components/Footer";

export default function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route />
          <Route />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

