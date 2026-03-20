import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import TvShows from "./pages/Tv_Shows/Tv_Shows";
import Player from "./pages/Player/Player";
import Login from "./pages/Login/login";
import MyList from "./pages/My_List/MyList";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-shows" element={<TvShows />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/player/:id" element={<Player />} />
      </Route>
    </Routes>
  );
}
