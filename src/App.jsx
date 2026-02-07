import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import TVShows from "./pages/TV_Shows/TV_Shows";
import Player from "./pages/Player/Player";
import Login from "./pages/Login/login";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/player/:id" element={<Player />} />
      </Route>
    </Routes>
  );
}
